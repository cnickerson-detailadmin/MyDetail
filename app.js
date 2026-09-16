/* =========================================================
   MYSERVICE — FRONTEND APPLICATION
   PART 1 OF 2
   ========================================================= */

"use strict";

const STORAGE_KEY = "myservice_restaurant_v4";

const defaultState = {
  companyName: "5 Star Restaurant",

  currentUser: {
    id: "admin-1",
    name: "Admin",
    email: "admin@myservice.test",
    role: "Admin"
  },

  settings: {
    tipMode: "pool",
    salesMode: "manual",
    defaultCardFeeRate: 0.03,
    estimatedTaxRate: 0.15
  },

  users: [
    {
      id: "admin-1",
      name: "Admin",
      email: "admin@myservice.test",
      role: "Admin",
      active: true
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      email: "manager@myservice.test",
      role: "Manager",
      active: true
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      email: "employee@myservice.test",
      role: "Employee",
      active: true
    }
  ],

  employees: [
    {
      id: "admin-1",
      name: "Admin",
      role: "Admin",
      status: "Off Clock",
      clockIn: null,
      breakStart: null,
      totalHours: 0,
      tipEligible: false
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      role: "Manager",
      status: "Off Clock",
      clockIn: null,
      breakStart: null,
      totalHours: 0,
      tipEligible: true
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      role: "Employee",
      status: "Off Clock",
      clockIn: null,
      breakStart: null,
      totalHours: 0,
      tipEligible: true
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Example Customer",
      phone: "(555) 555-0101",
      email: "customer@example.com",
      notes: "Regular customer"
    }
  ],

  jobs: [
    {
      id: "job-1",
      customer: "Example Customer",
      orderType: "Dine-In",
      order: "Burger, Fries, Soft Drink",
      employee: "Employee Demo",
      employeeId: "employee-1",
      time: "12:00 PM",
      status: "Open",
      price: 19.99,
      paymentMethod: "Card"
    },
    {
      id: "job-2",
      customer: "Example Customer 2",
      orderType: "Takeout",
      order: "Chicken Sandwich, Fries",
      employee: "Manager Demo",
      employeeId: "manager-1",
      time: "1:30 PM",
      status: "Open",
      price: 16.49,
      paymentMethod: "Cash"
    }
  ],

  schedule: [],

  punches: [],

  cashDrops: [],

  tips: [],

  tipPayouts: [],

  feedbackQueue: [],

  checklist: [
    {
      id: "check-1",
      title: "Opening equipment check",
      completed: false
    },
    {
      id: "check-2",
      title: "Verify refrigerator temperatures",
      completed: false
    },
    {
      id: "check-3",
      title: "Sanitize food preparation surfaces",
      completed: false
    },
    {
      id: "check-4",
      title: "Restock service stations",
      completed: false
    },
    {
      id: "check-5",
      title: "Dining room cleanliness check",
      completed: false
    },
    {
      id: "check-6",
      title: "Closing cash reconciliation",
      completed: false
    },
    {
      id: "check-7",
      title: "Closing cleaning checklist",
      completed: false
    }
  ],

  activity: [
    {
      id: "welcome",
      title: "MyService workspace loaded",
      description: "5 Star Restaurant dashboard is ready.",
      time: new Date().toISOString(),
      icon: "✓"
    }
  ],

  notifications: []
};


/* =========================================================
   STORAGE
   ========================================================= */

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

      settings: {
        ...clone(defaultState.settings),
        ...(parsed.settings || {})
      },

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

      schedule: Array.isArray(parsed.schedule)
        ? parsed.schedule
        : [],

      punches: Array.isArray(parsed.punches)
        ? parsed.punches
        : [],

      cashDrops: Array.isArray(parsed.cashDrops)
        ? parsed.cashDrops
        : [],

      tips: Array.isArray(parsed.tips)
        ? parsed.tips
        : [],

      tipPayouts: Array.isArray(parsed.tipPayouts)
        ? parsed.tipPayouts
        : [],

      feedbackQueue: Array.isArray(parsed.feedbackQueue)
        ? parsed.feedbackQueue
        : [],

      checklist: Array.isArray(parsed.checklist)
        ? parsed.checklist
        : clone(defaultState.checklist),

      activity: Array.isArray(parsed.activity)
        ? parsed.activity
        : clone(defaultState.activity)
    };
  } catch (error) {
    console.error("Storage error:", error);
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
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateKey(value = new Date()) {
  const d = new Date(value);

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(value) {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function hoursBetween(start, end) {
  if (!start || !end) return 0;

  return Math.max(
    0,
    (new Date(end).getTime() -
      new Date(start).getTime()) /
      3600000
  );
}

function minutesBetween(start, end) {
  if (!start || !end) return 0;

  return Math.max(
        0,
    Math.round(
      (new Date(end).getTime() -
        new Date(start).getTime()) /
        60000
    )
  );
}

function formatDuration(hours) {
  const value = Math.max(0, Number(hours || 0));
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);

  return `${h}h ${m}m`;
}

function getCurrentUser() {
  return state.currentUser || state.users[0];
}

function getEmployee(id) {
  return state.employees.find(employee => employee.id === id);
}

function getCurrentEmployee() {
  const user = getCurrentUser();

  let employee = getEmployee(user.id);

  if (!employee) {
    employee = {
      id: user.id,
      name: user.name,
      role: user.role,
      status: "Off Clock",
      clockIn: null,
      breakStart: null,
      totalHours: 0,
      tipEligible: false
    };

    state.employees.push(employee);
    saveState();
  }

  return employee;
}


/* =========================================================
   ACTIVITY
   ========================================================= */

function addActivity(title, description = "", icon = "•") {
  state.activity.unshift({
    id: uid("activity"),
    title,
    description,
    time: new Date().toISOString(),
    icon
  });

  state.activity = state.activity.slice(0, 100);

  saveState();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {
  const target = $(sectionId);

  if (!target) {
    console.warn("Missing section:", sectionId);
    return;
  }

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");  });

  target.classList.add("active");

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.remove("active");

    const action = button.getAttribute("onclick") || "";

    if (
      action.includes(`showSection('${sectionId}')`) ||
      action.includes(`showSection("${sectionId}")`)
    ) {
      button.classList.add("active");
    }
  });

  const sidebar = $("sidebar");

  if (sidebar && window.innerWidth <= 900) {
    sidebar.classList.remove("open");
  }

  window.scrollTo(0, 0);

  renderAll();
}

function toggleSidebar() {
  const sidebar = $("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}


/* =========================================================
   DATE / TIME
   ========================================================= */

function updateDateTime() {
  const now = new Date();

  if ($("currentDate")) {
    $("currentDate").textContent = now.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "short",
        day: "numeric"
      }
    );
  }

  if ($("currentTime")) {
    $("currentTime").textContent = now.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit"
      }
    );
  }

  if ($("liveClock")) {
    $("liveClock").textContent = now.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );
  }

  updateClockMessage();
}


/* =========================================================
   TIME CLOCK
   ========================================================= */

function getOpenPunch(employeeId) {
  return state.punches.find(
    punch =>
      punch.employeeId === employeeId &&
      !punch.clockOut
  );
}

function getBreakMinutes(punch, includeOpen = true) {
  if (!punch || !Array.isArray(punch.breaks)) {
    return 0;
  }

  return punch.breaks.reduce((total, item) => {
    if (!item.start) return total;

    if (item.end) {
      return total + minutesBetween(item.start, item.end);
    }

    if (includeOpen) {
      return (
        total +
        minutesBetween(
          item.start,
          new Date().toISOString()
        )
      );
    }

    return total;
  }, 0);
}

function calculatePunchHours(punch, includeOpen = true) {
  if (!punch || !punch.clockIn) return 0;

  const end =
    punch.clockOut ||
    (includeOpen ? new Date().toISOString() : null);

  if (!end) return 0;

  const gross = hoursBetween(punch.clockIn, end);
  const breakHours =
    getBreakMinutes(punch, includeOpen) / 60;

  return Math.max(0, gross - breakHours);
}

function clockIn() {
  const employee = getCurrentEmployee();

  if (getOpenPunch(employee.id)) return;

  const now = new Date().toISOString();

  state.punches.unshift({
    id: uid("punch"),
    employeeId: employee.id,
    employee: employee.name,
    date: dateKey(now),
    clockIn: now,
    clockOut: null,
    breaks: [],
    totalHours: null,
    correctionRequested: false
  });

  employee.status = "Working";
  employee.clockIn = now;
  employee.breakStart = null;

  addActivity(
    `${employee.name} clocked in`,
    formatTime(now),
    "◷"
  );

  saveState();
  renderAll();
}

function startBreak() {
  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) {
    alert("Clock in before starting a break.");
    return;
  }

  const existing = (punch.breaks || []).find(
    item => item.start && !item.end
  );

  if (existing) return;

  const now = new Date().toISOString();

  if (!Array.isArray(punch.breaks)) {
    punch.breaks = [];
  }

  punch.breaks.push({
    id: uid("break"),
    start: now,
    end: null
  });

  employee.status = "On Break";
  employee.breakStart = now;

  addActivity(
    `${employee.name} started break`,
    formatTime(now),
    "☕"
  );

  saveState();
  renderAll();
}

function endBreak() {
  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) return;

  const openBreak = (punch.breaks || []).find(
    item => item.start && !item.end
  );

  if (!openBreak) return;

  const now = new Date().toISOString();

  openBreak.end = now;

  employee.status = "Working";
  employee.breakStart = null;

  addActivity(
    `${employee.name} ended break`,
    formatTime(now),
    "✓"
  );

  saveState();
  renderAll();
}

function clockOut() {
  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) return;

  const now = new Date().toISOString();

  const openBreak = (punch.breaks || []).find(
    item => item.start && !item.end
  );

  if (openBreak) {
    openBreak.end = now;
  }

  punch.clockOut = now;
  punch.totalHours = calculatePunchHours(punch, false);

  employee.status = "Off Clock";
  employee.clockIn = null;
  employee.breakStart = null;
  employee.totalHours =
    Number(employee.totalHours || 0) +
    Number(punch.totalHours || 0);

  addActivity(
    `${employee.name} clocked out`,
    `${formatTime(now)} • ${formatDuration(
      punch.totalHours
    )}`,
    "✓"
  );

  saveState();
  renderAll();
}

function toggleClock() {
  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) {
    clockIn();
    return;
  }

  clockOut();
}

function ensureBreakButton() {
  const clockButton = $("clockButton");

  if (!clockButton) return;

  let breakButton = $("breakButton");

  if (!breakButton) {
    breakButton = document.createElement("button");
    breakButton.id = "breakButton";
    breakButton.type = "button";
    breakButton.className = "outline-button";
    breakButton.style.marginTop = "12px";
    breakButton.style.width = "100%";
    breakButton.textContent = "START BREAK";

    clockButton.insertAdjacentElement(
      "afterend",
      breakButton
    );
  }

  breakButton.onclick = function () {
    const employee = getCurrentEmployee();
    const punch = getOpenPunch(employee.id);

    if (!punch) return;

    const openBreak = (punch.breaks || []).find(
      item => item.start && !item.end
    );

    if (openBreak) {
      endBreak();
    } else {
      startBreak();
    }
  };
}

function updateClockMessage() {
  const message = $("clockMessage");

  if (!message) return;

  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) {
    message.textContent =
      "Your exact punch time will be recorded.";
    return;
  }

  const openBreak = (punch.breaks || []).find(
    item => item.start && !item.end
  );

  const worked = calculatePunchHours(punch);

  if (openBreak) {
    message.textContent =
      `On break • ${formatDuration(worked)} worked`;
  } else {
    message.textContent =
      `Clocked in at ${formatTime(
        punch.clockIn
      )} • ${formatDuration(worked)} worked`;
  }
}

function renderClock() {
  ensureBreakButton();

  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  const status = $("clockStatus");
  const clockButton = $("clockButton");
  const breakButton = $("breakButton");

  if (!status || !clockButton) return;

  if (!punch) {
    status.textContent = "OFF CLOCK";
    clockButton.textContent = "CLOCK IN";

    if (breakButton) {
      breakButton.textContent = "START BREAK";
      breakButton.disabled = true;
      breakButton.style.opacity = "0.5";
    }

    return;
  }

  const openBreak = (punch.breaks || []).find(
    item => item.start && !item.end
  );

  status.textContent = openBreak
    ? "ON BREAK"
    : "CLOCKED IN";

  clockButton.textContent = "CLOCK OUT";

  if (breakButton) {
    breakButton.disabled = false;
    breakButton.style.opacity = "1";
    breakButton.textContent = openBreak
      ? "END BREAK"
      : "START BREAK";
  }
}


/* =========================================================
   PUNCH TABLE / MY PUNCH LOG
   ========================================================= */

function renderPunchTable() {
  const table = $("punchTable");

  if (!table) return;

  const today = dateKey();

  const punches = state.punches.filter(
    punch => punch.date === today
  );

  if (!punches.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5">No punches recorded today.</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = punches.map(punch => {
    const openBreak = (punch.breaks || []).some(
      item => item.start && !item.end
    );

    const status = punch.clockOut
      ? "Completed"
      : openBreak
        ? "On Break"
        : "Working";

    return `
      <tr>
        <td>${escapeHTML(punch.employee)}</td>
        <td>${escapeHTML(status)}</td>
        <td>${formatTime(punch.clockIn)}</td>
        <td>${formatTime(punch.clockOut)}</td>
        <td>${formatDuration(calculatePunchHours(punch))}</td>
      </tr>
    `;
  }).join("");
}

function renderMyPunchLog() {
  const container = $("myPunchLog");
  const weekHours = $("weekHours");
  const todayHours = $("todayHours");

  if (!container) return;

  const employee = getCurrentEmployee();
  const today = dateKey();

  const myPunches = state.punches.filter(
    punch => punch.employeeId === employee.id
  );

  const todayTotal = myPunches
    .filter(punch => punch.date === today)
    .reduce(
      (total, punch) =>
        total + calculatePunchHours(punch),
      0
    );

  const now = new Date();
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  weekStart.setDate(
    weekStart.getDate() + difference
  );
  weekStart.setHours(0, 0, 0, 0);

  const weekTotal = myPunches
    .filter(
      punch =>
        new Date(punch.clockIn).getTime() >=
        weekStart.getTime()
    )
    .reduce(
      (total, punch) =>
        total + calculatePunchHours(punch),
      0
    );

  if (weekHours) {
    weekHours.textContent =
      formatDuration(weekTotal);
  }

  if (todayHours) {
    todayHours.textContent =
      formatDuration(todayTotal);
  }

  if (!myPunches.length) {
    container.innerHTML = `
      <div class="empty-state">
        No punch history yet.
      </div>
    `;
    return;
  }

  container.innerHTML = myPunches.map(punch => {
    const breaks = (punch.breaks || [])
      .map(item => {
        return `
          <div>
            Break:
            ${formatTime(item.start)}
            –
            ${item.end
              ? formatTime(item.end)
              : "Active"}
          </div>
        `;
      })
      .join("");

    return `
      <div class="list-card">
        <div>
          <strong>${formatDate(punch.clockIn)}</strong>
          <div>
            Clock In: ${formatTime(punch.clockIn)}
          </div>
          <div>
            Clock Out: ${formatTime(punch.clockOut)}
          </div>
          ${breaks}
          <div>
            Total:
            ${formatDuration(calculatePunchHours(punch))}
          </div>
        </div>

        <button
          type="button"
          class="outline-button"
          onclick="requestPunchCorrection('${punch.id}')"
        >
          Request Correction
        </button>
      </div>
    `;
  }).join("");
}

function requestPunchCorrection(punchId) {
  const punch = state.punches.find(
    item => item.id === punchId
  );

  if (!punch) return;

  const reason = prompt(
    "What needs to be corrected on this punch?"
  );

  if (!reason || !reason.trim()) return;

  punch.correctionRequested = true;
  punch.correctionReason = reason.trim();
  punch.correctionRequestedAt =
    new Date().toISOString();

  addActivity(
    "Punch correction requested",
    reason.trim(),
    "!"
  );

  saveState();
  renderAll();

  alert("Correction request submitted.");
}


/* =========================================================
   SCHEDULE
   ========================================================= */

function addScheduleItem() {
  const employeeName = prompt(
    "Employee name:",
    getCurrentEmployee().name
  );

  if (!employeeName) return;

  const date = prompt(
    "Shift date (YYYY-MM-DD):",
    dateKey()
  );

  if (!date) return;

  const start = prompt(
    "Start time:",
    "9:00 AM"
  );

  if (!start) return;

  const end = prompt(
    "End time:",
    "5:00 PM"
  );

  if (!end) return;

  const employee =
    state.employees.find(
      item =>
        item.name.toLowerCase() ===
        employeeName.trim().toLowerCase()
    ) || getCurrentEmployee();

  state.schedule.push({
    id: uid("shift"),
    employeeId: employee.id,
    employee: employee.name,
    date,
    start,
    end
  });

  addActivity(
    "Schedule updated",
    `${employee.name} • ${date} • ${start} – ${end}`,
    "▣"
  );

  saveState();
  renderAll();
}

function renderSchedule() {
  const grid = $("scheduleGrid");

  if (!grid) return;

  const user = getCurrentUser();

  let shifts = [...state.schedule];

  if (user.role === "Employee") {
    shifts = shifts.filter(
      shift => shift.employeeId === user.id
    );
  }

  shifts.sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );

  if (!shifts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        No scheduled shifts yet.
      </div>
    `;
    return;
  }

  grid.innerHTML = shifts.map(shift => `
    <div class="list-card">
      <div>
        <strong>${escapeHTML(shift.employee)}</strong>
        <div>${escapeHTML(shift.date)}</div>
        <div>
          ${escapeHTML(shift.start)}
          –
          ${escapeHTML(shift.end)}
        </div>
      </div>
    </div>
  `).join("");
}


/* =========================================================
   ORDERS
   ========================================================= */

let jobFilter = "all";

function addJob() {
  const customer = prompt("Customer name:");

  if (!customer) return;

  const order = prompt(
    "Order / items:"
  );

  if (!order) return;

  const priceInput = prompt(
    "Order total:",
    "0.00"
  );

  const price = Number(priceInput);

  if (!Number.isFinite(price) || price < 0) {
    alert("Enter a valid order total.");
    return;
  }

  const employee = getCurrentEmployee();

  state.jobs.unshift({
    id: uid("job"),
    customer: customer.trim(),
    orderType: "Dine-In",
    order: order.trim(),
    employee: employee.name,
    employeeId: employee.id,
    time: new Date().toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit"
      }
    ),
    status: "Open",
    price,
    paymentMethod: "Card",
    createdAt: new Date().toISOString()
  });

  addActivity(
    "New order created",
    `${customer.trim()} • ${money(price)}`,
    "+"
  );

  saveState();
  renderAll();
}

function toggleJobStatus(jobId) {
  const job = state.jobs.find(
    item => item.id === jobId
  );

  if (!job) return;

  job.status =
    job.status === "Completed"
      ? "Open"
      : "Completed";

  if (job.status === "Completed") {
    job.completedAt = new Date().toISOString();
  } else {
    job.completedAt = null;
  }

  addActivity(
    `Order ${job.status.toLowerCase()}`,
    `${job.customer} • ${money(job.price)}`,
    "✓"
  );

  saveState();
  renderAll();
}

function renderJobs() {
  const list = $("jobList");

  if (!list) return;

  let jobs = [...state.jobs];

  if (jobFilter === "open") {
    jobs = jobs.filter(
      job => job.status !== "Completed"
    );
  }

  if (jobFilter === "completed") {
    jobs = jobs.filter(
      job => job.status === "Completed"
    );
  }

  if (!jobs.length) {
    list.innerHTML = `
      <div class="empty-state">
        No orders found.
      </div>
    `;
    return;
  }

  list.innerHTML = jobs.map(job => `
    <div class="list-card">
      <div>
        <strong>${escapeHTML(job.customer)}</strong>
        <div>${escapeHTML(job.order)}</div>
        <div>
          ${escapeHTML(job.orderType || "Order")}
          • ${money(job.price)}
          • ${escapeHTML(job.paymentMethod || "—")}
        </div>
        <div>
          ${escapeHTML(job.employee || "Unassigned")}
          • ${escapeHTML(job.time || "")}
        </div>
      </div>

      <button
        type="button"
        class="outline-button"
        onclick="toggleJobStatus('${job.id}')"
      >
        ${job.status === "Completed"
          ? "Reopen"
          : "Complete"}
      </button>
    </div>
  `).join("");
}/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {
  const list = $("customerList");

  if (!list) return;

  const search = (
    $("customerSearch")?.value || ""
  ).trim().toLowerCase();

  const customers = state.customers.filter(customer => {
    const text = [
      customer.name,
      customer.phone,
      customer.email,
      customer.notes
    ].join(" ").toLowerCase();

    return text.includes(search);
  });

  if (!customers.length) {
    list.innerHTML = `
      <div class="empty-state">
        No customers found.
      </div>
    `;
    return;
  }

  list.innerHTML = customers.map(customer => `
    <div class="list-card">
      <div>
        <strong>${escapeHTML(customer.name)}</strong>
        <div>${escapeHTML(customer.phone || "—")}</div>
        <div>${escapeHTML(customer.email || "—")}</div>
        <div>${escapeHTML(customer.notes || "")}</div>
      </div>
    </div>
  `).join("");
}


/* =========================================================
   EMPLOYEES
   ========================================================= */

function renderEmployees() {
  const grid = $("employeeGrid");

  if (!grid) return;

  if (!state.employees.length) {
    grid.innerHTML = `
      <div class="empty-state">
        No employees yet.
      </div>
    `;
    return;
  }

  grid.innerHTML = state.employees.map(employee => `
    <div class="list-card">
      <div>
        <strong>${escapeHTML(employee.name)}</strong>
        <div>${escapeHTML(employee.role)}</div>
        <div>${escapeHTML(employee.status || "Off Clock")}</div>
        <div>
          Recorded Hours:
          ${formatDuration(employee.totalHours || 0)}
        </div>
      </div>

      <button
        type="button"
        class="outline-button"
        onclick="viewEmployee('${employee.id}')"
      >
        View
      </button>
    </div>
  `).join("");
}

function createAccount() {
  const name = prompt("Employee name:");

  if (!name || !name.trim()) return;

  const email = prompt("Employee email:");

  if (!email || !email.trim()) return;

  const roleInput = prompt(
    "Role: Admin, Manager, or Employee",
    "Employee"
  );

  if (!roleInput) return;

  const normalizedRole =
    roleInput.trim().toLowerCase();

  let role = "Employee";

  if (normalizedRole === "admin") {
    role = "Admin";
  }

  if (normalizedRole === "manager") {
    role = "Manager";
  }

  const id = uid("employee");

  state.users.push({
    id,
    name: name.trim(),
    email: email.trim(),
    role,
    active: true
  });

  state.employees.push({
    id,
    name: name.trim(),
    role,
    status: "Off Clock",
    clockIn: null,
    breakStart: null,
    totalHours: 0,
    tipEligible: role !== "Admin"
  });

  addActivity(
    "Employee account created",
    `${name.trim()} • ${role}`,
    "+"
  );

  saveState();
  renderAll();
}

function viewEmployee(employeeId) {
  const employee = getEmployee(employeeId);

  if (!employee) return;

  const punches = state.punches.filter(
    punch => punch.employeeId === employeeId
  );

  const hours = punches.reduce(
    (total, punch) =>
      total + calculatePunchHours(punch),
    0
  );

  alert(
    `${employee.name}\n` +
    `Role: ${employee.role}\n` +
    `Status: ${employee.status}\n` +
    `Recorded Hours: ${formatDuration(hours)}`
  );
}


/* =========================================================
   CHECKLIST
   ========================================================= */

function toggleChecklistItem(itemId) {
  const item = state.checklist.find(
    entry => entry.id === itemId
  );

  if (!item) return;

  item.completed = !item.completed;

  addActivity(
    item.completed
      ? "Checklist item completed"
      : "Checklist item reopened",
    item.title,
    item.completed ? "✓" : "•"
  );

  saveState();
  renderAll();
}

function renderChecklist() {
  const container = $("checklistJobs");

  if (!container) return;

  container.innerHTML = state.checklist.map(item => `
    <div class="list-card">
      <label>
        <input
          type="checkbox"
          ${item.completed ? "checked" : ""}
          onchange="toggleChecklistItem('${item.id}')"
        >
        <strong>${escapeHTML(item.title)}</strong>
      </label>
    </div>
  `).join("");
}


/* =========================================================
   CASH DROPS
   ========================================================= */

function newCashDrop() {
  const amountInput = prompt(
    "Cash drop amount:",
    "0.00"
  );

  if (amountInput === null) return;

  const amount = Number(amountInput);

  if (!Number.isFinite(amount) || amount < 0) {
    alert("Enter a valid cash amount.");
    return;
  }

  const employee = getCurrentEmployee();

  state.cashDrops.unshift({
    id: uid("cash"),
    employeeId: employee.id,
    employee: employee.name,
    amount,
    time: new Date().toISOString()
  });

  addActivity(
    "Cash drop recorded",
    `${employee.name} • ${money(amount)}`,
    "$"
  );

  saveState();
  renderAll();
}

function renderCash() {
  const expectedElement = $("cashExpected");
  const depositedElement = $("cashDeposited");
  const differenceElement = $("cashOverUnder");
  const list = $("cashDropList");

  const expected = state.jobs
    .filter(
      job =>
        job.status === "Completed" &&
        String(job.paymentMethod).toLowerCase() === "cash"
    )
    .reduce(
      (total, job) =>
        total + Number(job.price || 0),
      0
    );

  const deposited = state.cashDrops.reduce(
    (total, drop) =>
      total + Number(drop.amount || 0),
    0
  );

  const difference = deposited - expected;

  if (expectedElement) {
    expectedElement.textContent = money(expected);
  }

  if (depositedElement) {
    depositedElement.textContent = money(deposited);
  }

  if (differenceElement) {
    differenceElement.textContent = money(difference);
  }

  if (!list) return;

  if (!state.cashDrops.length) {
    list.innerHTML = `
      <div class="empty-state">
        No cash drops recorded.
      </div>
    `;
    return;
  }

  list.innerHTML = state.cashDrops.map(drop => `
    <div class="list-card">
      <div>
        <strong>${money(drop.amount)}</strong>
        <div>${escapeHTML(drop.employee)}</div>
        <div>
          ${formatDate(drop.time)}
          •
          ${formatTime(drop.time)}
        </div>
      </div>
    </div>
  `).join("");
}
