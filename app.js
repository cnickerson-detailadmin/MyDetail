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
    estimatedTaxRate: 0.15,
    displayLoginHelpPhone: false,
    loginHelpPhone: ""
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

  const shiftRange =
    `${formatTime(punch.clockIn)}-${formatTime(punch.clockOut)}`;
  const lunchRanges = (punch.breaks || [])
    .filter(item => item.start && item.end)
    .map(item => `${formatTime(item.start)}-${formatTime(item.end)}`)
    .join(", ") || "None";

  state.notifications.unshift({
    id: uid("notification"),
    audience: "Admin",
    type: "clock-out",
    employeeId: employee.id,
    employeeName: employee.name,
    title: `${employee.name} clocked out`,
    description:
      `Today's wages: ${money(punch.estimatedGrossPay)} • ` +
      `Hourly rate: ${Number(punch.hourlyRate || TEST_HOURLY_RATE).toFixed(2)} • ` +
      `Hours worked: ${Number(punch.totalHours || 0).toFixed(2)} • ` +
      `${shiftRange} • Lunch: ${lunchRanges}`,
    time: now,
    read: false
  });
  state.notifications = state.notifications.slice(0, 100);

  saveState();
  renderAll();

  setTimeout(() => {
    const shiftRange =
      `${formatTime(punch.clockIn)}-${formatTime(punch.clockOut)}`;

    const lunchRanges = (punch.breaks || [])
      .filter(item => item.start && item.end)
      .map(item => `${formatTime(item.start)}-${formatTime(item.end)}`)
      .join(", ") || "None";

    alert(
      `TODAY'S WAGES\n\n` +
      `${money(punch.estimatedGrossPay)}\n` +
      `Hourly rate: ${Number(punch.hourlyRate || TEST_HOURLY_RATE).toFixed(2)}\n` +
      `Hours worked: ${Number(punch.totalHours || 0).toFixed(2)}\n` +
      `${shiftRange}\n` +
      `Lunch: ${lunchRanges}`
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

  const now = new Date();
  const today = dateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const scheduledShift = state.schedule.find(shift =>
    shift.employeeId === employee.id &&
    shift.date === today &&
    shift.status !== "cancelled" &&
    scheduleTimeToMinutes(shift.start) !== null &&
    scheduleTimeToMinutes(shift.end) !== null &&
    currentMinutes >= scheduleTimeToMinutes(shift.start)
  );

  let confirmationMessage;

  if (scheduledShift) {
    const startMinutes = scheduleTimeToMinutes(scheduledShift.start);
    let endMinutes = scheduleTimeToMinutes(scheduledShift.end);
    let comparableCurrentMinutes = currentMinutes;

    if (endMinutes < startMinutes) {
      endMinutes += 1440;
      if (comparableCurrentMinutes < startMinutes) comparableCurrentMinutes += 1440;
    }

    if (comparableCurrentMinutes < endMinutes) {
      const remainingSeconds = Math.max(0, (endMinutes - comparableCurrentMinutes) * 60 - now.getSeconds());
      confirmationMessage = `You still have ${formatTimer(remainingSeconds)} left of your scheduled shift. Are you sure you'd like to clock out?`;
    }
  }

  if (!confirmationMessage) {
    const workedSeconds = Math.max(0, Math.floor(calculatePunchHours(punch) * 3600));
    confirmationMessage = `You have worked ${formatTimer(workedSeconds)} hrs. Clock out?`;
  }

  if (!window.confirm(confirmationMessage)) return;
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

function installLoginHelpSettings() {
  const section = $("settings");
  if (!section) return;

  const allowed = ["Developer", "Admin"].includes(getCurrentUser().role);
  let panel = $("login-help-settings");

  if (!allowed) {
    if (panel) panel.hidden = true;
    return;
  }

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "login-help-settings";
    panel.className = "panel";
    panel.innerHTML = `
      <h2>Login Help Contact</h2>
      <p>Optionally show a public administrator phone number on the login screen for employees who forgot their company code.</p>

      <label style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
        <input id="display-login-help-phone" type="checkbox">
        Display contact number on login screen
      </label>

      <label for="login-help-phone">Administrator phone number</label>
      <input id="login-help-phone" type="tel" autocomplete="tel"
        placeholder="(716) 555-0123" style="width:100%;padding:12px;margin:6px 0 12px;">

      <button id="save-login-help-phone" type="button" class="primary-button">
        SAVE LOGIN CONTACT
      </button>
    `;
    section.appendChild(panel);

    $("save-login-help-phone").onclick = function () {
      state.settings.displayLoginHelpPhone = $("display-login-help-phone").checked;
      state.settings.loginHelpPhone = $("login-help-phone").value.trim();
      saveState();
      alert("Login help contact saved.");
    };
  }

  panel.hidden = false;
  $("display-login-help-phone").checked = state.settings.displayLoginHelpPhone === true;
  $("login-help-phone").value = state.settings.loginHelpPhone || "";
}

function renderAll() {
  installLunchSettings();
  installLoginHelpSettings();
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
   TEAM MANAGEMENT
   ========================================================= */

function createAccount() {
  const name = prompt("Employee full name:");
  if (!name || !name.trim()) return;

  const email = prompt("Employee email:");
  if (!email || !email.trim()) return;

  const roleInput = prompt("Role: Employee, Manager, or Admin", "Employee");
  if (!roleInput) return;

  const role = ["Admin", "Manager"].includes(roleInput.trim()) ? roleInput.trim() : "Employee";
  const employee = {
    id: "emp_" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    active: true,
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(state.employees)) state.employees = [];
  state.employees.push(employee);
  saveState();
  renderEmployees();
  alert(employee.name + " was added to My Team.");
}

function renderEmployees() {
  const grid = $("employeeGrid");
  if (!grid) return;

  const employees = Array.isArray(state.employees) ? state.employees.filter(e => e && e.active !== false) : [];
  if (!employees.length) {
    grid.innerHTML = '<div class="empty-state">No team members yet. Tap + Create Account to add one.</div>';
    return;
  }

  grid.innerHTML = employees.map(employee => `
    <button type="button" class="card" style="width:100%;text-align:left;margin-bottom:12px;" onclick="openEmployeeProfile('${employee.id}')">
      <strong>${employee.name || "Team Member"}</strong>
      <div>${employee.role || "Employee"}</div>
      <small>${employee.email || ""}</small>
    </button>
  `).join("");
}

function openEmployeeProfile(employeeId) {
  const employee = (state.employees || []).find(e => String(e.id) === String(employeeId));
  if (!employee) return;
  alert(
    employee.name + "\n" +
    (employee.role || "Employee") + "\n" +
    (employee.email || "") + "\n\n" +
    "Employee profile controls are ready for the next step."
  );
}

document.addEventListener("DOMContentLoaded", renderEmployees);


/* =========================================================
   MYSERVICE — TEST LOGIN / LOGOUT
   ========================================================= */

const TEST_ACCOUNTS = {
  "camry9306+developer@gmail.com": { role: "Developer", name: "Developer" },
  "camry9306+admin@gmail.com": { role: "Admin", name: "Test Admin" },
  ...Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [
      "camry9306+employee" + (i + 1) + "@gmail.com",
      { role: "Employee", name: "Test Employee " + (i + 1) }
    ])
  )
};
const LOGIN_KEY = "myservice_test_login";
const TEST_COMPANY_CODE = "296342140657398401";

async function loginTestUser(email, password, companyCode) {
  email = email.trim().toLowerCase();

  const account = TEST_ACCOUNTS[email];

  if (
    !account ||
    String(companyCode || "").trim() !== TEST_COMPANY_CODE
  ) {
    alert("Incorrect email, password, or company code.");
    return false;
  }

  const authResponse = await fetch(
    "https://nvgzbgcuzuzbvbcksfhq.supabase.co/auth/v1/token?grant_type=password",
    {
      method: "POST",
      headers: {
        "apikey": "sb_publishable_ZVRbTwG3_0zWt2FlrMn_3w_y8HlM-r-",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }
  );

  const authData = await authResponse.json();

  if (!authResponse.ok || !authData.access_token) {
    alert("Incorrect email, password, or company code.");
    return false;
  }

  localStorage.setItem("myservice_supabase_access_token", authData.access_token);
  localStorage.setItem("myservice_supabase_user_id", authData.user?.id || "");
  if (authData.refresh_token) {
    localStorage.setItem("myservice_supabase_refresh_token", authData.refresh_token);
  }

  const stayLoggedIn = $("stayLoggedIn")?.checked !== false;

  if (stayLoggedIn) {
    localStorage.setItem(LOGIN_KEY, email);
    sessionStorage.removeItem(LOGIN_KEY);
  } else {
    sessionStorage.setItem(LOGIN_KEY, email);
    localStorage.removeItem(LOGIN_KEY);
  }

  state.currentUser = {
    id: email,
    name: account.name,
    email,
    role: account.role
  };

  saveState();

  return true;
}

async function userHasQuickPin(accessToken, userId) {
  if (!accessToken || !userId) return false;

  const response = await fetch(
    "https://nvgzbgcuzuzbvbcksfhq.supabase.co/rest/v1/user_quick_pins?user_id=eq." +
      encodeURIComponent(userId) +
      "&select=user_id&limit=1",
    {
      headers: {
        "apikey": "sb_publishable_ZVRbTwG3_0zWt2FlrMn_3w_y8HlM-r-",
        "Authorization": "Bearer " + accessToken
      }
    }
  );

  if (!response.ok) return false;
  const rows = await response.json();
  return Array.isArray(rows) && rows.length > 0;
}

function showQuickPinSetupScreen(accessToken) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#f3f7fc;box-sizing:border-box;">
      <div style="width:100%;max-width:420px;background:white;padding:28px;border-radius:24px;box-shadow:0 12px 36px rgba(16,42,76,.08);box-sizing:border-box;">
        <h1 style="margin:0;color:#0d2345;">Create your 4-digit PIN</h1>
        <p style="color:#61728c;line-height:1.45;">Required before you can continue to MyService.</p>

        <input id="newQuickPin" type="password" inputmode="numeric" maxlength="4"
          autocomplete="new-password" placeholder="4-digit PIN"
          style="display:block;width:100%;box-sizing:border-box;padding:15px;margin:18px 0 10px;border:1px solid #d6dfeb;border-radius:14px;font-size:20px;text-align:center;letter-spacing:8px;">

        <input id="confirmQuickPin" type="password" inputmode="numeric" maxlength="4"
          autocomplete="new-password" placeholder="Confirm PIN"
          style="display:block;width:100%;box-sizing:border-box;padding:15px;margin:0 0 16px;border:1px solid #d6dfeb;border-radius:14px;font-size:20px;text-align:center;letter-spacing:8px;">

        <button id="saveQuickPin" type="button" class="primary-button"
          style="width:100%;min-height:54px;border-radius:14px;font-weight:800;">
          CREATE PIN
        </button>
      </div>
    </div>
  `;

  $("saveQuickPin").onclick = async function () {
    const pin = $("newQuickPin").value.trim();
    const confirmPin = $("confirmQuickPin").value.trim();

    if (!/^\\d{4}$/.test(pin)) {
      alert("Your PIN must be exactly 4 digits.");
      return;
    }
    if (pin !== confirmPin) {
      alert("PINs do not match.");
      return;
    }

    const response = await fetch(
      "https://nvgzbgcuzuzbvbcksfhq.supabase.co/rest/v1/rpc/set_my_quick_pin",
      {
        method: "POST",
        headers: {
          "apikey": "sb_publishable_ZVRbTwG3_0zWt2FlrMn_3w_y8HlM-r-",
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ new_pin: pin })
      }
    );

    if (!response.ok) {
      alert("PIN could not be saved. Please try again.");
      return;
    }

    location.reload();
  };
}

function logoutTestUser() {
  localStorage.removeItem(LOGIN_KEY);
  sessionStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem("myservice_supabase_access_token");
  localStorage.removeItem("myservice_supabase_refresh_token");
  localStorage.removeItem("myservice_supabase_user_id");

  location.reload();
}

function getLoggedInTestUser() {
  const email =
    localStorage.getItem(LOGIN_KEY) ||
    sessionStorage.getItem(LOGIN_KEY);

  return email
    ? TEST_ACCOUNTS[email] || null
    : null;
}

function getLoginHelpPhoneMarkup() {
  const enabled = state.settings?.displayLoginHelpPhone === true;
  const phone = String(state.settings?.loginHelpPhone || "").trim();

  if (!enabled || !phone) return "";

  return `
    <div style="margin-top:6px;font-weight:700;">
      Call/Text: ${escapeHTML(phone)}
    </div>
  `;
}

async function sendPasswordResetEmail(email) {
  email = String(email || "").trim().toLowerCase();

  if (!email) {
    alert("Enter your email address first.");
    return;
  }

  const response = await fetch(
    "https://nvgzbgcuzuzbvbcksfhq.supabase.co/auth/v1/recover?redirect_to=" +
      encodeURIComponent("https://cnickerson-detailadmin.github.io/MyDetail/"),
    {
      method: "POST",
      headers: {
        "apikey": "sb_publishable_ZVRbTwG3_0zWt2FlrMn_3w_y8HlM-r-",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    alert(data.msg || data.message || "Unable to send reset email right now.");
    return;
  }

  alert("If that email belongs to a MyService account, a password reset email has been sent.");
}

function getRecoverySessionFromUrl() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  if (params.get("type") !== "recovery") return null;

  const accessToken = params.get("access_token");
  return accessToken ? { accessToken } : null;
}

function showPasswordRecoveryScreen(accessToken) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#f3f7fc;">
      <div style="width:100%;max-width:420px;background:white;padding:28px;border-radius:20px;">
        <h1 style="margin:0 0 6px;">MyService</h1>
        <p style="margin:0 0 24px;">Create a new password</p>

        <input id="newRecoveryPassword" type="password" autocomplete="new-password"
          placeholder="New password" style="width:100%;padding:15px;margin-bottom:12px;">

        <input id="confirmRecoveryPassword" type="password" autocomplete="new-password"
          placeholder="Confirm new password" style="width:100%;padding:15px;margin-bottom:8px;">

        <p style="font-size:13px;opacity:.7;margin:0 0 16px;">
          Use at least 8 characters, including 1 number and 1 special character.
        </p>

        <button id="saveRecoveryPassword" class="primary-button"
          style="width:100%;min-height:52px;">SAVE NEW PASSWORD</button>
      </div>
    </div>
  `;

  $("saveRecoveryPassword").onclick = async function () {
    const password = $("newRecoveryPassword").value;
    const confirmPassword = $("confirmRecoveryPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (
      password.length < 8 ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      alert("Password must be at least 8 characters and include 1 number and 1 special character.");
      return;
    }

    const response = await fetch(
      "https://nvgzbgcuzuzbvbcksfhq.supabase.co/auth/v1/user",
      {
        method: "PUT",
        headers: {
          "apikey": "sb_publishable_ZVRbTwG3_0zWt2FlrMn_3w_y8HlM-r-",
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.msg || data.message || "Password could not be updated.");
      return;
    }

    history.replaceState(null, "", window.location.pathname);
    alert("Password updated. You can now sign in.");
    location.reload();
  };
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
      box-sizing:border-box;
    ">
      <div style="
        width:100%;
        max-width:420px;
        background:white;
        padding:28px;
        border-radius:24px;
        box-shadow:0 12px 36px rgba(16,42,76,.08);
        box-sizing:border-box;
      ">
        <h1 style="margin:0;font-size:42px;line-height:1;font-weight:850;color:#0d2345;">
          My<span style="color:#1677f2;">Service</span>
        </h1>

        <p style="margin:8px 0 24px;color:#71809a;font-size:15px;">
          Manage Today. A Better Tomorrow.
        </p>

        <p style="margin:0 0 18px;color:#536783;font-size:18px;">
          TEST • Sign In
        </p>

        <input
          id="testLoginEmail"
          type="email"
          autocomplete="username"
          aria-label="Email"
          placeholder="example@example.com"
          style="
            display:block;
            width:100%;
            box-sizing:border-box;
            padding:15px;
            margin:0 0 12px;
            border:1px solid #d6dfeb;
            border-radius:14px;
            font-size:16px;
          "
        >

        <div style="display:flex;gap:8px;align-items:center;margin:0 0 6px;width:100%;">
          <input
            id="testLoginPassword"
            type="password"
            autocomplete="current-password"
            placeholder="Password"
            style="
              min-width:0;
              flex:1 1 auto;
              box-sizing:border-box;
              padding:15px;
              margin:0;
              border:1px solid #d6dfeb;
              border-radius:14px;
              font-size:16px;
            "
          >
          <button
            id="toggleTestPassword"
            type="button"
            class="outline-button"
            aria-label="Show password"
            style="flex:0 0 auto;min-height:50px;padding:0 14px;"
          >Show</button>
        </div>

        <button
          id="forgotPasswordButton"
          type="button"
          style="
            display:block;
            border:0;
            background:transparent;
            color:#126fe8;
            padding:4px 0;
            margin:0 0 14px;
            font-size:15px;
            font-weight:700;
            text-align:left;
          "
        >
          Forgot password?
        </button>

        <input
          id="testCompanyCode"
          type="text"
          inputmode="numeric"
          maxlength="18"
          pattern="[0-9]{6,18}"
          aria-label="Company Code"
          placeholder="Company Code"
          style="
            display:block;
            width:100%;
            box-sizing:border-box;
            padding:15px;
            margin:0 0 8px;
            border:1px solid #d6dfeb;
            border-radius:14px;
            font-size:16px;
          "
        >

        <div style="margin:0 0 16px;font-size:14px;line-height:1.45;">
          <div style="font-weight:700;color:#126fe8;">Forgot company code?</div>
          <div style="margin-top:3px;color:#61728c;">Please contact your HR or administrator.</div>
          ${getLoginHelpPhoneMarkup()}
        </div>

        <label style="
          display:flex;
          align-items:center;
          gap:9px;
          width:max-content;
          max-width:100%;
          margin:0 0 18px;
          color:#173153;
          font-size:15px;
          font-weight:650;
        ">
          <input
            id="stayLoggedIn"
            type="checkbox"
            checked
            style="width:20px;height:20px;margin:0;flex:0 0 20px;"
          >
          <span>Stay logged in</span>
        </label>

        <button
          id="testLoginButton"
          class="primary-button"
          style="
            width:100%;
            min-height:54px;
            font-size:16px;
            font-weight:800;
            border-radius:14px;
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

  const passwordInput = $("testLoginPassword");
  const togglePassword = $("toggleTestPassword");

  const forgotPasswordButton = $("forgotPasswordButton");

  if (forgotPasswordButton) {
    forgotPasswordButton.onclick = async function () {
      await sendPasswordResetEmail($("testLoginEmail")?.value);
    };
  }

  if (togglePassword && passwordInput) {
    togglePassword.onclick = function () {
      const visible = passwordInput.type === "text";
      passwordInput.type = visible ? "password" : "text";
      togglePassword.textContent = visible ? "Show" : "Hide";
      togglePassword.setAttribute("aria-label", visible ? "Show password" : "Hide password");
    };
  }

  button.onclick = async function () {
    const email =
      $("testLoginEmail").value;

    const password =
      $("testLoginPassword").value;

    const companyCode =
      $("testCompanyCode").value;

    if (
      await loginTestUser(
        email,
        password,
        companyCode
      )
    ) {
      location.reload();
    }
  };
}

document.addEventListener(
  "DOMContentLoaded",
  async function () {
    const recoverySession = getRecoverySessionFromUrl();

    if (recoverySession) {
      showPasswordRecoveryScreen(recoverySession.accessToken);
      return;
    }

    const loggedIn =
      getLoggedInTestUser();

    if (!loggedIn) {
      showLoginScreen();
      activateLoginScreen();
      return;
    }

    const accessToken = localStorage.getItem("myservice_supabase_access_token");
    const userId = localStorage.getItem("myservice_supabase_user_id");

    if (!(await userHasQuickPin(accessToken, userId))) {
      showQuickPinSetupScreen(accessToken);
      return;
    }

    const email =
      localStorage.getItem(LOGIN_KEY) ||
      sessionStorage.getItem(LOGIN_KEY);

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