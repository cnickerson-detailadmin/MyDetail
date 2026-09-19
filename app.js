/* =========================================================
   MYSERVICE — FRONTEND APPLICATION
   COMPLETE CLEAN BUILD
   ========================================================= */

"use strict";

const STORAGE_KEY = "myservice_restaurant_v4";
const ACTIVE_PAGE_KEY = "myservice_active_page";
const TEST_HOURLY_RATE = 17.50;

/* =========================================================
   DEFAULT DATA
   ========================================================= */

const defaultState = {
  companyName: "5 Star Restaurant",

  currentUser: {
    id: "admin-1",
    name: "Admin",
    email: "admin@myservice.test",
    role: "Admin"
  },

  settings: {
    lunchMinutes: 30,
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
  notifications: [],

  checklist: [
    { id: "check-1", title: "Opening equipment check", completed: false },
    { id: "check-2", title: "Verify refrigerator temperatures", completed: false },
    { id: "check-3", title: "Sanitize food preparation surfaces", completed: false },
    { id: "check-4", title: "Restock service stations", completed: false },
    { id: "check-5", title: "Dining room cleanliness check", completed: false },
    { id: "check-6", title: "Closing cash reconciliation", completed: false },
    { id: "check-7", title: "Closing cleaning checklist", completed: false }
    
      ],

  activity: [    {
      id: "welcome",
      title: "MyService workspace loaded",
      description: "5 Star Restaurant dashboard is ready.",
      time: new Date().toISOString(),
      icon: "✓"
    }
  ]
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

      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
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
    (new Date(end).getTime() - new Date(start).getTime()) / 3600000
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
  const totalMinutes = Math.round(value * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h}h ${m}m`;
}

function formatTimer(totalSeconds) {
  const seconds = Math.max(
    0,
    Math.floor(Number(totalSeconds || 0))
  );

  return [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60
  ]
    .map(value => String(value).padStart(2, "0"))
    .join(":");
}

function getCurrentUser() {
  return state.currentUser || state.users[0];
}

function getEmployee(id) {
  return state.employees.find(
    employee => employee.id === id
  );
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
      tipEligible: user.role !== "Admin"
    };

    state.employees.push(employee);
    saveState();
  }

  return employee;
}

function canManageEmployees() {
  const user = getCurrentUser();

  return (
    user &&
    (
      user.role === "Developer" ||
      user.role === "Admin" ||
      user.role === "Manager"
    )
  );
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

  localStorage.setItem(
    ACTIVE_PAGE_KEY,
    sectionId
  );

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

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
    $("currentDate").textContent =
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
      });
  }

  if ($("currentTime")) {
    $("currentTime").textContent =
      now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
  }

  if ($("liveClock")) {
    $("liveClock").textContent =
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
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
      return total + minutesBetween(
        item.start,
        item.end
      );
    }

    if (includeOpen) {
      return total + minutesBetween(
        item.start,
        new Date().toISOString()
      );
    }

    return total;
  }, 0);
}

function calculatePunchHours(
  punch,
  includeOpen = true
) {
  if (!punch || !punch.clockIn) return 0;

  const end =
    punch.clockOut ||
    (includeOpen
      ? new Date().toISOString()
      : null);

  if (!end) return 0;

  const gross = hoursBetween(
    punch.clockIn,
    end
  );

  const breakHours =
    (punch.breaks || []).reduce(
      (total, item) => {
        if (!item.start) return total;

        const breakEnd =
          item.end ||
          (includeOpen ? end : null);

        return total +
          (
            breakEnd
              ? hoursBetween(item.start, breakEnd)
              : 0
          );
      },
      0
    );

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
    hourlyRate: TEST_HOURLY_RATE,
    estimatedGrossPay: null,
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
    alert("Clock in before starting lunch.");
    return;
  }

  const existing =
    (punch.breaks || []).find(
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
    end: null,
    durationMinutes: getLunchMinutes()
  });

  employee.status = "On Break";
  employee.breakStart = now;

  addActivity(
    `${employee.name} started lunch`,
    `${getLunchMinutes()} minute lunch`,
    "☕"
  );

  saveState();
  renderAll();
}

function endBreak() {
  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) return;

  const openBreak =
    (punch.breaks || []).find(
      item => item.start && !item.end
    );

  if (!openBreak) return;

  const now = new Date().toISOString();

  openBreak.end = now;

  employee.status = "Working";
  employee.breakStart = null;

  addActivity(
    `${employee.name} ended lunch`,
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

  const openBreak =
    (punch.breaks || []).find(
      item => item.start && !item.end
    );

  if (openBreak) {
    openBreak.end = now;
  }

  punch.clockOut = now;
  punch.totalHours =
    calculatePunchHours(punch, false);

  punch.hourlyRate = TEST_HOURLY_RATE;
  punch.estimatedGrossPay =
    Number(punch.totalHours || 0) *
    TEST_HOURLY_RATE;

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

  setTimeout(() => {
    alert(
      `SHIFT COMPLETE\n\n` +
      `Hours worked today: ${formatDuration(
        punch.totalHours
      )}\n` +
      `Hourly rate: ${money(TEST_HOURLY_RATE)}/hr\n` +
      `Estimated gross pay today: ${money(
        punch.estimatedGrossPay
      )}`
    );
  }, 100);
}
function toggleClock() {
  const employee = getCurrentEmployee();
  const punch = getOpenPunch(employee.id);

  if (!punch) {
    clockIn();
    return;
  }

  const workedSeconds = Math.max(0, Math.floor(calculatePunchHours(punch) * 3600));
  const workedTime = formatTimer(workedSeconds);

  if (!window.confirm(`You have worked ${workedTime} hrs. Clock out?`)) {
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

    clockButton.insertAdjacentElement(
      "afterend",
      breakButton
    );
  }

  breakButton.onclick = function () {
    const employee = getCurrentEmployee();
    const punch = getOpenPunch(employee.id);

    if (!punch) return;

    const openBreak =
      (punch.breaks || []).find(
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

  const openBreak =
    (punch.breaks || []).find(
      item => item.start && !item.end
    );

  const worked =
    calculatePunchHours(punch);

  if (openBreak) {
    message.textContent =
      `On lunch • ${formatDuration(worked)} worked`;
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
      breakButton.textContent = "START LUNCH";
      breakButton.disabled = true;
      breakButton.style.opacity = "0.5";
    }

    return;
  }

  const openBreak =
    (punch.breaks || []).find(
      item => item.start && !item.end
    );

  status.textContent =
    openBreak
      ? "ON LUNCH"
      : "CLOCKED IN";

  clockButton.textContent = "CLOCK OUT";

  if (breakButton) {
    breakButton.disabled = false;
    breakButton.style.opacity = "1";
    breakButton.textContent =
      openBreak
        ? "END LUNCH"
        : "START LUNCH";
  }
}


/* =========================================================
   PUNCH LOG
   ========================================================= */

function renderPunchTable() {
  const table = $("punchTable");

  if (!table) return;

  const today = dateKey();
  const user = getCurrentUser();

  let punches =
    state.punches.filter(
      punch => punch.date === today
    );

  if (user && user.role === "Employee") {
    punches =
      punches.filter(
        punch => punch.employeeId === user.id
      );
  }

  if (!punches.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5">
          No punches recorded today.
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML =
    punches.map(punch => {
      const openBreak =
        (punch.breaks || []).some(
          item => item.start && !item.end
        );

      const status =
        punch.clockOut
          ? "Completed"
          : openBreak
            ? "On Lunch"
            : "Working";

      return `
        <tr>
          <td>${escapeHTML(punch.employee)}</td>
          <td>${escapeHTML(status)}</td>
          <td>${formatTime(punch.clockIn)}</td>
          <td>${formatTime(punch.clockOut)}</td>
          <td>${formatDuration(
            calculatePunchHours(punch)
          )}</td>
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

  const myPunches =
    state.punches.filter(
      punch =>
        punch.employeeId === employee.id
    );

  const todayTotal =
    myPunches
      .filter(
        punch =>
          punch.date === today
      )
      .reduce(
        (total, punch) =>
          total +
          calculatePunchHours(punch),
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
    weekHours.textContent = formatDuration(weekTotal);
  }

  if (todayHours) {
    todayHours.textContent = formatDuration(todayTotal);
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
      .map(item => `
        <div>
          Lunch: ${formatTime(item.start)} –
          ${item.end ? formatTime(item.end) : "Active"}
        </div>
      `)
      .join("");

    const pay =
      punch.clockOut &&
      Number.isFinite(Number(punch.estimatedGrossPay))
        ? `
          <div>
            Estimated gross pay:
            ${money(punch.estimatedGrossPay)}
          </div>
        `
        : "";

    return `
      <div class="list-card">
        <div>
          <strong>${formatDate(punch.clockIn)}</strong>
          <div>Clock In: ${formatTime(punch.clockIn)}</div>
          <div>Clock Out: ${formatTime(punch.clockOut)}</div>
          ${breaks}
          <div>
            Total: ${formatDuration(
              calculatePunchHours(punch)
            )}
          </div>
          ${pay}
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
   EMPLOYEE SCHEDULE
   ========================================================= */

function scheduleTimeToMinutes(value) {
  if (!value) return null;

  const match = String(value)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}

function calculateScheduledHours(shift) {
  const start = scheduleTimeToMinutes(shift.start);
  let end = scheduleTimeToMinutes(shift.end);

  if (start === null || end === null) {
    return 0;
  }

  if (end < start) {
    end += 1440;
  }

  const grossMinutes = end - start;

  const breakMinutes = Math.max(
    0,
    Number(shift.breakMinutes || 0)
  );

  return Math.max(
    0,
    (grossMinutes - breakMinutes) / 60
  );
}

function getWeekStartFromDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);

  return dateKey(date);
}

function getEmployeeWeekHours(employeeId, dateValue) {
  const weekStart = getWeekStartFromDate(dateValue);

  if (!weekStart) return 0;

  return state.schedule
    .filter(
      shift =>
        shift.employeeId === employeeId &&
        getWeekStartFromDate(shift.date) === weekStart
    )
    .reduce(      (total, shift) =>
        total + calculateScheduledHours(shift),
      0
    );
}

function addScheduleItem() {
  if (!canManageEmployees()) {
    alert(
      "Only Admin or Manager accounts can create schedules."
    );
    return;
  }

  if (!state.employees.length) {
    alert("Create an employee first.");
    return;
  }

  const employeeChoices = state.employees
    .map(
      (employee, index) =>
        `${index + 1}. ${employee.name} (${employee.role})`
    )
    .join("\n");

  const employeeInput = prompt(
    `Which employee are you scheduling?\n\n${employeeChoices}\n\nEnter employee number or name:`
  );

  if (!employeeInput) return;

  let employee = null;

  const employeeNumber = Number(employeeInput);

  if (
    Number.isInteger(employeeNumber) &&
    employeeNumber >= 1 &&
    employeeNumber <= state.employees.length
  ) {
    employee = state.employees[employeeNumber - 1];
  } else {
    employee = state.employees.find(
      item =>
        item.name.toLowerCase() ===
        employeeInput.trim().toLowerCase()
    );
  }

  if (!employee) {
    alert("Employee not found.");
    return;
  }

  const shiftDate = prompt(
    "Scheduled date (YYYY-MM-DD):",
    dateKey()
  );

  if (!shiftDate) return;

  const startTime = prompt(
    "Scheduled start time:",
    "9:00 AM"
  );

  if (
    !startTime ||
    scheduleTimeToMinutes(startTime) === null
  ) {
    alert("Use a time like 9:00 AM.");
    return;
  }

  const endTime = prompt(
    "Scheduled end time:",
    "5:00 PM"
  );

  if (
    !endTime ||
    scheduleTimeToMinutes(endTime) === null
  ) {
    alert("Use a time like 5:00 PM.");
    return;
  }

  const breakInput = prompt(
    "Scheduled unpaid break in minutes:",
    String(getLunchMinutes())
  );

  if (breakInput === null) return;

  const breakMinutes = Number(breakInput);

  if (
    !Number.isFinite(breakMinutes) ||
    breakMinutes < 0
  ) {
    alert("Enter a valid break length.");
    return;
  }

  const shift = {
    id: uid("shift"),
    employeeId: employee.id,
    employee: employee.name,
    date: shiftDate,
    start: startTime.trim(),
    end: endTime.trim(),
    breakMinutes,
    createdAt: new Date().toISOString()
  };

  shift.totalHours =
    calculateScheduledHours(shift);

  state.schedule.push(shift);

  addActivity(
    "Employee scheduled",
    `${employee.name} • ${shiftDate} • ${startTime} - ${endTime}`,
    "▣"
  );

  saveState();
  renderAll();

  alert(
    `${employee.name} scheduled successfully.\n\n` +
    `Date: ${shiftDate}\n` +
    `Hours: ${startTime} - ${endTime}\n` +
    `Break: ${breakMinutes} minutes\n` +
    `Day total: ${formatDuration(
      shift.totalHours
    )}\n` +
    `Week total: ${formatDuration(
      getEmployeeWeekHours(employee.id, shiftDate)
    )}`
  );
}

function deleteScheduleItem(shiftId) {
  if (!canManageEmployees()) return;

  const shift = state.schedule.find(
    item => item.id === shiftId
  );

  if (!shift) return;

  if (
    !confirm(
      `Delete ${shift.employee}'s shift on ${shift.date}?`
    )
  ) {
    return;
  }

  state.schedule = state.schedule.filter(
    item => item.id !== shiftId
  );

  addActivity(
    "Scheduled shift deleted",
    `${shift.employee} • ${shift.date}`,
    "−"
  );

  saveState();
  renderAll();
}
function renderSchedule() {
  const grid = $("scheduleGrid");

  if (!grid) return;

  const user = getCurrentUser();

  let shifts = [...state.schedule];

  if (user && user.role === "Employee") {
    shifts = shifts.filter(
      shift => shift.employeeId === user.id
    );
  }

  shifts.sort((a, b) => {
    const dateCompare = String(a.date).localeCompare(
      String(b.date)
    );

    if (dateCompare !== 0) return dateCompare;

    return (
      (scheduleTimeToMinutes(a.start) || 0) -
      (scheduleTimeToMinutes(b.start) || 0)
    );
  });

  if (!shifts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <strong>No employee schedules saved yet.</strong>
        <div style="margin-top:8px;">
          ${
            canManageEmployees()
              ? "Tap + Add Employee Schedule to create a shift."
              : "You do not have any scheduled shifts yet."
          }
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = shifts.map(shift => {
    const dailyHours =
      calculateScheduledHours(shift);

    const weeklyHours =
      getEmployeeWeekHours(
        shift.employeeId,
        shift.date
      );

    return `
      <div class="list-card" style="margin-bottom:12px;">
        <div style="width:100%;">
          <div style="
            display:flex;
            justify-content:space-between;
            gap:12px;
            align-items:flex-start;
          ">
            <div>
              <strong style="font-size:17px;">
                ${escapeHTML(shift.employee)}
              </strong>

              <div style="margin-top:5px;">
                ${escapeHTML(shift.date)}
              </div>
            </div>

            ${
              canManageEmployees()
                ? `
                  <button
                    type="button"
                    class="outline-button"
                    onclick="deleteScheduleItem('${shift.id}')"
                  >
                    Delete
                  </button>
                `
                : ""
            }
          </div>

          <div style="margin-top:12px;">
            <strong>Scheduled Hours</strong>
            <div>
              ${escapeHTML(shift.start)}
              –
              ${escapeHTML(shift.end)}
            </div>
          </div>

          <div style="margin-top:10px;">
            <strong>Scheduled Lunch</strong>
            <div>
              ${Number(shift.breakMinutes || 0)} minutes
            </div>
          </div>

          <div style="
            margin-top:12px;
            padding-top:12px;
            border-top:1px solid rgba(128,128,128,.25);
          ">
            <div>
              <strong>Day Total:</strong>
              ${formatDuration(dailyHours)}
            </div>

            <div style="margin-top:5px;">
              <strong>Week Total:</strong>
              ${formatDuration(weeklyHours)}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function installScheduleButton() {
  const scheduleSection = $("schedule");

  if (!scheduleSection) return;

  const addButton =
    scheduleSection.querySelector(".primary-button");

  if (!addButton) return;

  if (!canManageEmployees()) {
    addButton.style.display = "none";
    return;
  }

  addButton.style.display = "";
  addButton.removeAttribute("onclick");

  addButton.onclick = function(event) {
    event.preventDefault();
    addScheduleItem();
  };

  addButton.textContent = "+ Add Employee Schedule";
}


/* =========================================================
   LUNCH SETTINGS + RENDER
   ========================================================= */

function getLunchMinutes() {
  const value = Number(state.settings.lunchMinutes);

  return [30, 40, 45, 60].includes(value)
    ? value
    : 30;
}

function countdownText(seconds) {
  return formatTimer(seconds);
}

function shiftBounds(shift) {
  const startMinutes =
    scheduleTimeToMinutes(shift.start);

  const endMinutes =
    scheduleTimeToMinutes(shift.end);

  if (
    startMinutes === null ||
    endMinutes === null
  ) {
    return {
      start: NaN,
      end: NaN
    };
  }

  const start =
    new Date(`${shift.date}T00:00:00`);

  const end =
    new Date(`${shift.date}T00:00:00`);

  start.setMinutes(startMinutes);
  end.setMinutes(endMinutes);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return {
    start: start.getTime(),
    end: end.getTime()
  };
}

function installLunchSettings() {
  const section = $("settings");

  if (!section) return;

  let panel = $("lunch-settings");

  const allowed =
    ["Admin", "Developer"].includes(
      getCurrentUser().role
    );

  if (!allowed) {
    if (panel) panel.hidden = true;
    return;
  }

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "lunch-settings";
    panel.className = "panel";

    panel.innerHTML = `
      <h2>Company Setup — Lunch Duration</h2>

      <label for="company-lunch-minutes">
        Standard lunch countdown
      </label>

      <select id="company-lunch-minutes">
        ${[30, 40, 45, 60]
          .map(
            minutes =>
              `<option value="${minutes}">
                ${minutes} minutes
              </option>`
          )
          .join("")}
      </select>

      <p>
        30 minutes is the standard default.
        Active lunches keep their original duration.
      </p>

      <p>
        Employees must tap End Lunch themselves.
      </p>
    `;

    section.appendChild(panel);

    $("company-lunch-minutes").onchange =
      function () {
        const minutes = Number(this.value);

        if (
          ![30, 40, 45, 60].includes(minutes)
        ) {
          return;
        }

        state.settings.lunchMinutes = minutes;

        saveState();
        updateHomeClockDisplay();
      };
  }

  panel.hidden = false;

  $("company-lunch-minutes").value =
    String(getLunchMinutes());
}

function renderAll() {
  installLunchSettings();
  renderClock();
  renderPunchTable();
  renderMyPunchLog();
  renderSchedule();
  installScheduleButton();
  updateClockMessage();
  installHomeTimeClock();
  installLogoutButton();
}/* =========================================================
   HOMEPAGE EMPLOYEE TIME CLOCK
   ========================================================= */

function installHomeTimeClock() {
  const dashboard = $("dashboard");

  if (!dashboard) return;

  let box = $("home-time-clock");

  if (box) {
    updateHomeClockDisplay();
    return;
  }

  box = document.createElement("div");
  box.id = "home-time-clock";
  box.className = "card";

  box.style.cssText = `
    margin-bottom:18px;
    padding:20px;
    text-align:center;
  `;

  dashboard.insertBefore(
    box,
    dashboard.firstChild
  );

  box.innerHTML = `
    <div style="
      font-size:13px;
      font-weight:700;
      letter-spacing:1.5px;
    ">
      TIME CLOCK
    </div>

    <div
      id="home-live-date"
      style="
        margin-top:10px;
        font-size:16px;
        font-weight:600;
      "
    ></div>

    <div
      id="home-live-time"
      style="
        font-size:28px;
        font-weight:800;
        margin-top:3px;
      "
    ></div>

    <div
      id="home-time-zone"
      style="
        font-size:13px;
        opacity:.7;
        margin-top:2px;      "
    ></div>

    <div style="
      margin-top:18px;
      padding:14px;
      border-radius:16px;
      background:rgba(128,128,128,.08);
    ">
      <div style="
        font-size:12px;
        font-weight:800;
        opacity:.6;
      ">
        TODAY'S SCHEDULE
      </div>

      <div
        id="home-scheduled-hours"
        style="
          font-size:18px;
          font-weight:750;
          margin-top:5px;
        "
      >
        No schedule found
      </div>
    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      margin-top:18px;
    ">
      <div style="
        padding:14px;
        border-radius:16px;
        background:rgba(128,128,128,.08);
      ">
        <div style="
          font-size:12px;
          font-weight:800;
          opacity:.6;
        ">
          SHIFT ELAPSED
        </div>

        <div
          id="home-work-timer"
          style="
            font-size:30px;
            font-weight:850;
            margin-top:4px;
          "
        >
          00:00:00
        </div>
      </div>

      <div style="
        padding:14px;
        border-radius:16px;
        background:rgba(128,128,128,.08);
      ">
        <div style="
          font-size:12px;
          font-weight:800;
          opacity:.6;
        ">
          SHIFT REMAINING
        </div>

        <div
          id="home-shift-timer"
          style="
            font-size:30px;
            font-weight:850;
            margin-top:4px;
          "
        >
          00:00:00
        </div>
      </div>
    </div>

    <div style="
      margin-top:10px;
      padding:14px;
      border-radius:16px;
      background:rgba(128,128,128,.08);
    ">
      <div style="
        font-size:12px;
        font-weight:800;
        opacity:.6;
      ">
        LUNCH REMAINING
      </div>

      <div
        id="home-lunch-timer"
        style="
          font-size:30px;
          font-weight:850;
          margin-top:4px;
        "
      >
        00:00:00
      </div>
    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      margin-top:18px;
    ">
      <button
        type="button"
        class="primary-button"
        id="home-clock-button"
        style="
          min-height:58px;
          font-size:16px;
          font-weight:800;
        "
      >
        CLOCK IN
      </button>

      <button
        type="button"
        class="outline-button"
        id="home-lunch-button"
        style="
          min-height:58px;
          font-size:16px;
          font-weight:800;
        "
      >
        START LUNCH
      </button>
    </div>

    <div
      id="home-clock-status"
      style="
        margin-top:12px;
        font-size:13px;
        opacity:.7;
      "
    >
      Not clocked in
    </div>
  `;

  $("home-clock-button").onclick = toggleClock;

  $("home-lunch-button").onclick = function () {
    const employee = getCurrentEmployee();
    const punch = getOpenPunch(employee.id);

    if (!punch) return;

    const openLunch =
      (punch.breaks || []).some(
        item => item.start && !item.end
      );

    if (openLunch) {
      endBreak();
    } else {
      startBreak();
    }
  };

  updateHomeClockDisplay();

  if (!window.homeClockDisplayTimer) {
    window.homeClockDisplayTimer =
      setInterval(function () {
        updateHomeClockDisplay();
        updateDateTime();
      }, 1000);
  }
}

function updateHomeClockDisplay() {
  const dateEl = $("home-live-date");
  const timeEl = $("home-live-time");
  const zoneEl = $("home-time-zone");

  if (
    !dateEl ||
    !timeEl ||
    !zoneEl
  ) {
    return;
  }

  const now = new Date();

  dateEl.textContent =
    now.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

  timeEl.textContent =
    now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });

  const parts =
    new Intl.DateTimeFormat([], {
      timeZoneName: "short"
    }).formatToParts(now);

  zoneEl.textContent =
    parts.find(
      part =>
        part.type === "timeZoneName"
    )?.value || "";

  const employee =
    getCurrentEmployee();

  const punch =
    getOpenPunch(employee.id);

  const workTimer =
    $("home-work-timer");

  const shiftTimer =
    $("home-shift-timer");

  const lunchTimer =
    $("home-lunch-timer");

  if (!punch) {
    if (workTimer) {
      workTimer.textContent = "00:00:00";
    }

    if (shiftTimer) {
      shiftTimer.textContent = "00:00:00";
    }

    if (lunchTimer) {
      lunchTimer.textContent = "00:00:00";
    }

    $("home-clock-button").textContent =
      "CLOCK IN";

    $("home-lunch-button").textContent =
      "START LUNCH";

    $("home-lunch-button").disabled = true;

    $("home-clock-status").textContent =
      "Not clocked in";

    const shifts = state.schedule.filter(
      item =>
        item.employeeId === employee.id &&
        item.date === dateKey()
    );

    $("home-scheduled-hours").textContent =
      shifts.length
        ? shifts
            .map(
              item =>
                `${item.start} – ${item.end} • ${item.breakMinutes || 0} minute lunch`
            )
            .join(" | ")
        : "No shift scheduled today";

    return;
  }

  const openLunch =
    (punch.breaks || []).find(
      item => item.start && !item.end
    );

  const workedSeconds =
    Math.floor(
      calculatePunchHours(punch) * 3600
    );

  if (workTimer) {
    workTimer.textContent =
      formatTimer(workedSeconds);
  }

  if (openLunch) {
    const lunchEnd =
      new Date(openLunch.start).getTime() +
      Number(
        openLunch.durationMinutes ||
        getLunchMinutes()
      ) * 60000;

    const lunchSeconds =
      Math.ceil(
        (lunchEnd - now.getTime()) / 1000
      );

    if (lunchTimer) {
      lunchTimer.textContent =
        formatTimer(lunchSeconds);
    }
  } else {
    if (lunchTimer) {
      lunchTimer.textContent =
        "00:00:00";
    }
  }

  const todayShifts =
    state.schedule
      .filter(
        shift =>
          shift.employeeId === employee.id &&
          shift.date === dateKey()
      )
      .map(
        shift => ({
          shift,
          ...shiftBounds(shift)
        })
      )
      .filter(
        item =>
          Number.isFinite(item.start) &&
          Number.isFinite(item.end)
      )
      .sort(
        (a, b) =>
          a.start - b.start
      );

  let relevantShift =
    todayShifts.find(
      item =>
        now.getTime() >= item.start &&
        now.getTime() <= item.end
    );

  if (!relevantShift) {
    relevantShift =
      todayShifts.find(
        item =>
          new Date(
            punch.clockIn
          ).getTime() <= item.end
      );
  }

  if (
    relevantShift &&
    shiftTimer
  ) {
    const remainingSeconds =
      Math.ceil(
        (
          relevantShift.end -
          now.getTime()
        ) / 1000
      );

    shiftTimer.textContent =
      formatTimer(
        remainingSeconds
      );
  } else if (shiftTimer) {
    shiftTimer.textContent =
      "00:00:00";
  }

  $("home-clock-button").textContent =
    "CLOCK OUT";

  $("home-lunch-button").textContent =
    openLunch
      ? "END LUNCH"
      : "START LUNCH";

  $("home-lunch-button").disabled = false;

  $("home-clock-status").textContent =
    openLunch
      ? "On lunch — shift timer paused for meal period"
      : "Clocked in";

  const shifts =
    state.schedule.filter(
      item =>
        item.employeeId === employee.id &&
        item.date === dateKey()
    );

  $("home-scheduled-hours").textContent =
    shifts.length
      ? shifts
          .map(
            item =>
              `${item.start} – ${item.end} • ${item.breakMinutes || 0} minute lunch`
          )
          .join(" | ")
      : "No shift scheduled today";
}


/* =========================================================
   MYSERVICE — TEST LOGIN / LOGOUT
   ========================================================= */

const TEST_ACCOUNTS = {
  "developer@admin.myservice.test": {
    role: "Developer",
    name: "Developer"
  },

  "testadmin1@admin.myservice.test": {
    role: "Admin",
    name: "Test Admin 1"
  },

  "testadmin2@admin.myservice.test": {
    role: "Admin",
    name: "Test Admin 2"
  },

  "testadmin3@admin.myservice.test": {
    role: "Admin",
    name: "Test Admin 3"
  },

  "testemployee1@employee.myservice.test": {
    role: "Employee",
    name: "Test Employee 1"
  },

  "testemployee2@employee.myservice.test": {
    role: "Employee",
    name: "Test Employee 2"
  },

  "testemployee3@employee.myservice.test": {
    role: "Employee",
    name: "Test Employee 3"
  }
};

const LOGIN_KEY = "myservice_test_login";

function loginTestUser(email, password) {
  email = email
    .trim()
    .toLowerCase();

  const account =
    TEST_ACCOUNTS[email];

  if (
    !account ||
    password !== "123"
  ) {
    alert(
      "Incorrect email or password."
    );
    return false;
  }

  localStorage.setItem(
    LOGIN_KEY,
    email
  );

  state.currentUser = {
    id: email,
    name: account.name,
    email,
    role: account.role
  };

  saveState();

  return true;
}

function logoutTestUser() {
  localStorage.removeItem(
    LOGIN_KEY
  );

  location.reload();
}

function getLoggedInTestUser() {
  const email =
    localStorage.getItem(
      LOGIN_KEY
    );

  return email
    ? TEST_ACCOUNTS[email] || null
    : null;
}

function showLoginScreen() {
  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:#f3f7fc;
    ">
      <div style="
        width:100%;
        max-width:420px;
        background:white;
        padding:28px;
        border-radius:20px;
      ">
        <h1 style="margin:0 0 6px;">
          MyService
        </h1>

        <p style="margin:0 0 24px;">
          TEST • Sign in
        </p>

        <input
          id="testLoginEmail"
          type="email"
          autocomplete="username"
          aria-label="Email"
          placeholder="example@example.com"
          style="
            width:100%;
            padding:15px;
            margin-bottom:12px;
          "
        >

        <input
          id="testLoginPassword"
          type="password"
          placeholder="Password"
          style="
            width:100%;
            padding:15px;
            margin-bottom:16px;
          "
        >

        <button
          id="testLoginButton"
          class="primary-button"
          style="
            width:100%;
            min-height:52px;
          "
        >
          LOGIN
        </button>
      </div>
    </div>
  `;
}

function activateLoginScreen() {
  const button =
    $("testLoginButton");

  if (!button) return;

  button.onclick = function () {
    const email =
      $("testLoginEmail").value;

    const password =
      $("testLoginPassword").value;

    if (
      loginTestUser(
        email,
        password
      )
    ) {
      location.reload();
    }
  };
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const loggedIn =
      getLoggedInTestUser();

    if (!loggedIn) {
      showLoginScreen();
      activateLoginScreen();
      return;
    }

    const email =
      localStorage.getItem(
        LOGIN_KEY
      );

    state.currentUser = {
      id: email,
      email,
      name: loggedIn.name,
      role: loggedIn.role
    };

    getCurrentEmployee();
    saveState();
    updateDateTime();

    const savedPage =
      localStorage.getItem(
        ACTIVE_PAGE_KEY
      );

    showSection(
      savedPage &&
      $(savedPage)?.classList.contains("page")
        ? savedPage
        : "dashboard"
    );
  }
);

function installLogoutButton() {
  if (!getLoggedInTestUser()) {
    return;
  }

  const sidebar =
    $("sidebar");

  if (
    !sidebar ||
    $("testLogoutButton")
  ) {
    return;
  }

  const button =
    document.createElement(
      "button"
    );

  button.id =
    "testLogoutButton";

  button.type =
    "button";

  button.textContent =
    "LOGOUT";

  button.className =
    "outline-button";

  button.onclick =
    logoutTestUser;

  sidebar.appendChild(
    button
  );
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    if (
      getLoggedInTestUser()
    ) {
      installLogoutButton();
    }
  }
);