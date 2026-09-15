/* =========================================================
   MYDETAIL — MVP APPLICATION
   Five Star Detail
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "mydetail_mvp_v2";

const defaultState = {
  companyName: "Five Star Detail",

  currentUser: null,

  users: [
    {
      id: "admin-1",
      name: "Admin",
      email: "admin@mydetail.test",
      password: "admin123",
      role: "Admin",
      active: true
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      email: "manager@mydetail.test",
      password: "manager123",
      role: "Manager",
      active: true
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      email: "employee@mydetail.test",
      password: "employee123",
      role: "Employee",
      active: true
    }
  ],

  employees: [
    {
      id: "employee-1",
      name: "Employee Demo",
      role: "Employee",
      status: "Off Clock",
      hours: 0,
      clockIn: null,
      lunchStart: null,
      location: null
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      role: "Manager",
      status: "Off Clock",
      hours: 0,
      clockIn: null,
      lunchStart: null,
      location: null
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Example Customer",
      phone: "(555) 555-0101",
      email: "",
      vehicle: "2022 Honda Civic"
    },
    {
      id: "cust-2",
      name: "Example Customer 2",
      phone: "(555) 555-0102",
      email: "",
      vehicle: "2021 Ford F-150"
    }
  ],

  jobs: [
    {
      id: "job-1",
      customer: "Example Customer",
      vehicle: "2022 Honda Civic",
      employee: "Employee Demo",
      time: "9:00 AM",
      status: "Scheduled",
      price: 225,
      checklist: {},
      beforePhotos: [],
      afterPhotos: []
    },
    {
      id: "job-2",
      customer: "Example Customer 2",
      vehicle: "2021 Ford F-150",
      employee: "Manager Demo",
      time: "1:00 PM",
      status: "Scheduled",
      price: 300,
      checklist: {},
      beforePhotos: [],
      afterPhotos: []
    }
  ],

  punches: [],
  cashDrops: [],
  ptoRequests: [],
  notifications: [],

  activity: [
    {
      id: "welcome",
      title: "MyDetail workspace loaded",
      description: "MVP dashboard is ready.",
      time: new Date().toLocaleString(),
      icon: "✓"
    }
  ]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return clone(defaultState);
    }

    const parsed = JSON.parse(saved);

    return {
      ...clone(defaultState),
      ...parsed,

      users: Array.isArray(parsed.users)
        ? parsed.users
        : clone(defaultState.users),

      employees: Array.isArray(parsed.employees)
        ? parsed.employees
        : clone(defaultState.employees),

      customers: Array.isArray(parsed.customers)
        ? parsed.customers
        : clone(defaultState.customers),

      jobs: Array.isArray(parsed.jobs)
        ? parsed.jobs
        : clone(defaultState.jobs),

      punches: Array.isArray(parsed.punches)
        ? parsed.punches
        : [],

      cashDrops: Array.isArray(parsed.cashDrops)
        ? parsed.cashDrops
        : [],

      ptoRequests: Array.isArray(parsed.ptoRequests)
        ? parsed.ptoRequests
        : [],

      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : [],

      activity: Array.isArray(parsed.activity)
        ? parsed.activity
        : clone(defaultState.activity)
    };
  } catch (error) {
    console.error("MyDetail storage error:", error);
    return clone(defaultState);
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function money(value) {
  return Number(value || 0).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  );
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value;
  }
}

function isAdmin() {
  return state.currentUser?.role === "Admin";
}

function isManagerOrAdmin() {
  return ["Admin", "Manager"].includes(
    state.currentUser?.role
  );
}

function currentEmployee() {
  return (
    state.employees.find(
      employee =>
        employee.id === state.currentUser?.id
    ) || null
  );
}

function addActivity(
  title,
  description,
  icon = "•"
) {
  state.activity.unshift({
    id: uid("activity"),
    title,
    description,
    icon,
    time: new Date().toLocaleString()
  });

  state.activity =
    state.activity.slice(0, 100);

  saveState();
}

function notify(title, message) {
  state.notifications.unshift({
    id: uid("notification"),
    title,
    message,
    read: false,
    time: new Date().toLocaleString()
  });

  state.notifications =
    state.notifications.slice(0, 100);

  saveState();
}
/* =========================================================
   MYDETAIL — MVP APPLICATION
   Five Star Detail
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "mydetail_mvp_v2";

const defaultState = {
  companyName: "Five Star Detail",

  currentUser: null,

  users: [
    {
      id: "admin-1",
      name: "Admin",
      email: "admin@mydetail.test",
      password: "admin123",
      role: "Admin",
      active: true
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      email: "manager@mydetail.test",
      password: "manager123",
      role: "Manager",
      active: true
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      email: "employee@mydetail.test",
      password: "employee123",
      role: "Employee",
      active: true
    }
  ],

  employees: [
    {
      id: "employee-1",
      name: "Employee Demo",
      role: "Employee",
      status: "Off Clock",
      hours: 0,
      clockIn: null,
      lunchStart: null,
      location: null
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      role: "Manager",
      status: "Off Clock",
      hours: 0,
      clockIn: null,
      lunchStart: null,
      location: null
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Example Customer",
      phone: "(555) 555-0101",
      email: "",
      vehicle: "2022 Honda Civic"
    },
    {
      id: "cust-2",
      name: "Example Customer 2",
      phone: "(555) 555-0102",
      email: "",
      vehicle: "2021 Ford F-150"
    }
  ],

  jobs: [
    {
      id: "job-1",
      customer: "Example Customer",
      vehicle: "2022 Honda Civic",
      employee: "Employee Demo",
      time: "9:00 AM",
      status: "Scheduled",
      price: 225,
      checklist: {},
      beforePhotos: [],
      afterPhotos: []
    },
    {
      id: "job-2",
      customer: "Example Customer 2",
      vehicle: "2021 Ford F-150",
      employee: "Manager Demo",
      time: "1:00 PM",
      status: "Scheduled",
      price: 300,
      checklist: {},
      beforePhotos: [],
      afterPhotos: []
    }
  ],

  punches: [],
  cashDrops: [],
  ptoRequests: [],
  notifications: [],

  activity: [
    {
      id: "welcome",
      title: "MyDetail workspace loaded",
      description: "MVP dashboard is ready.",
      time: new Date().toLocaleString(),
      icon: "✓"
    }
  ]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return clone(defaultState);
    }

    const parsed = JSON.parse(saved);

    return {
      ...clone(defaultState),
      ...parsed,

      users: Array.isArray(parsed.users)
        ? parsed.users
        : clone(defaultState.users),

      employees: Array.isArray(parsed.employees)
        ? parsed.employees
        : clone(defaultState.employees),

      customers: Array.isArray(parsed.customers)
        ? parsed.customers
        : clone(defaultState.customers),

      jobs: Array.isArray(parsed.jobs)
        ? parsed.jobs
        : clone(defaultState.jobs),

      punches: Array.isArray(parsed.punches)
        ? parsed.punches
        : [],

      cashDrops: Array.isArray(parsed.cashDrops)
        ? parsed.cashDrops
        : [],

      ptoRequests: Array.isArray(parsed.ptoRequests)
        ? parsed.ptoRequests
        : [],

      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : [],

      activity: Array.isArray(parsed.activity)
        ? parsed.activity
        : clone(defaultState.activity)
    };
  } catch (error) {
    console.error("MyDetail storage error:", error);
    return clone(defaultState);
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function money(value) {
  return Number(value || 0).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  );
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value;
  }
}

function isAdmin() {
  return state.currentUser?.role === "Admin";
}

function isManagerOrAdmin() {
  return ["Admin", "Manager"].includes(
    state.currentUser?.role
  );
}

function currentEmployee() {
  return (
    state.employees.find(
      employee =>
        employee.id === state.currentUser?.id
    ) || null
  );
}

function addActivity(
  title,
  description,
  icon = "•"
) {
  state.activity.unshift({
    id: uid("activity"),
    title,
    description,
    icon,
    time: new Date().toLocaleString()
  });

  state.activity =
    state.activity.slice(0, 100);

  saveState();
}

function notify(title, message) {
  state.notifications.unshift({
    id: uid("notification"),
    title,
    message,
    read: false,
    time: new Date().toLocaleString()
  });

  state.notifications =
    state.notifications.slice(0, 100);

  saveState();
}
/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {
  const completedJobs =
    state.jobs.filter(
      job => job.status === "Completed"
    );

  const revenue =
    completedJobs.reduce(
      (total, job) =>
        total + Number(job.price || 0),
      0
    );

  const activeEmployees =
    state.employees.filter(
      employee =>
        employee.status === "Clocked In" ||
        employee.status === "Lunch"
    ).length;

  setText(
    "totalCustomers",
    state.customers.length
  );

  setText(
    "activeJobs",
    state.jobs.filter(
      job =>
        job.status !== "Completed" &&
        job.status !== "Cancelled"
    ).length
  );

  setText(
    "activeEmployees",
    activeEmployees
  );

  setText(
    "totalRevenue",
    money(revenue)
  );

  renderEmployeeHome();
}

/* =========================================================
   EMPLOYEE HOME / SHIFT CONTROLS
   ========================================================= */

function renderEmployeeHome() {
  const employee =
    currentEmployee();

  if (!employee) {
    return;
  }

  let panel =
    $("mydetail-shift-panel");

  if (!panel) {
    panel =
      document.createElement("div");

    panel.id =
      "mydetail-shift-panel";

    panel.style.cssText = `
      background:white;
      border-radius:18px;
      padding:20px;
      margin:18px 0;
      box-shadow:0 5px 20px rgba(0,0,0,.08);
    `;

    const dashboard =
      document.querySelector(
        "#dashboard, #dashboardSection, [data-section='dashboard']"
      );

    if (dashboard) {
      dashboard.prepend(panel);
    } else {
      document.body.appendChild(
        panel
      );
    }
  }

  panel.innerHTML = `
    <div style="
      font-size:14px;
      color:#667085;
      margin-bottom:4px;
    ">
      CURRENT SHIFT
    </div>

    <div style="
      font-size:25px;
      font-weight:800;
      margin-bottom:6px;
    ">
      ${escapeHTML(employee.name)}
    </div>

    <div style="
      font-size:16px;
      margin-bottom:10px;
    ">
      Status:
      <strong>
        ${escapeHTML(employee.status || "Off Clock")}
      </strong>
    </div>

    <div
      id="liveShiftTimer"
      style="
        font-size:36px;
        font-weight:900;
        margin-bottom:18px;
      "
    >
      00:00:00
    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
    ">

      <button
        onclick="clockIn()"
        style="
          min-height:75px;
          border:0;
          border-radius:14px;
          background:#1677ff;
          color:white;
          font-size:18px;
          font-weight:800;
        "
      >
        CLOCK IN
      </button>

      <button
        onclick="clockOut()"
        style="
          min-height:75px;
          border:0;
          border-radius:14px;
          background:#101828;
          color:white;
          font-size:18px;
          font-weight:800;
        "
      >
        CLOCK OUT
      </button>

      <button
        onclick="startLunch()"
        style="
          min-height:70px;
          border:1px solid #d0d5dd;
          border-radius:14px;
          background:white;
          font-size:17px;
          font-weight:800;
        "
      >
        START LUNCH
      </button>

      <button
        onclick="endLunch()"
        style="
          min-height:70px;
          border:1px solid #d0d5dd;
          border-radius:14px;
          background:white;
          font-size:17px;
          font-weight:800;
        "
      >
        END LUNCH
      </button>

    </div>
  `;

  updateShiftTimer();
}

function addPunch(
  employee,
  type
) {
  state.punches.unshift({
    id: uid("punch"),
    employeeId: employee.id,
    employeeName: employee.name,
    type,
    timestamp:
      new Date().toISOString()
  });
}

function clockIn() {
  const employee =
    currentEmployee();

  if (!employee) {
    alert(
      "No employee profile is connected to this account."
    );
    return;
  }

  if (
    employee.status === "Clocked In" ||
    employee.status === "Lunch"
  ) {
    alert(
      "You are already clocked in."
    );
    return;
  }

  employee.status =
    "Clocked In";

  employee.clockIn =
    new Date().toISOString();

  employee.lunchStart = null;

  addPunch(
    employee,
    "Clock In"
  );

  addActivity(
    "Employee clocked in",
    `${employee.name} clocked in.`,
    "⏱"
  );

  saveState();
  renderEverything();
}

function clockOut() {
  const employee =
    currentEmployee();

  if (
    !employee ||
    !employee.clockIn
  ) {
    alert(
      "You are not clocked in."
    );
    return;
  }

  const start =
    new Date(
      employee.clockIn
    ).getTime();

  const now =
    Date.now();

  const hours =
    Math.max(
      0,
      (now - start) / 3600000
    );

  employee.hours =
    Number(
      (
        Number(employee.hours || 0) +
        hours
      ).toFixed(2)
    );

  addPunch(
    employee,
    "Clock Out"
  );

  addActivity(
    "Employee clocked out",
    `${employee.name} clocked out.`,
    "✓"
  );

  employee.status =
    "Off Clock";

  employee.clockIn = null;
  employee.lunchStart = null;

  saveState();
  renderEverything();
}

function startLunch() {
  const employee =
    currentEmployee();

  if (
    !employee ||
    employee.status !==
      "Clocked In"
  ) {
    alert(
      "Clock in before starting lunch."
    );
    return;
  }

  employee.status =
    "Lunch";

  employee.lunchStart =
    new Date().toISOString();

  addPunch(
    employee,
    "Start Lunch"
  );

  addActivity(
    "Lunch started",
    `${employee.name} started lunch.`,
    "☕"
  );

  saveState();
  renderEverything();
}

function endLunch() {
  const employee =
    currentEmployee();

  if (
    !employee ||
    employee.status !== "Lunch"
  ) {
    alert(
      "No lunch is currently active."
    );
    return;
  }

  employee.status =
    "Clocked In";

  employee.lunchStart = null;

  addPunch(
    employee,
    "End Lunch"
  );

  addActivity(
    "Lunch ended",
    `${employee.name} ended lunch.`,
    "✓"
  );

  saveState();
  renderEverything();
}

window.clockIn = clockIn;
window.clockOut = clockOut;
window.startLunch = startLunch;
window.endLunch = endLunch;

function updateShiftTimer() {
  const timer =
    $("liveShiftTimer");

  if (!timer) {
    return;
  }

  const employee =
    currentEmployee();

  if (
    !employee ||
    !employee.clockIn
  ) {
    timer.textContent =
      "00:00:00";
    return;
  }

  const elapsed =
    Math.max(
      0,
      Date.now() -
        new Date(
          employee.clockIn
        ).getTime()
    );

  const totalSeconds =
    Math.floor(
      elapsed / 1000
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  timer.textContent =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}

setInterval(
  updateShiftTimer,
  1000
);
/* =========================================================
   EMPLOYEES
   ========================================================= */

function renderEmployees() {
  const container =
    $("employeeList") ||
    $("employeesList");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.employees
      .map(employee => `
        <div class="card" style="
          background:white;
          padding:16px;
          margin-bottom:12px;
          border-radius:14px;
        ">
          <strong>
            ${escapeHTML(employee.name)}
          </strong>

          <div>
            ${escapeHTML(employee.role)}
          </div>

          <div>
            Status:
            ${escapeHTML(
              employee.status ||
              "Off Clock"
            )}
          </div>

          <div>
            Hours:
            ${Number(
              employee.hours || 0
            ).toFixed(2)}
          </div>
        </div>
      `)
      .join("");
}

/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {
  const container =
    $("customerList") ||
    $("customersList");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.customers
      .map(customer => `
        <div class="card" style="
          background:white;
          padding:16px;
          margin-bottom:12px;
          border-radius:14px;
        ">
          <strong>
            ${escapeHTML(customer.name)}
          </strong>

          <div>
            ${escapeHTML(
              customer.vehicle || ""
            )}
          </div>

          <div>
            ${escapeHTML(
              customer.phone || ""
            )}
          </div>

          <div>
            ${escapeHTML(
              customer.email || ""
            )}
          </div>
        </div>
      `)
      .join("");
}

function createCustomer() {
  const name =
    prompt("Customer name:");

  if (!name) {
    return;
  }

  const phone =
    prompt("Phone number:") || "";

  const email =
    prompt("Email:") || "";

  const vehicle =
    prompt(
      "Vehicle (year, make, model):"
    ) || "";

  state.customers.push({
    id: uid("customer"),
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    vehicle: vehicle.trim()
  });

  addActivity(
    "Customer added",
    `${name.trim()} was added.`,
    "👤"
  );

  saveState();
  renderEverything();
}

window.createCustomer =
  createCustomer;

/* =========================================================
   JOBS
   ========================================================= */

function renderJobs() {
  const container =
    $("jobList") ||
    $("jobsList");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.jobs
      .map(job => `
        <div class="card" style="
          background:white;
          padding:16px;
          margin-bottom:12px;
          border-radius:14px;
        ">

          <strong>
            ${escapeHTML(job.customer)}
          </strong>

          <div>
            ${escapeHTML(job.vehicle)}
          </div>

          <div>
            ${escapeHTML(job.time || "")}
          </div>

          <div>
            Assigned:
            ${escapeHTML(
              job.employee || "Unassigned"
            )}
          </div>

          <div>
            Status:
            <strong>
              ${escapeHTML(job.status)}
            </strong>
          </div>

          <div>
            ${money(job.price)}
          </div>

          ${
            job.status !== "Completed"
              ? `
                <button
                  onclick="completeJob('${job.id}')"
                  style="
                    margin-top:10px;
                    padding:10px 14px;
                    border:0;
                    border-radius:9px;
                    background:#1677ff;
                    color:white;
                    font-weight:700;
                  "
                >
                  Complete Job
                </button>
              `
              : ""
          }

        </div>
      `)
      .join("");
}

function createJob() {
  const customer =
    prompt("Customer name:");

  if (!customer) {
    return;
  }

  const vehicle =
    prompt("Vehicle:") || "";

  const employee =
    prompt(
      "Assigned employee:"
    ) || "Unassigned";

  const time =
    prompt(
      "Appointment time:"
    ) || "";

  const price =
    Number(
      prompt(
        "Job price:"
      ) || 0
    );

  state.jobs.push({
    id: uid("job"),
    customer:
      customer.trim(),
    vehicle:
      vehicle.trim(),
    employee:
      employee.trim(),
    time:
      time.trim(),
    status: "Scheduled",
    price,
    checklist: {},
    beforePhotos: [],
    afterPhotos: []
  });

  addActivity(
    "Job created",
    `${customer.trim()} — ${vehicle.trim()}`,
    "🚗"
  );

  saveState();
  renderEverything();
}

function completeJob(jobId) {
  const job =
    state.jobs.find(
      item =>
        item.id === jobId
    );

  if (!job) {
    return;
  }

  job.status =
    "Completed";

  addActivity(
    "Job completed",
    `${job.customer} — ${job.vehicle}`,
    "✓"
  );

  notify(
    "Detail completed",
    `${job.customer}'s detail was completed.`
  );

  saveState();
  renderEverything();
}

window.createJob =
  createJob;

window.completeJob =
  completeJob;

/* =========================================================
   SCHEDULE
   ========================================================= */

function renderSchedule() {
  const container =
    $("scheduleList") ||
    $("appointmentList");

  if (!container) {
    return;
  }

  const jobs =
    [...state.jobs].sort(
      (a, b) =>
        String(a.time).localeCompare(
          String(b.time)
        )
    );

  container.innerHTML =
    jobs
      .map(job => `
        <div style="
          background:white;
          padding:14px;
          margin-bottom:10px;
          border-radius:12px;
        ">
          <strong>
            ${escapeHTML(
              job.time || "Unscheduled"
            )}
          </strong>

          <div>
            ${escapeHTML(job.customer)}
          </div>

          <div>
            ${escapeHTML(job.vehicle)}
          </div>

          <div>
            ${escapeHTML(job.status)}
          </div>
        </div>
      `)
      .join("");
}

/* =========================================================
   PUNCH LOG
   ========================================================= */

function renderPunches() {
  const container =
    $("punchList") ||
    $("timecardList");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.punches.length
      ? state.punches
          .map(punch => `
            <div style="
              background:white;
              padding:12px;
              margin-bottom:8px;
              border-radius:10px;
            ">
              <strong>
                ${escapeHTML(
                  punch.employeeName
                )}
              </strong>

              <div>
                ${escapeHTML(
                  punch.type
                )}
              </div>

              <small>
                ${new Date(
                  punch.timestamp
                ).toLocaleString()}
              </small>
            </div>
          `)
          .join("")
      : "<p>No punches yet.</p>";
}
/* =========================================================
   PTO
   ========================================================= */

function renderPTO() {
  const container =
    $("ptoList");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.ptoRequests.length
      ? state.ptoRequests
          .map(request => `
            <div style="
              background:white;
              padding:14px;
              margin-bottom:10px;
              border-radius:12px;
            ">
              <strong>
                ${escapeHTML(
                  request.employeeName
                )}
              </strong>

              <div>
                ${escapeHTML(
                  request.date
                )}
              </div>

              <div>
                ${escapeHTML(
                  request.reason
                )}
              </div>

              <div>
                Status:
                <strong>
                  ${escapeHTML(
                    request.status
                  )}
                </strong>
              </div>

              ${
                isManagerOrAdmin() &&
                request.status === "Pending"
                  ? `
                    <button
                      onclick="approvePTO('${request.id}')"
                    >
                      Approve
                    </button>
                  `
                  : ""
              }
            </div>
          `)
          .join("")
      : "<p>No PTO requests.</p>";
}

function requestPTO() {
  const employee =
    currentEmployee();

  if (!employee) {
    alert(
      "No employee profile found."
    );
    return;
  }

  const date =
    prompt(
      "Requested date:"
    );

  if (!date) {
    return;
  }

  const reason =
    prompt(
      "Reason:"
    ) || "";

  state.ptoRequests.unshift({
    id: uid("pto"),
    employeeId:
      employee.id,
    employeeName:
      employee.name,
    date:
      date.trim(),
    reason:
      reason.trim(),
    status: "Pending"
  });

  addActivity(
    "PTO requested",
    `${employee.name} requested PTO for ${date}.`,
    "📅"
  );

  saveState();
  renderEverything();
}

function approvePTO(id) {
  if (!isManagerOrAdmin()) {
    alert(
      "Manager or Admin access required."
    );
    return;
  }

  const request =
    state.ptoRequests.find(
      item =>
        item.id === id
    );

  if (!request) {
    return;
  }

  request.status =
    "Approved";

  addActivity(
    "PTO approved",
    `${request.employeeName}'s PTO was approved.`,
    "✓"
  );

  saveState();
  renderEverything();
}

window.requestPTO =
  requestPTO;

window.approvePTO =
  approvePTO;

/* =========================================================
   ACTIVITY
   ========================================================= */

function renderActivity() {
  const container =
    $("activityList") ||
    $("liveActivity");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.activity
      .slice(0, 25)
      .map(item => `
        <div style="
          background:white;
          padding:13px;
          margin-bottom:9px;
          border-radius:11px;
        ">
          <strong>
            ${escapeHTML(
              item.icon || "•"
            )}
            ${escapeHTML(
              item.title
            )}
          </strong>

          <div>
            ${escapeHTML(
              item.description
            )}
          </div>

          <small>
            ${escapeHTML(
              item.time
            )}
          </small>
        </div>
      `)
      .join("");
}

/* =========================================================
   REPORTS
   ========================================================= */

function renderReports() {
  const completed =
    state.jobs.filter(
      job =>
        job.status === "Completed"
    );

  const revenue =
    completed.reduce(
      (total, job) =>
        total +
        Number(job.price || 0),
      0
    );

  setText(
    "reportRevenue",
    money(revenue)
  );

  setText(
    "completedJobs",
    completed.length
  );

  const container =
    $("reportsContent");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div style="
      display:grid;
      grid-template-columns:
        repeat(auto-fit,minmax(150px,1fr));
      gap:12px;
    ">

      <div style="
        background:white;
        padding:18px;
        border-radius:14px;
      ">
        <small>
          COMPLETED JOBS
        </small>

        <div style="
          font-size:30px;
          font-weight:900;
        ">
          ${completed.length}
        </div>
      </div>

      <div style="
        background:white;
        padding:18px;
        border-radius:14px;
      ">
        <small>
          REVENUE
        </small>

        <div style="
          font-size:30px;
          font-weight:900;
        ">
          ${money(revenue)}
        </div>
      </div>

    </div>
  `;
}

/* =========================================================
   SETTINGS / ACCOUNTS
   ========================================================= */

function renderSettings() {
  const container =
    $("settingsContent");

  if (!container) {
    return;
  }

  if (!isAdmin()) {
    container.innerHTML = `
      <div style="
        background:white;
        padding:18px;
        border-radius:14px;
      ">
        Admin access required.
      </div>
    `;

    return;
  }

  container.innerHTML = `
    <div style="
      background:white;
      padding:18px;
      border-radius:14px;
      margin-bottom:12px;
    ">
      <strong>
        Company
      </strong>

      <p>
        ${escapeHTML(
          state.companyName
        )}
      </p>

      <button
        onclick="changeCompanyName()"
      >
        Change Company Name
      </button>
    </div>

    <div style="
      background:white;
      padding:18px;
      border-radius:14px;
      margin-bottom:12px;
    ">
      <strong>
        User Accounts
      </strong>

      <p>
        ${state.users.length}
        account(s)
      </p>

      <button
        onclick="createAccount()"
      >
        Create Account
      </button>
    </div>

    <div style="
      background:white;
      padding:18px;
      border-radius:14px;
    ">
      <strong>
        Test Data
      </strong>

      <p>
        Reset this browser back to the default MyDetail demo.
      </p>

      <button
        onclick="resetMyDetail()"
      >
        Reset Demo Data
      </button>
    </div>
  `;
}

function changeCompanyName() {
  if (!isAdmin()) {
    return;
  }

  const name =
    prompt(
      "Company name:",
      state.companyName
    );

  if (!name) {
    return;
  }

  state.companyName =
    name.trim();

  saveState();
  renderEverything();
}

window.changeCompanyName =
  changeCompanyName;

function createAccount() {
  if (!isAdmin()) {
    alert(
      "Admin access required."
    );
    return;
  }

  const name =
    prompt("Name:");

  if (!name) {
    return;
  }

  const email =
    prompt("Email:");

  if (!email) {
    return;
  }

  const password =
    prompt("Password:");

  if (!password) {
    return;
  }

  const roleInput =
    prompt(
      "Role: Admin, Manager, or Employee",
      "Employee"
    );

  if (!roleInput) {
    return;
  }

  const role =
    ["Admin", "Manager", "Employee"]
      .find(
        item =>
          item.toLowerCase() ===
          roleInput
            .trim()
            .toLowerCase()
      );

  if (!role) {
    alert("Invalid role.");
    return;
  }

  const id =
    uid(
      role.toLowerCase()
    );

  state.users.push({
    id,
    name: name.trim(),
    email:
      email
        .trim()
        .toLowerCase(),
    password,
    role,
    active: true
  });

  if (
    role === "Employee" ||
    role === "Manager"
  ) {
    state.employees.push({
      id,
      name: name.trim(),
      role,
      status: "Off Clock",
      hours: 0,
      clockIn: null,
      lunchStart: null,
      location: null
    });
  }

  addActivity(
    "Account created",
    `${name.trim()} — ${role}`,
    "👤"
  );

  saveState();
  renderEverything();

  alert(
    `${role} account created.`
  );
}

window.createAccount =
  createAccount;
/* =========================================================
   RESET DEMO DATA
   ========================================================= */

function resetMyDetail() {
  if (!isAdmin()) {
    alert(
      "Admin access required."
    );
    return;
  }

  const confirmed =
    confirm(
      "Reset all MyDetail demo data on this device?"
    );

  if (!confirmed) {
    return;
  }

  const currentUser =
    state.currentUser;

  state =
    clone(defaultState);

  state.currentUser =
    currentUser;

  saveState();

  addActivity(
    "Demo reset",
    "MyDetail demo data was reset.",
    "↻"
  );

  renderEverything();
}

window.resetMyDetail =
  resetMyDetail;

/* =========================================================
   LOGOUT BUTTON
   ========================================================= */

function renderLogoutButton() {
  if (!state.currentUser) {
    return;
  }

  let button =
    $("mydetailLogout");

  if (!button) {
    button =
      document.createElement(
        "button"
      );

    button.id =
      "mydetailLogout";

    button.textContent =
      "Log Out";

    button.style.cssText = `
      position:fixed;
      right:12px;
      top:12px;
      z-index:5000;
      border:0;
      border-radius:10px;
      padding:10px 14px;
      background:#1677ff;
      color:white;
      font-weight:800;
      cursor:pointer;
    `;

    button.addEventListener(
      "click",
      logout
    );

    document.body.appendChild(
      button
    );
  }
}

/* =========================================================
   SECTION RENDERER
   ========================================================= */

function renderSection(
  sectionName
) {
  const section =
    normalizeSection(
      sectionName
    );

  if (
    section === "dashboard" ||
    section === "home"
  ) {
    renderDashboard();
    return;
  }

  if (
    section === "employees" ||
    section === "team"
  ) {
    renderEmployees();
    return;
  }

  if (
    section === "customers"
  ) {
    renderCustomers();
    return;
  }

  if (
    section === "jobs" ||
    section === "appointments"
  ) {
    renderJobs();
    return;
  }

  if (
    section === "schedule" ||
    section === "calendar"
  ) {
    renderSchedule();
    return;
  }

  if (
    section === "punches" ||
    section === "timeclock" ||
    section === "timecard"
  ) {
    renderPunches();
    return;
  }

  if (
    section === "pto"
  ) {
    renderPTO();
    return;
  }

  if (
    section === "activity"
  ) {
    renderActivity();
    return;
  }

  if (
    section === "reports"
  ) {
    renderReports();
    return;
  }

  if (
    section === "settings"
  ) {
    renderSettings();
  }
}

/* =========================================================
   GLOBAL RENDER
   ========================================================= */

function renderEverything() {
  if (!state.currentUser) {
    return;
  }

  setText(
    "companyName",
    state.companyName
  );

  setText(
    "currentUserName",
    state.currentUser.name
  );

  setText(
    "currentUserRole",
    state.currentUser.role
  );

  renderDashboard();
  renderEmployees();
  renderCustomers();
  renderJobs();
  renderSchedule();
  renderPunches();
  renderPTO();
  renderActivity();
  renderReports();
  renderSettings();
  renderLogoutButton();
}

/* =========================================================
   APP STARTUP
   ========================================================= */

function startMyDetail() {
  setupHamburger();
  setupNavigation();

  if (state.currentUser) {
    renderEverything();
    showSection("dashboard");
  } else {
    createLoginScreen();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  startMyDetail
);

/* =========================================================
   AUTO SAVE
   ========================================================= */

window.addEventListener(
  "beforeunload",
  saveState
);

/* =========================================================
   SERVICE WORKER
   ========================================================= */

if (
  "serviceWorker" in navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .catch(error => {
          console.warn(
            "Service worker registration failed:",
            error
          );
        });
       
    }
  );
}
