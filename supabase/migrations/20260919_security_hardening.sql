-- MyService security hardening applied to Supabase on 2026-09-19.
-- Adds company-scoped RLS, server-verified account context, and locked PIN verification.
-- This file records the already-applied production schema change.


begin;

-- Core identity helpers used by every RLS policy.
create or replace function public.my_company_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select p.company_id
  from public.profiles p
  where p.id = (select auth.uid())
    and p.active = true
$$;

create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
    and p.active = true
$$;

revoke all on function public.my_company_id() from public, anon;
revoke all on function public.my_role() from public, anon;
grant execute on function public.my_company_id() to authenticated;
grant execute on function public.my_role() to authenticated;

-- Never expose the automatic-RLS event trigger as an API RPC.
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

-- Returning-user PIN protection.
alter table public.user_quick_pins
  add column if not exists failed_attempts integer not null default 0,
  add column if not exists locked_until timestamptz,
  add column if not exists last_verified_at timestamptz;

alter table public.user_quick_pins
  drop constraint if exists user_quick_pins_failed_attempts_check;
alter table public.user_quick_pins
  add constraint user_quick_pins_failed_attempts_check
  check (failed_attempts between 0 and 5);

create or replace function public.has_my_quick_pin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select auth.uid()) is null then false
    else exists (
      select 1 from public.user_quick_pins q
      where q.user_id = (select auth.uid())
    )
  end
$$;

drop function if exists public.set_my_quick_pin(text);

create function public.set_my_quick_pin(new_pin text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  if new_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be exactly 4 digits';
  end if;

  insert into public.user_quick_pins
    (user_id, pin_hash, failed_attempts, locked_until, updated_at)
  values
    ((select auth.uid()), extensions.crypt(new_pin, extensions.gen_salt('bf')), 0, null, now())
  on conflict (user_id) do update
    set pin_hash = excluded.pin_hash,
        failed_attempts = 0,
        locked_until = null,
        updated_at = now();

  return true;
end;
$$;

create or replace function public.verify_my_quick_pin(candidate_pin text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  pin_row public.user_quick_pins%rowtype;
  next_attempts integer;
  next_lock timestamptz;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  select *
    into pin_row
  from public.user_quick_pins
  where user_id = (select auth.uid())
  for update;

  if not found then
    return jsonb_build_object(
      'verified', false,
      'setup_required', true,
      'remaining_attempts', 0
    );
  end if;

  if pin_row.locked_until is not null and pin_row.locked_until > now() then
    return jsonb_build_object(
      'verified', false,
      'locked', true,
      'locked_until', pin_row.locked_until,
      'remaining_attempts', 0
    );
  end if;

  if candidate_pin ~ '^[0-9]{4}$'
     and extensions.crypt(candidate_pin, pin_row.pin_hash) = pin_row.pin_hash then
    update public.user_quick_pins
       set failed_attempts = 0,
           locked_until = null,
           last_verified_at = now(),
           updated_at = now()
     where user_id = (select auth.uid());

    return jsonb_build_object(
      'verified', true,
      'locked', false,
      'remaining_attempts', 5
    );
  end if;

  next_attempts := least(coalesce(pin_row.failed_attempts, 0) + 1, 5);
  next_lock := case when next_attempts >= 5 then now() + interval '15 minutes' else null end;

  update public.user_quick_pins
     set failed_attempts = next_attempts,
         locked_until = next_lock,
         updated_at = now()
   where user_id = (select auth.uid());

  return jsonb_build_object(
    'verified', false,
    'locked', next_lock is not null,
    'locked_until', next_lock,
    'remaining_attempts', greatest(0, 5 - next_attempts)
  );
end;
$$;

revoke all on function public.has_my_quick_pin() from public, anon;
revoke all on function public.set_my_quick_pin(text) from public, anon;
revoke all on function public.verify_my_quick_pin(text) from public, anon;
grant execute on function public.has_my_quick_pin() to authenticated;
grant execute on function public.set_my_quick_pin(text) to authenticated;
grant execute on function public.verify_my_quick_pin(text) to authenticated;

-- Authenticated context is derived from the database, never a browser role list.
create or replace function public.get_my_app_context(company_code text default null)
returns table (
  user_id uuid,
  company_id bigint,
  company_name text,
  full_name text,
  role text,
  active boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.company_id, c.name, p.full_name, p.role, p.active
  from public.profiles p
  join public.companies c on c.id = p.company_id
  where p.id = (select auth.uid())
    and p.active = true
    and c.active = true
    and (
      company_code is null
      or c.business_code = btrim(company_code)
    )
  limit 1
$$;

revoke all on function public.get_my_app_context(text) from public, anon;
grant execute on function public.get_my_app_context(text) to authenticated;

-- Keep the familiar first six digits, now validated only on the server.
update public.companies
set business_code = '296342'
where id = 296342140657398400;

-- Table privileges: no anonymous business-data API access.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all tables in schema public from authenticated;
revoke all on all sequences in schema public from authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
revoke all on table public.user_quick_pins from authenticated;

-- Companies.
create policy companies_read_own on public.companies
for select to authenticated
using (id = (select public.my_company_id()));

create policy companies_update_admin on public.companies
for update to authenticated
using (
  id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin')
)
with check (
  id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin')
);

-- Profiles: users can read themselves; management can read their own company.
create policy profiles_read on public.profiles
for select to authenticated
using (
  id = (select auth.uid())
  or (
    company_id = (select public.my_company_id())
    and (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

-- Company locations.
create policy company_locations_read on public.company_locations
for select to authenticated
using (company_id = (select public.my_company_id()));

create policy company_locations_manage on public.company_locations
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Management-only company data.
create policy activity_accountability_manage on public.activity_accountability
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy business_expenses_manage on public.business_expenses
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy documents_manage on public.documents
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy inventory_items_manage on public.inventory_items
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy inventory_transactions_manage on public.inventory_transactions
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy purchase_orders_manage on public.purchase_orders
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy sales_manage on public.sales
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy vendors_manage on public.vendors
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Employee assignments.
create policy employee_assignments_read on public.employee_assignments
for select to authenticated
using (
  company_id = (select public.my_company_id())
  and (
    employee_id = (select auth.uid())
    or (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

create policy employee_assignments_manage on public.employee_assignments
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Customer, job and operational access.
create policy customers_read on public.customers
for select to authenticated
using (company_id = (select public.my_company_id()));

create policy customers_manage on public.customers
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy jobs_read on public.jobs
for select to authenticated
using (company_id = (select public.my_company_id()));

create policy jobs_manage on public.jobs
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy jobs_update_assigned on public.jobs
for update to authenticated
using (
  company_id = (select public.my_company_id())
  and assigned_to = (select auth.uid())
)
with check (
  company_id = (select public.my_company_id())
  and assigned_to = (select auth.uid())
);

create policy tasks_read on public.tasks
for select to authenticated
using (
  company_id = (select public.my_company_id())
  and (
    assigned_to is null
    or assigned_to = (select auth.uid())
    or (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

create policy tasks_manage on public.tasks
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy tasks_update_assigned on public.tasks
for update to authenticated
using (
  company_id = (select public.my_company_id())
  and assigned_to = (select auth.uid())
)
with check (
  company_id = (select public.my_company_id())
  and assigned_to = (select auth.uid())
);

-- Feedback: workers can submit; management can review.
create policy feedback_insert on public.feedback
for insert to authenticated
with check (company_id = (select public.my_company_id()));

create policy feedback_manage on public.feedback
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Notifications.
create policy notifications_read on public.notifications
for select to authenticated
using (
  company_id = (select public.my_company_id())
  and (
    recipient_id = (select auth.uid())
    or (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

create policy notifications_update_own on public.notifications
for update to authenticated
using (
  company_id = (select public.my_company_id())
  and recipient_id = (select auth.uid())
)
with check (
  company_id = (select public.my_company_id())
  and recipient_id = (select auth.uid())
);

create policy notifications_manage on public.notifications
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Performance reviews.
create policy performance_reviews_read on public.performance_reviews
for select to authenticated
using (
  company_id = (select public.my_company_id())
  and (
    employee_id = (select auth.uid())
    or (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

create policy performance_reviews_manage on public.performance_reviews
for all to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Support access and tickets remain company-scoped.
create policy support_location_access_read on public.support_location_access
for select to authenticated
using (
  profile_id = (select auth.uid())
  or (
    exists (
      select 1
      from public.company_locations l
      where l.id = support_location_access.location_id
        and l.company_id = (select public.my_company_id())
    )
    and (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

create policy support_location_access_manage on public.support_location_access
for all to authenticated
using (
  exists (
    select 1
    from public.company_locations l
    where l.id = support_location_access.location_id
      and l.company_id = (select public.my_company_id())
  )
  and (select public.my_role()) in ('developer','primary_admin','admin')
)
with check (
  exists (
    select 1
    from public.company_locations l
    where l.id = support_location_access.location_id
      and l.company_id = (select public.my_company_id())
  )
  and (select public.my_role()) in ('developer','primary_admin','admin')
);

create policy support_tickets_read on public.support_tickets
for select to authenticated
using (
  company_id = (select public.my_company_id())
  and (
    opened_by = (select auth.uid())
    or (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
);

create policy support_tickets_insert on public.support_tickets
for insert to authenticated
with check (
  company_id = (select public.my_company_id())
  and opened_by = (select auth.uid())
);

create policy support_tickets_manage on public.support_tickets
for update to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
)
with check (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Temperature logs and readings.
create policy temperature_logs_read on public.temperature_logs
for select to authenticated
using (company_id = (select public.my_company_id()));

create policy temperature_logs_insert on public.temperature_logs
for insert to authenticated
with check (company_id = (select public.my_company_id()));

create policy temperature_logs_update on public.temperature_logs
for update to authenticated
using (company_id = (select public.my_company_id()))
with check (company_id = (select public.my_company_id()));

create policy temperature_logs_delete on public.temperature_logs
for delete to authenticated
using (
  company_id = (select public.my_company_id())
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

create policy temperature_readings_read on public.temperature_log_readings
for select to authenticated
using (
  exists (
    select 1 from public.temperature_logs l
    where l.id = temperature_log_readings.temperature_log_id
      and l.company_id = (select public.my_company_id())
  )
);

create policy temperature_readings_insert on public.temperature_log_readings
for insert to authenticated
with check (
  entered_by = (select auth.uid())
  and exists (
    select 1 from public.temperature_logs l
    where l.id = temperature_log_readings.temperature_log_id
      and l.company_id = (select public.my_company_id())
  )
);

create policy temperature_readings_update on public.temperature_log_readings
for update to authenticated
using (
  exists (
    select 1 from public.temperature_logs l
    where l.id = temperature_log_readings.temperature_log_id
      and l.company_id = (select public.my_company_id())
  )
  and (
    entered_by = (select auth.uid())
    or (select public.my_role()) in ('developer','primary_admin','admin','manager')
  )
)
with check (
  exists (
    select 1 from public.temperature_logs l
    where l.id = temperature_log_readings.temperature_log_id
      and l.company_id = (select public.my_company_id())
  )
);

create policy temperature_readings_delete on public.temperature_log_readings
for delete to authenticated
using (
  exists (
    select 1 from public.temperature_logs l
    where l.id = temperature_log_readings.temperature_log_id
      and l.company_id = (select public.my_company_id())
  )
  and (select public.my_role()) in ('developer','primary_admin','admin','manager')
);

-- Release notes are globally readable after sign-in, writable only by developer.
create policy release_notes_read on public.release_notes
for select to authenticated
using (true);

create policy release_notes_manage on public.release_notes
for all to authenticated
using ((select public.my_role()) = 'developer')
with check ((select public.my_role()) = 'developer');

commit;


-- Move privileged implementations behind an unexposed private schema.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.my_company_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select p.company_id
  from public.profiles p
  where p.id = (select auth.uid())
    and p.active = true
$$;

create or replace function private.my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
    and p.active = true
$$;

revoke all on function private.my_company_id() from public, anon;
revoke all on function private.my_role() from public, anon;
grant execute on function private.my_company_id() to authenticated;
grant execute on function private.my_role() to authenticated;

create or replace function public.my_company_id()
returns bigint
language sql
stable
security invoker
set search_path = ''
as $$ select private.my_company_id() $$;

create or replace function public.my_role()
returns text
language sql
stable
security invoker
set search_path = ''
as $$ select private.my_role() $$;

create or replace function private.has_my_quick_pin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select auth.uid()) is null then false
    else exists (
      select 1 from public.user_quick_pins q
      where q.user_id = (select auth.uid())
    )
  end
$$;

create or replace function private.set_my_quick_pin(new_pin text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  if new_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be exactly 4 digits';
  end if;

  insert into public.user_quick_pins
    (user_id, pin_hash, failed_attempts, locked_until, updated_at)
  values
    ((select auth.uid()), extensions.crypt(new_pin, extensions.gen_salt('bf')), 0, null, now())
  on conflict (user_id) do update
    set pin_hash = excluded.pin_hash,
        failed_attempts = 0,
        locked_until = null,
        updated_at = now();

  return true;
end;
$$;

create or replace function private.verify_my_quick_pin(candidate_pin text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  pin_row public.user_quick_pins%rowtype;
  next_attempts integer;
  next_lock timestamptz;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  select *
    into pin_row
  from public.user_quick_pins
  where user_id = (select auth.uid())
  for update;

  if not found then
    return jsonb_build_object('verified', false, 'setup_required', true, 'remaining_attempts', 0);
  end if;

  if pin_row.locked_until is not null and pin_row.locked_until > now() then
    return jsonb_build_object(
      'verified', false, 'locked', true,
      'locked_until', pin_row.locked_until, 'remaining_attempts', 0
    );
  end if;

  if candidate_pin ~ '^[0-9]{4}$'
     and extensions.crypt(candidate_pin, pin_row.pin_hash) = pin_row.pin_hash then
    update public.user_quick_pins
       set failed_attempts = 0, locked_until = null,
           last_verified_at = now(), updated_at = now()
     where user_id = (select auth.uid());

    return jsonb_build_object('verified', true, 'locked', false, 'remaining_attempts', 5);
  end if;

  next_attempts := least(coalesce(pin_row.failed_attempts, 0) + 1, 5);
  next_lock := case when next_attempts >= 5 then now() + interval '15 minutes' else null end;

  update public.user_quick_pins
     set failed_attempts = next_attempts, locked_until = next_lock, updated_at = now()
   where user_id = (select auth.uid());

  return jsonb_build_object(
    'verified', false, 'locked', next_lock is not null,
    'locked_until', next_lock, 'remaining_attempts', greatest(0, 5 - next_attempts)
  );
end;
$$;

revoke all on function private.has_my_quick_pin() from public, anon;
revoke all on function private.set_my_quick_pin(text) from public, anon;
revoke all on function private.verify_my_quick_pin(text) from public, anon;
grant execute on function private.has_my_quick_pin() to authenticated;
grant execute on function private.set_my_quick_pin(text) to authenticated;
grant execute on function private.verify_my_quick_pin(text) to authenticated;

create or replace function public.has_my_quick_pin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$ select private.has_my_quick_pin() $$;

create or replace function public.set_my_quick_pin(new_pin text)
returns boolean
language sql
security invoker
set search_path = ''
as $$ select private.set_my_quick_pin(new_pin) $$;

create or replace function public.verify_my_quick_pin(candidate_pin text)
returns jsonb
language sql
security invoker
set search_path = ''
as $$ select private.verify_my_quick_pin(candidate_pin) $$;

create or replace function public.get_my_app_context(company_code text default null)
returns table (
  user_id uuid,
  company_id bigint,
  company_name text,
  full_name text,
  role text,
  active boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select p.id, p.company_id, c.name, p.full_name, p.role, p.active
  from public.profiles p
  join public.companies c on c.id = p.company_id
  where p.id = (select auth.uid())
    and p.active = true
    and c.active = true
    and (company_code is null or c.business_code = btrim(company_code))
  limit 1
$$;

update public.companies
set business_code = '296342'
where business_code = '733490';

commit;

