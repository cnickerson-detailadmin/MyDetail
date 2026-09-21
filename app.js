/* =========================================================
   MYSERVICE — FRONTEND APPLICATION
   COMPLETE CLEAN BUILD
   ========================================================= */

"use strict";

const STORAGE_KEY_BASE = "myservice_restaurant_v4";
let STORAGE_KEY = STORAGE_KEY_BASE;
const ACTIVE_PAGE_KEY = "myservice_active_page";

function activateCompanyStorage(companyId) {
  const safeCompanyId = String(companyId || "unknown").replace(/[^0-9A-Za-z_-]/g, "");
  const scopedKey = STORAGE_KEY_BASE + ":company:" + safeCompanyId;

  if (!localStorage.getItem(scopedKey)) {
    const legacyState = localStorage.getItem(STORAGE_KEY_BASE);
    if (legacyState) localStorage.setItem(scopedKey, legacyState);
  }

  STORAGE_KEY = scopedKey;
  state = loadState();
}
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
  supportTickets: [],

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

      supportTickets: Array.isArray(parsed.supportTickets)
        ? parsed.supportTickets
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
   SUPPORT TICKETS
   ========================================================= */

function estimateSupportDifficulty(subject, description, priority = "standard") {
  const text = (String(subject || "") + " " + String(description || "")).toLowerCase();

  const complex = [
    "security", "breach", "database", "data missing", "data loss",
    "everyone", "all employees", "entire business", "outage", "server",
    "payment", "corrupt", "cannot login", "can't login"
  ];

  const sensitive = [
    "password", "pin", "ssn", "social security", "bank account",
    "routing number", "credit card", "card number", "cvv", "token",
    "access token", "refresh token", "secret", "api key", "private key",
    "medical", "health information", "payroll", "tax id", "ein",
    "security breach", "account takeover"
  ];

  const easy = [
    "clock in", "clock-in", "clock out", "clock-out", "forgot password",
    "password reset", "button", "display", "wrong time", "schedule",
    "permission", "profile"
  ];

  const mayBeTooSensitiveForChatGPT = sensitive.some(term => text.includes(term));

  let difficulty = "Moderate";
  let min = 15;
  let max = 45;

  if (complex.some(term => text.includes(term))) {
    difficulty = "Complex";
    min = 30;
    max = 120;
  } else if (easy.some(term => text.includes(term))) {
    difficulty = "Easy";
    min = 5;
    max = 15;
  }

  if (priority === "emergency" && difficulty === "Easy") {
    min = 5;
    max = 20;
  }

  let chatgptDifficulty = difficulty;
  let chatgptMin = min;
  let chatgptMax = max;

  if (difficulty === "Complex") {
    chatgptDifficulty = "Moderate";
    chatgptMin = Math.max(15, Math.round(min * 0.6));
    chatgptMax = Math.max(30, Math.round(max * 0.6));
  } else if (difficulty === "Moderate") {
    chatgptDifficulty = "Easy";
    chatgptMin = Math.max(5, Math.round(min * 0.5));
    chatgptMax = Math.max(15, Math.round(max * 0.6));
  } else {
    chatgptDifficulty = "Easy";
    chatgptMin = Math.max(5, Math.round(min * 0.7));
    chatgptMax = Math.max(10, Math.round(max * 0.8));
  }

  return {
    difficulty,
    estimatedMinutes: max,
    estimateLabel: min + "–" + max + " min",
    chatgptDifficulty,
    chatgptEstimateLabel: chatgptMin + "–" + chatgptMax + " min",
    mayBeTooSensitiveForChatGPT
  };
}

function submitSupportTicket(event) {
  event.preventDefault();

  const subject = $("supportSubject")?.value.trim() || "";
  const description = $("supportDescription")?.value.trim() || "";
  const priority = $("supportPriority")?.value || "standard";

  if (!subject || !description) return;

  const estimate = estimateSupportDifficulty(subject, description, priority);
  const ticket = {
    id: "MS-" + String(Date.now()).slice(-6),
    company: state.companyName || "MyService Business",
    user: getCurrentUser()?.name || "User",
    subject,
    description,
    priority,
    difficulty: estimate.difficulty,
    estimatedMinutes: estimate.estimatedMinutes,
    estimateLabel: estimate.estimateLabel,
    chatgptDifficulty: estimate.chatgptDifficulty,
    chatgptEstimateLabel: estimate.chatgptEstimateLabel,
    mayBeTooSensitiveForChatGPT: estimate.mayBeTooSensitiveForChatGPT,
    status: "Open",
    createdAt: new Date().toISOString()
  };

  state.supportTickets.unshift(ticket);

  state.notifications.unshift({
    id: uid("notification"),
    title: priority === "emergency" ? "🚨 Emergency Support Ticket" : "Support Ticket",
    description:
      ticket.id + " • " + ticket.subject +
      " • Overall difficulty: " + ticket.difficulty +
      " • With ChatGPT help: " + ticket.chatgptDifficulty +
      " • Likely fix time: " + ticket.estimateLabel +
      " • With ChatGPT: " + ticket.chatgptEstimateLabel +
      (ticket.mayBeTooSensitiveForChatGPT ? " • May be too sensitive for ChatGPT" : ""),
    time: ticket.createdAt
  });

  saveState();
  renderSupportTickets();

  if ($("supportTicketForm")) $("supportTicketForm").reset();

  alert(
    ticket.id + " created\n" +
    "Overall difficulty: " + ticket.difficulty + "\n" +
    "Overall likely fix time: " + ticket.estimateLabel + "\n" +
    "With ChatGPT help: " + ticket.chatgptDifficulty + "\n" +
    "Likely fix time with ChatGPT: " + ticket.chatgptEstimateLabel +
    (ticket.mayBeTooSensitiveForChatGPT ? "\nMay be too sensitive for ChatGPT" : "")
  );
}

function renderSupportTickets() {
  const list = $("supportTicketList");
  if (!list) return;

  if (!state.supportTickets.length) {
    list.innerHTML = '<p style="opacity:.7;">No support tickets yet.</p>';
    return;
  }

  list.innerHTML = state.supportTickets.slice(0, 20).map(ticket => `
    <div class="notification-card" style="margin-bottom:12px;">
      <strong>${escapeHTML(ticket.id)} • ${escapeHTML(ticket.subject)}</strong>
      <p style="margin:8px 0 4px;">
        <b>Overall:</b> ${escapeHTML(ticket.difficulty)} • ${escapeHTML(ticket.estimateLabel)}
      </p>
      <p style="margin:4px 0 4px;">
        <b>With ChatGPT help:</b> ${escapeHTML(ticket.chatgptDifficulty || ticket.difficulty)} • ${escapeHTML(ticket.chatgptEstimateLabel || ticket.estimateLabel)}
      </p>
      ${ticket.mayBeTooSensitiveForChatGPT ? `
        <div style="margin:8px 0;padding:10px 12px;border-radius:12px;background:rgba(220,38,38,.08);font-weight:750;">
          ⚠ May be too sensitive for ChatGPT
        </div>
      ` : ""}
      <small style="display:block;margin-bottom:6px;opacity:.7;">
        Estimates only. Actual repair time can vary.
      </small>
      <small>
        ${ticket.priority === "emergency" ? "EMERGENCY • " : ""}
        ${escapeHTML(ticket.status)} • ${escapeHTML(formatTime(ticket.createdAt))}
      </small>
    </div>
  `).join("");
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
  renderSupportTickets();
  renderClock();
  renderPunchTable();
  renderMyPunchLog();
  renderSchedule();
  installScheduleButton();
  updateClockMessage();
  installHomeTimeClock();
  installDeveloperExperience();
  installStateLaborLawStrip();
  installLogoutButton();
  installTrainingCenter();
}/* =========================================================
   STATE-SCOPED LABOR LAW STRIP
   ========================================================= */

const STATE_LABOR_AUTHORITIES = {
  AL:["Alabama","https://labor.alabama.gov/"],
  AK:["Alaska","https://labor.alaska.gov/lss/whhome.htm"],
  AZ:["Arizona","https://www.azica.gov/labor-minimum-wage-main-page"],
  AR:["Arkansas","https://labor.arkansas.gov/divisions/labor-standards/"],
  CA:["California","https://www.dir.ca.gov/dlse/"],
  CO:["Colorado","https://cdle.colorado.gov/dlss"],
  CT:["Connecticut","https://portal.ct.gov/dol/divisions/wage-and-workplace-standards"],
  DE:["Delaware","https://labor.delaware.gov/divisions/industrial-affairs/"],
  FL:["Florida","https://www.floridajobs.org/workforce-statistics/workforce-statistics-data-releases/minimum-wage"],
  GA:["Georgia","https://dol.georgia.gov/"],
  HI:["Hawaii","https://labor.hawaii.gov/wsd/"],
  ID:["Idaho","https://www.labor.idaho.gov/businesses/idaho-labor-laws/"],
  IL:["Illinois","https://labor.illinois.gov/laws-rules.html"],
  IN:["Indiana","https://www.in.gov/dol/"],
  IA:["Iowa","https://workforce.iowa.gov/employers/labor-law"],
  KS:["Kansas","https://www.dol.ks.gov/employers/workplace-laws"],
  KY:["Kentucky","https://elc.ky.gov/workplace-standards/Pages/default.aspx"],
  LA:["Louisiana","https://www.laworks.net/"],
  ME:["Maine","https://www.maine.gov/labor/labor_laws/"],
  MD:["Maryland","https://labor.maryland.gov/labor/wages/"],
  MA:["Massachusetts","https://www.mass.gov/orgs/department-of-labor-standards"],
  MI:["Michigan","https://www.michigan.gov/leo/bureaus-agencies/ber/wage-and-hour"],
  MN:["Minnesota","https://www.dli.mn.gov/business/employment-practices"],
  MS:["Mississippi","https://mdes.ms.gov/employers/"],
  MO:["Missouri","https://labor.mo.gov/dls"],
  MT:["Montana","https://erd.dli.mt.gov/labor-standards"],
  NE:["Nebraska","https://dol.nebraska.gov/LaborStandards"],
  NV:["Nevada","https://labor.nv.gov/"],
  NH:["New Hampshire","https://www.dol.nh.gov/"],
  NJ:["New Jersey","https://www.nj.gov/labor/wageandhour/"],
  NM:["New Mexico","https://www.dws.state.nm.us/"],
  NY:["New York","https://dol.ny.gov/"],
  NC:["North Carolina","https://www.labor.nc.gov/workplace-rights"],
  ND:["North Dakota","https://www.nd.gov/labor/"],
  OH:["Ohio","https://com.ohio.gov/divisions-and-programs/industrial-compliance/wage-and-hour"],
  OK:["Oklahoma","https://oklahoma.gov/labor.html"],
  OR:["Oregon","https://www.oregon.gov/boli/workers/pages/default.aspx"],
  PA:["Pennsylvania","https://www.pa.gov/agencies/dli.html"],
  RI:["Rhode Island","https://dlt.ri.gov/regulation-and-safety/labor-standards"],
  SC:["South Carolina","https://llr.sc.gov/wage/"],
  SD:["South Dakota","https://dlr.sd.gov/employment_laws/"],
  TN:["Tennessee","https://www.tn.gov/workforce/employees/labor-laws.html"],
  TX:["Texas","https://www.twc.texas.gov/programs/wage-and-hour"],
  UT:["Utah","https://laborcommission.utah.gov/divisions/utah-antidiscrimination-and-labor-uald/wage-claim/"],
  VT:["Vermont","https://labor.vermont.gov/rights-and-wages"],
  VA:["Virginia","https://doli.virginia.gov/labor-law/"],
  WA:["Washington","https://www.lni.wa.gov/workers-rights/"],
  WV:["West Virginia","https://labor.wv.gov/Wage-Hour/Pages/default.aspx"],
  WI:["Wisconsin","https://dwd.wisconsin.gov/er/laborstandards/"],
  WY:["Wyoming","https://dws.wyo.gov/dws-division/labor-standards/"]
};

const NEW_YORK_LABOR_LAWS = [
  {key:"ny_minimum_wage_2026",text:"In 2026, New York's minimum wage is $17.00 in New York City, Long Island, and Westchester County, and $16.00 in the rest of the state.",url:"https://dol.ny.gov/minimum-wage"},
  {key:"ny_meal_period_over_six_hours",text:"New York generally requires at least a 30-minute unpaid meal period when an employee works a shift longer than six hours.",url:"https://dol.ny.gov/day-rest-and-meal-periods"},
  {key:"ny_day_of_rest",text:"Certain New York employees must receive at least 24 consecutive hours of rest in each calendar week.",url:"https://dol.ny.gov/day-rest-and-meal-periods"},
  {key:"ny_new_hire_pay_notice",text:"New York employers must give each new hire a written notice of pay rate and payday under the Wage Theft Prevention Act.",url:"https://dol.ny.gov/notice-pay-rate"},
  {key:"ny_pay_stub_each_payday",text:"New York employees must receive a wage statement or pay stub with every payment of wages.",url:"https://dol.ny.gov/wage-theft-and-labor-standards-law"},
  {key:"ny_overtime",text:"Most covered, nonexempt New York employees must receive 1½ times their regular rate for hours worked over 40 in a workweek.",url:"https://dol.ny.gov/wages-and-hours-frequently-asked-questions"},
  {key:"ny_short_breaks_paid",text:"When a New York employer permits a short break of up to 20 minutes, that break should be counted as paid working time.",url:"https://dol.ny.gov/wages-and-hours-frequently-asked-questions"},
  {key:"ny_pay_frequency",text:"New York generally requires manual workers to be paid weekly and clerical or other workers at least twice monthly, subject to coverage rules.",url:"https://dol.ny.gov/frequency-pay"},
  {key:"ny_harassment_policy_training",text:"New York employers must maintain a written sexual-harassment prevention policy and provide annual prevention training.",url:"https://dol.ny.gov/posting-requirements-under-nys-labor-law"},
  {key:"ny_breast_milk_paid_breaks",text:"New York employees may take paid 30-minute breaks as reasonably needed to express breast milk for up to three years after childbirth.",url:"https://dol.ny.gov/breast-milk-expression-workplace"},
  {key:"ny_breast_milk_private_space",text:"A New York lactation space must be private and cannot be a restroom or toilet stall.",url:"https://dol.ny.gov/breast-milk-expression-workplace"},
  {key:"ny_sick_leave",text:"New York sick-leave requirements depend on employer size and income; covered employers may owe up to 40 or 56 hours of leave each year.",url:"https://dol.ny.gov/new-york-paid-sick-leave"},
  {key:"ny_illegal_deductions",text:"New York employers generally cannot deduct cash shortages, breakage, uniform maintenance, or other employer business costs from wages.",url:"https://dol.ny.gov/protect-your-paycheck"},
  {key:"ny_minor_schedule_posting",text:"New York employers of minors must post a schedule showing the hours each minor begins and ends work and receives meal periods.",url:"https://dol.ny.gov/posting-requirements-under-nys-labor-law"},
  {key:"ny_equal_pay",text:"New York law prohibits paying an employee less because of protected status when the employee performs equal or substantially similar work under similar conditions.",url:"https://dol.ny.gov/equal-pay-law"}
];

const STATE_COMPLIANCE_TOPICS = [
  ["minimum_wage","Before setting pay rates, check {state}'s current minimum-wage rules, covered workers, and exemptions."],
  ["overtime","Before calculating overtime, check {state}'s current overtime rules in addition to federal requirements."],
  ["meal_rest","Before scheduling breaks, check whether {state} requires meal or rest periods for the workers and shift involved."],
  ["pay_frequency","Before choosing a payday schedule, check {state}'s pay-frequency and wage-statement requirements."],
  ["leave","Before denying time off, check {state}'s current paid and unpaid leave protections."],
  ["final_pay","Before processing a separation, check {state}'s deadlines and rules for an employee's final paycheck."],
  ["posters","Check that every required {state} workplace poster is current and displayed where employees can see it."],
  ["minor_labor","Before scheduling a worker under 18, check {state}'s hour limits, permits, and prohibited-work rules."],
  ["deductions","Before deducting money from wages, check what {state} permits and whether written authorization is required."],
  ["classification","Before treating someone as an independent contractor or exempt employee, check {state}'s classification tests."]
];

let laborLawStripLoading = false;
let laborLawStripLastClaimAt = 0;
let laborLawStripState = null;
let laborLawStripItem = null;

function shouldShowLaborLawStrip() {
  const databaseRole = String(authenticatedContext?.databaseRole || "").toLowerCase();

  if (databaseRole === "developer") {
    return getDeveloperView() !== "Employee";
  }

  return databaseRole === "primary_admin" || databaseRole === "admin";
}

function getLaborLawCatalog(stateCode) {
  if (stateCode === "NY") return NEW_YORK_LABOR_LAWS;

  const authority = STATE_LABOR_AUTHORITIES[stateCode];
  if (!authority) return [];

  const stateName = authority[0];
  const sourceUrl = authority[1];

  return STATE_COMPLIANCE_TOPICS.map(function (topic) {
    return {
      key: stateCode.toLowerCase() + "_" + topic[0],
      text: topic[1].replaceAll("{state}", stateName),
      url: sourceUrl
    };
  });
}

function ensureLaborLawStrip() {
  let strip = $("state-labor-law-strip");
  if (strip) return strip;

  strip = document.createElement("aside");
  strip.id = "state-labor-law-strip";
  strip.setAttribute("aria-live", "polite");
  strip.style.cssText = [
    "width:100%",
    "box-sizing:border-box",
    "min-height:38px",
    "padding:8px 14px",
    "background:#ffd84d",
    "border-top:1px solid #e2b900",
    "border-bottom:1px solid #d8aa00",
    "color:#332900",
    "display:flex",
    "align-items:center",
    "gap:8px",
    "overflow-x:auto",
    "white-space:nowrap",
    "font-size:12px",
    "line-height:1.35",
    "font-weight:700",
    "position:relative",
    "z-index:40"
  ].join(";");

  const topbar = document.querySelector(".topbar");
  if (topbar) topbar.insertAdjacentElement("afterend", strip);
  else document.body.prepend(strip);

  return strip;
}

function renderLaborLawStrip(stateCode, item, message) {
  const strip = ensureLaborLawStrip();
  const stateName = STATE_LABOR_AUTHORITIES[stateCode]?.[0] || stateCode || "State";
  const label = stateCode === "NY" ? "NYS LABOR LAWS" : stateCode + " LABOR LAWS";

  if (message) {
    strip.innerHTML =
      '<strong style="letter-spacing:.08em;">' + escapeHTML(label) + '</strong>' +
      '<span aria-hidden="true">•</span><span>' + escapeHTML(message) + '</span>';
    return;
  }

  strip.innerHTML =
    '<strong style="letter-spacing:.08em;flex:0 0 auto;">' + escapeHTML(label) + '</strong>' +
    '<span aria-hidden="true">•</span>' +
    '<strong style="flex:0 0 auto;">Did you know?</strong>' +
    '<span>' + escapeHTML(item.text) + '</span>' +
    '<a href="' + escapeHTML(item.url) + '" target="_blank" rel="noopener noreferrer" ' +
      'style="color:#332900;text-decoration:underline;font-weight:900;flex:0 0 auto;" ' +
      'aria-label="Open the official ' + escapeHTML(stateName) + ' labor source">OFFICIAL SOURCE ↗</a>' +
    '<span style="font-weight:600;opacity:.72;flex:0 0 auto;">Reminder only—check coverage and exceptions.</span>';
}

async function getMyLaborState(accessToken) {
  const response = await fetch(SUPABASE_URL + "/rest/v1/rpc/my_labor_state", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: "{}"
  });

  if (!response.ok) throw new Error("Could not resolve registered state.");
  return String(await response.json() || "").toUpperCase();
}

async function loadStateLaborLaw(forceNew = false) {
  if (!shouldShowLaborLawStrip()) {
    $("state-labor-law-strip")?.remove();
    return;
  }

  const strip = ensureLaborLawStrip();

  if (!forceNew && laborLawStripItem && laborLawStripState) {
    renderLaborLawStrip(laborLawStripState, laborLawStripItem);
    return;
  }

  const now = Date.now();
  if (laborLawStripLoading || now - laborLawStripLastClaimAt < 5000) return;

  const accessToken = getStoredAuthItem(ACCESS_TOKEN_KEY);
  const userId = authenticatedContext?.id;
  if (!accessToken || !userId) return;

  laborLawStripLoading = true;
  laborLawStripLastClaimAt = now;
  strip.textContent = "Loading your registered state's labor-law reminder…";

  try {
    const stateCode = await getMyLaborState(accessToken);
    const catalog = getLaborLawCatalog(stateCode);

    if (!stateCode || !STATE_LABOR_AUTHORITIES[stateCode]) {
      renderLaborLawStrip(stateCode, null, "A registered business state is required before state labor-law reminders can appear.");
      return;
    }

    const usedResponse = await fetch(
      SUPABASE_URL + "/rest/v1/labor_law_views?select=law_key&user_id=eq." +
        encodeURIComponent(userId) + "&state_code=eq." + encodeURIComponent(stateCode),
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + accessToken
        }
      }
    );

    if (!usedResponse.ok) throw new Error("Could not load labor-law history.");

    const usedRows = await usedResponse.json();
    const usedKeys = new Set((usedRows || []).map(row => row.law_key));
    const unused = catalog.filter(item => !usedKeys.has(item.key));

    if (!unused.length) {
      renderLaborLawStrip(
        stateCode,
        null,
        "Every verified reminder currently available for " +
          STATE_LABOR_AUTHORITIES[stateCode][0] +
          " has been shown. None will be repeated."
      );
      return;
    }

    const randomIndex = globalThis.crypto?.getRandomValues
      ? globalThis.crypto.getRandomValues(new Uint32Array(1))[0] % unused.length
      : Math.floor(Math.random() * unused.length);
    const item = unused[randomIndex];

    const claimResponse = await fetch(
      SUPABASE_URL + "/rest/v1/labor_law_views",
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          user_id: userId,
          state_code: stateCode,
          law_key: item.key,
          law_text: item.text,
          source_url: item.url
        })
      }
    );

    if (!claimResponse.ok) throw new Error("Could not save labor-law history.");

    laborLawStripState = stateCode;
    laborLawStripItem = item;
    renderLaborLawStrip(stateCode, item);
  } catch (error) {
    renderLaborLawStrip(
      laborLawStripState || "NY",
      null,
      "The official state reminder could not load. Refresh to try again; no prior reminder was reused."
    );
  } finally {
    laborLawStripLoading = false;
  }
}

function installStateLaborLawStrip() {
  if (!shouldShowLaborLawStrip()) {
    $("state-labor-law-strip")?.remove();
    return;
  }

  loadStateLaborLaw(false);
}

/* =========================================================
   DEVELOPER COMMAND CENTER
   ========================================================= */

const DEVELOPER_VIEW_KEY = "myservice_developer_view";

function isDeveloperLogin() {
  return getLoggedInTestUser()?.role === "Developer";
}

function getDeveloperView() {
  if (!isDeveloperLogin()) return null;

  const saved = localStorage.getItem(DEVELOPER_VIEW_KEY);
  return ["Developer", "Admin", "Employee"].includes(saved)
    ? saved
    : "Developer";
}

function switchDeveloperView(role) {
  if (!isDeveloperLogin()) return;

  const nextRole = ["Admin", "Employee"].includes(role)
    ? role
    : "Developer";

  localStorage.setItem(DEVELOPER_VIEW_KEY, nextRole);
  localStorage.setItem(ACTIVE_PAGE_KEY, "dashboard");
  location.reload();
}

function returnToDeveloperHome() {
  switchDeveloperView("Developer");
}

function getDeveloperAlerts() {
  const alerts = [
    {
      code: "AUTH-002",
      urgency: "PLAN REQUIRED",
      color: "#a16207",
      title: "Leaked-password screening is not enabled",
      area: "Supabase Auth",
      impact: "Known-compromised-password screening is currently unavailable. Existing password rules still apply, but breached-password checking is not active.",
      fix: "Enable leaked-password protection in Supabase Auth when the project plan supports it."
    }
  ];

  try {
    const adv = typeof getAdvancedState === "function" ? getAdvancedState() : null;
    const api = adv?.integrationSettings?.apiStatus || {};

    if (!api.square?.configured) {
      alerts.push({
        code: "API-101",
        urgency: "SETUP NEEDED",
        color: "#c2410c",
        title: "Square POS connection is not production-configured",
        area: "POS Integration",
        impact: "Businesses cannot complete a real Square connection or automatically import POS sales yet.",
        fix: "Add the Square application ID, application secret and redirect URI to Supabase Edge Function secrets, then complete a sandbox OAuth test."
      });
    }

    if (!api.gusto?.configured) {
      alerts.push({
        code: "API-102",
        urgency: "SETUP NEEDED",
        color: "#c2410c",
        title: "Gusto payroll connection is not production-configured",
        area: "Payroll Integration",
        impact: "Businesses cannot complete a real Gusto authorization or send payroll-ready data yet.",
        fix: "Add the Gusto client ID, client secret and redirect URI to Supabase Edge Function secrets, then complete sandbox authorization and approved-hours testing."
      });
    }

    if (!api.ticketmaster?.configured) {
      alerts.push({
        code: "API-103",
        urgency: "FEATURE LIMITED",
        color: "#ca8a04",
        title: "Nearby-event feed needs a provider API key",
        area: "Scheduling Intelligence",
        impact: "Weather can load, but automatic nearby sports, concerts and public-event data will not appear until the event provider is configured.",
        fix: "Add the Ticketmaster Discovery API key to the Supabase Edge Function secrets."
      });
    }

    if (!Number.isFinite(adv?.integrationSettings?.businessLat) || !Number.isFinite(adv?.integrationSettings?.businessLon)) {
      alerts.push({
        code: "OPS-201",
        urgency: "CONFIGURE",
        color: "#2563eb",
        title: "Business planning location is not set",
        area: "Scheduling Intelligence",
        impact: "Weather and nearby-event demand hints cannot target the business location.",
        fix: "Select the physical business address in Live API Connections. MyService will find the coordinates automatically."
      });
    }
  } catch {}

  return alerts;
}

function scrollToDeveloperCodeAlerts() {
  const el = $("developer-code-alerts");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  showSection("dashboard");
  setTimeout(() => $("developer-code-alerts")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}

function getResolvedDeveloperChecks() {
  return [
    "Company roles and company data are protected by tested RLS policies.",
    "All protected tables now have access policies.",
    "Returning users must verify their PIN; five failed attempts cause a 15-minute lockout."
  ];
}

const DEVELOPER_RECOMMENDATION_SUBJECTS = [
  { category: "Feature", name: "login screen" },
  { category: "Security", name: "PIN setup and unlock flow" },
  { category: "Design", name: "developer dashboard" },
  { category: "Design", name: "employee dashboard" },
  { category: "Design", name: "admin dashboard" },
  { category: "Design", name: "mobile bottom navigation" },
  { category: "Support", name: "support-ticket queue" },
  { category: "Feature", name: "employee time clock" },
  { category: "Feature", name: "lunch countdown" },
  { category: "Feature", name: "schedule builder" },
  { category: "Feature", name: "absence alerts" },
  { category: "Feature", name: "attendance warnings" },
  { category: "Feature", name: "employee profiles" },
  { category: "Feature", name: "business onboarding" },
  { category: "Feature", name: "temperature logs" },
  { category: "Feature", name: "daily checklist" },
  { category: "Feature", name: "checklist photo evidence" },
  { category: "Feature", name: "inventory counts" },
  { category: "Feature", name: "barcode scanning" },
  { category: "Feature", name: "purchase orders" },
  { category: "Feature", name: "vendor records" },
  { category: "Feature", name: "customer records" },
  { category: "Feature", name: "job and order cards" },
  { category: "Feature", name: "cash-drop workflow" },
  { category: "Feature", name: "tips and payouts" },
  { category: "Feature", name: "sales reports" },
  { category: "Feature", name: "profit-and-loss view" },
  { category: "Design", name: "notification center" },
  { category: "Design", name: "company settings" },
  { category: "Feature", name: "developer role switcher" },
  { category: "Security", name: "session-expiration notices" },
  { category: "Fix", name: "error messages" },
  { category: "Feature", name: "offline and PWA experience" },
  { category: "Design", name: "accessibility and readability" },
  { category: "Fix", name: "loading performance" },
  { category: "Security", name: "activity and audit log" }
];

const DEVELOPER_RECOMMENDATION_EDITS = [
  "make its primary action easier to reach on a phone",
  "add clearer success and failure feedback",
  "reduce the number of taps needed for the most common task",
  "add a concise explanation before users make an important change",
  "create a more helpful empty state for first-time users",
  "strengthen the visual hierarchy between urgent and routine information",
  "add a review summary before the final submission",
  "make role permissions clearer inside the interface",
  "surface the most useful next action automatically",
  "add a compact status summary that is readable at a glance",
  "improve recovery when a request fails or the connection drops",
  "make important controls easier to use one-handed"
];

const DEVELOPER_RECOMMENDATION_OUTCOMES = [
  "employees can finish common work faster",
  "administrators can spot problems sooner",
  "mobile users are less likely to tap the wrong control",
  "support tickets contain clearer information",
  "new users immediately understand what to do next",
  "company activity remains easier to review and audit",
  "urgent warnings stand out without overwhelming the screen",
  "busy shifts require less navigation between pages",
  "users receive confirmation that their work was saved",
  "managers can make decisions with less guesswork",
  "the experience feels more polished and trustworthy",
  "future backend integration requires fewer interface changes"
];

let developerRecommendationLoading = false;
let developerRecommendationLastClaimAt = 0;

function buildDeveloperRecommendation(number) {
  const index = Number(number) - 1;
  const subjects = DEVELOPER_RECOMMENDATION_SUBJECTS;
  const edits = DEVELOPER_RECOMMENDATION_EDITS;
  const outcomes = DEVELOPER_RECOMMENDATION_OUTCOMES;
  const total = subjects.length * edits.length * outcomes.length;

  if (!Number.isSafeInteger(index) || index < 0 || index >= total) {
    return null;
  }

  const subject = subjects[index % subjects.length];
  const editIndex = Math.floor(index / subjects.length) % edits.length;
  const outcomeIndex = Math.floor(index / (subjects.length * edits.length)) % outcomes.length;

  return {
    category: subject.category,
    text:
      "Review the " + subject.name + " and " + edits[editIndex] +
      " so " + outcomes[outcomeIndex] + ".",
    number: number,
    total: total
  };
}

async function loadDeveloperRecommendation() {
  const target = $("developer-recommendation-text");
  const category = $("developer-recommendation-category");
  const counter = $("developer-recommendation-counter");

  if (!target || !category || !counter || developerRecommendationLoading) return;
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;

  const now = Date.now();
  if (now - developerRecommendationLastClaimAt < 5000) return;

  const accessToken = getStoredAuthItem(ACCESS_TOKEN_KEY);
  const userId = authenticatedContext?.id;
  if (!accessToken || !userId) return;

  developerRecommendationLoading = true;
  developerRecommendationLastClaimAt = now;
  target.textContent = "Creating a new recommendation that has never been used…";
  category.textContent = "Loading";
  counter.textContent = "";

  try {
    const claimResponse = await fetch(
      SUPABASE_URL + "/rest/v1/developer_recommendations?select=id,opened_at",
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({ user_id: userId })
      }
    );

    if (!claimResponse.ok) throw new Error("Could not claim recommendation.");

    const rows = await claimResponse.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    const recommendation = buildDeveloperRecommendation(Number(row?.id));

    if (!recommendation) {
      category.textContent = "Queue complete";
      target.textContent = "Every prepared recommendation has been used. No previous suggestion will be recycled.";
      counter.textContent = "Add more recommendations before another can appear.";
      return;
    }

    category.textContent = recommendation.category;
    target.textContent = recommendation.text;
    counter.textContent =
      "Recommendation #" + recommendation.number +
      " • New every time the app opens • Never reused";

    await fetch(
      SUPABASE_URL + "/rest/v1/developer_recommendations?id=eq." + encodeURIComponent(row.id),
      {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          category: recommendation.category,
          suggestion_text: recommendation.text
        })
      }
    );
  } catch (error) {
    category.textContent = "Unavailable";
    target.textContent = "A new recommendation could not be loaded. No older recommendation was reused.";
    counter.textContent = "Open the app again to retry.";
  } finally {
    developerRecommendationLoading = false;
  }
}

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    loadDeveloperRecommendation();
    loadStateLaborLaw(true);
  }
});

function developerAlertMarkup(alert) {
  return `
    <article style="padding:16px;border:1px solid #dbe4ef;border-left:6px solid ${alert.color};border-radius:14px;background:#fff;">
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;">
        <strong style="color:#0d2345;">${escapeHTML(alert.code)}</strong>
        <span style="padding:4px 8px;border-radius:999px;background:${alert.color};color:white;font-size:11px;font-weight:850;">
          ${escapeHTML(alert.urgency)}
        </span>
        <span style="font-size:12px;color:#61728c;">${escapeHTML(alert.area)}</span>
      </div>
      <h3 style="margin:0 0 8px;color:#0d2345;">${escapeHTML(alert.title)}</h3>
      <p style="margin:0 0 8px;color:#334a68;line-height:1.45;">
        <strong>What this can cause:</strong> ${escapeHTML(alert.impact)}
      </p>
      <p style="margin:0;color:#61728c;line-height:1.45;">
        <strong>Recommended fix:</strong> ${escapeHTML(alert.fix)}
      </p>
    </article>
  `;
}

function installDeveloperExperience() {
  if (!isDeveloperLogin()) return;

  const dashboard = $("dashboard");
  const sidebar = $("sidebar");
  const view = getDeveloperView();

  if (!dashboard || !sidebar) return;

  const existingNavigation = $("developer-navigation");
  const existingHome = $("developer-command-center");

  if (view !== "Developer") {
    if (existingHome) existingHome.remove();
    if (existingNavigation) existingNavigation.remove();

    if (!$("developer-preview-navigation")) {
      const previewNavigation = document.createElement("div");
      previewNavigation.id = "developer-preview-navigation";
      previewNavigation.className = "nav-section";
      previewNavigation.innerHTML = `
        <div class="nav-title">DEVELOPER PREVIEW</div>
        <div style="padding:0 12px 10px;font-size:13px;font-weight:750;color:#536783;">
          Viewing the ${escapeHTML(view)} experience
        </div>
        <button class="nav" type="button" onclick="returnToDeveloperHome()">
          <span>←</span>
          Return to Developer
        </button>
      `;
      sidebar.insertBefore(previewNavigation, sidebar.firstChild);
    }

    return;
  }

  const previewNavigation = $("developer-preview-navigation");
  if (previewNavigation) previewNavigation.remove();

  if (!existingNavigation) {
    const navigation = document.createElement("div");
    navigation.id = "developer-navigation";
    navigation.className = "nav-section";
    navigation.innerHTML = `
      <div class="nav-title">DEVELOPER</div>
      <button class="nav" type="button" onclick="scrollToDeveloperCodeAlerts()">
        <span>⚠</span>
        Code Alerts
      </button>
      <button class="nav" type="button" onclick="showSection('support')">
        <span>🛟</span>
        Support Tickets
      </button>
      <button id="developer-ai-nav" class="nav" type="button" style="position:relative;z-index:50;pointer-events:auto;touch-action:manipulation;">
        <span>✦</span>
        Developer AI
      </button>
      <button class="nav" type="button" onclick="showSection('settings')">
        <span>⚙</span>
        Admin Entire App Setup
      </button>
      <button class="nav" type="button" onclick="switchDeveloperView('Employee')">
        <span>♙</span>
        Employee Experience
      </button>
    `;
    sidebar.insertBefore(navigation, sidebar.firstChild);
  }

  if (!existingHome) {
    const home = document.createElement("div");
    home.id = "developer-command-center";
    home.className = "panel";
    home.style.cssText = "display:grid;gap:16px;margin-bottom:18px;";
    home.innerHTML = `
      <div>
        <div class="eyebrow">PLATFORM OWNER</div>
        <h1 style="margin:4px 0 6px;">Developer Command Center</h1>
        <p style="margin:0;color:#61728c;">Manage support, configure the full application, and preview each user experience.</p>
      </div>

      <section class="card" style="padding:18px;border:2px solid rgba(22,119,242,.18);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;">
          <div>
            <div class="eyebrow">FIRST PRIORITY</div>
            <h2 style="margin:4px 0;">Support Tickets</h2>
            <p style="margin:0;color:#61728c;">
              ${state.supportTickets.filter(ticket => ticket.status === "Open").length} open ticket(s)
            </p>
          </div>
          <button class="primary-button" type="button" onclick="showSection('support')">VIEW TICKETS</button>
        </div>
      </section>

      <section id="developer-ai-card" class="card" style="padding:14px;border:1px solid rgba(22,119,242,.18);background:#f7f9fc;border-radius:22px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;">
          <div>
            <div class="eyebrow">PRIVATE DEVELOPER COPILOT</div>
            <h2 style="margin:4px 0;">Developer AI</h2>
            <p style="margin:0;color:#61728c;">Business management, operations, support troubleshooting, and MyService guidance.</p>
          </div>
          <button class="outline-button" type="button" onclick="clearDeveloperAIChat()" style="border-radius:16px;">Clear</button>
        </div>

        <div id="developer-ai-messages" style="display:grid;gap:6px;max-height:300px;overflow:auto;padding:2px 0 8px;">
          <div style="padding:9px 13px;border-radius:18px;background:#ffffff;border:1px solid #dbe4f0;color:#34445f;">
            Ask about staffing, scheduling, support tickets, operations, inventory, labor, sales, or MyService troubleshooting.
          </div>
        </div>

        <form onsubmit="sendDeveloperAIMessage(event)" style="display:flex;gap:8px;align-items:center;">
          <textarea id="developer-ai-input" rows="1" maxlength="5000" placeholder="Message Developer AI…" style="width:100%;min-height:42px;max-height:90px;resize:vertical;padding:9px 12px;box-sizing:border-box;border-radius:18px;"></textarea>
          <button id="developer-ai-send" class="primary-button" type="submit" style="min-height:42px;flex:0 0 auto;border-radius:18px;">SEND</button>
        </form>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <button id="developer-ai-call" class="outline-button" type="button" onclick="toggleDeveloperAICall()" style="border-radius:18px;">☎ CALL</button>
          <button id="developer-ai-image" class="outline-button" type="button" onclick="generateDeveloperAIImage()" style="border-radius:18px;">▧ IMAGE</button>
          <button id="developer-ai-code-push" class="outline-button" type="button" onclick="toggleDeveloperAICodePush()" style="border-radius:18px;">CODE PUSH: OFF</button>
        </div>
        <small style="display:block;margin-top:8px;">Gemini free tier has limits. Messages go to Google; keep private business data out. Audio follows your iPhone output selection.</small>
        <small id="developer-ai-status" style="display:block;margin-top:8px;color:#61728c;">Developer-only. Sensitive or destructive actions still require confirmation.</small>
        <small style="display:block;margin-top:4px;color:#7b8aa0;">Voice is AI-generated. Call mode uses speech recognition when supported by your device.</small>
      </section>

      <section id="developer-code-alerts" class="card" style="padding:18px;background:#f8fbff;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;">
          <div>
            <div class="eyebrow">LIVE RISK LIST</div>
            <h2 style="margin:4px 0;">Security & Code Alerts</h2>
            <p style="margin:0;color:#61728c;">What each problem can cause and how urgently it needs attention.</p>
          </div>
          <span class="pill">${getDeveloperAlerts().length} OPEN</span>
        </div>
        <div style="display:grid;gap:12px;">
          ${getDeveloperAlerts().map(developerAlertMarkup).join("")}
        </div>
        <div style="margin-top:14px;padding:14px;border-radius:14px;background:#ecfdf5;color:#166534;">
          <strong>${getResolvedDeveloperChecks().length} SECURITY CHECKS FIXED</strong>
          <div style="display:grid;gap:6px;margin-top:8px;font-size:13px;">
            ${getResolvedDeveloperChecks().map(item => `<div>✓ ${escapeHTML(item)}</div>`).join("")}
          </div>
        </div>
      </section>

      <section class="card" style="padding:18px;border:1px solid rgba(22,119,242,.18);background:linear-gradient(145deg,#ffffff,#f4f8ff);">
        <div class="eyebrow">NEW EVERY APP OPEN</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <h2 style="margin:4px 0 8px;">Features / Edits / Design / Fixes</h2>
          <span id="developer-recommendation-category" class="pill">Loading</span>
        </div>
        <p id="developer-recommendation-text" style="margin:0;color:#334a68;font-size:16px;font-weight:750;line-height:1.5;">
          Creating a new recommendation that has never been used…
        </p>
        <small id="developer-recommendation-counter" style="display:block;margin-top:10px;color:#7b8aa0;"></small>
      </section>

      <section class="card" style="padding:18px;">
        <div class="eyebrow">ADMIN</div>
        <h2 style="margin:4px 0 8px;">Entire App Setup</h2>
        <p style="margin:0 0 14px;color:#61728c;">Open all company setup and management controls.</p>
        <button class="outline-button" type="button" onclick="showSection('settings')">OPEN ADMIN SETUP</button>
      </section>

      <section class="card" style="padding:18px;">
        <div class="eyebrow">EMPLOYEE</div>
        <h2 style="margin:4px 0 8px;">Employee Experience</h2>
        <p style="margin:0 0 14px;color:#61728c;">Preview the simple employee-facing app.</p>
        <button class="outline-button" type="button" onclick="switchDeveloperView('Employee')">OPEN EMPLOYEE VIEW</button>
      </section>

      <section class="card" style="padding:18px;">
        <h2 style="margin:0 0 6px;text-align:center;">Which would you like to switch to?</h2>
        <p style="margin:0 0 14px;text-align:center;color:#61728c;">Quick access</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button class="primary-button" type="button" onclick="switchDeveloperView('Admin')">ADMIN</button>
          <button class="primary-button" type="button" onclick="switchDeveloperView('Employee')">EMPLOYEE</button>
        </div>
      </section>
    `;

    Array.from(dashboard.children).forEach(child => {
      child.hidden = true;
    });
    dashboard.insertBefore(home, dashboard.firstChild);
    loadDeveloperRecommendation();
  }
}

/* =========================================================
   HOMEPAGE EMPLOYEE TIME CLOCK
   ========================================================= */

function installHomeTimeClock() {
  const dashboard = $("dashboard");

  if (isDeveloperLogin() && getDeveloperView() === "Developer") {
    const existing = $("home-time-clock");
    if (existing) existing.remove();
    return;
  }

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

const SUPABASE_URL = "https://nvgzbgcuzuzbvbcksfhq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZVRbTwG3_0zWt2FlrMn_3w_y8HlM-r-";
const LOGIN_KEY = "myservice_test_login";
const ACCESS_TOKEN_KEY = "myservice_supabase_access_token";
const REFRESH_TOKEN_KEY = "myservice_supabase_refresh_token";
const USER_ID_KEY = "myservice_supabase_user_id";
const PIN_VERIFIED_KEY = "myservice_pin_verified_user";
let authenticatedContext = null;

function getStoredAuthItem(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function saveAuthTokens(authData, persistent) {
  const destination = persistent ? localStorage : sessionStorage;
  const other = persistent ? sessionStorage : localStorage;

  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY].forEach(key => other.removeItem(key));

  destination.setItem(ACCESS_TOKEN_KEY, authData.access_token || "");
  destination.setItem(REFRESH_TOKEN_KEY, authData.refresh_token || "");
  destination.setItem(USER_ID_KEY, authData.user?.id || "");
}

function normalizeDatabaseRole(role) {
  return {
    developer: "Developer",
    primary_admin: "Admin",
    admin: "Admin",
    manager: "Manager",
    company_support: "Manager",
    employee: "Employee"
  }[String(role || "").toLowerCase()] || "Employee";
}

async function fetchMyAppContext(accessToken, companyCode = null) {
  const response = await fetch(SUPABASE_URL + "/rest/v1/rpc/get_my_app_context", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ company_code: companyCode })
  });

  if (!response.ok) {
    const error = new Error("Unable to verify account access.");
    error.status = response.status;
    throw error;
  }

  const rows = await response.json();
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row) return null;

  return {
    id: row.user_id,
    email: "",
    name: row.full_name || "MyService User",
    role: normalizeDatabaseRole(row.role),
    databaseRole: row.role,
    companyId: String(row.company_id),
    companyName: row.company_name || "MyService Business",
    active: row.active === true
  };
}

async function refreshStoredSession() {
  const refreshToken = getStoredAuthItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const persistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
  const response = await fetch(
    SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token",
    {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    }
  );

  if (!response.ok) return null;
  const authData = await response.json();
  if (!authData.access_token) return null;

  saveAuthTokens(authData, persistent);
  return authData.access_token;
}

async function restoreAuthenticatedContext() {
  let accessToken = getStoredAuthItem(ACCESS_TOKEN_KEY);
  if (!accessToken) return null;

  try {
    authenticatedContext = await fetchMyAppContext(accessToken);
    return authenticatedContext;
  } catch (error) {
    // A 401 means the access token expired. Refresh it normally.
    if (error?.status === 401) {
      accessToken = await refreshStoredSession();
      if (!accessToken) return null;

      authenticatedContext = await fetchMyAppContext(accessToken);
      return authenticatedContext;
    }

    // Network/server failures are NOT a logout condition.
    const transient = new Error("AUTH_TEMPORARY_UNAVAILABLE");
    transient.cause = error;
    throw transient;
  }
}

async function loginTestUser(email, password, companyCode) {
  email = String(email || "").trim().toLowerCase();
  companyCode = String(companyCode || "").trim();

  if (!email || !password || !/^\d{6}$/.test(companyCode)) {
    alert("Enter your email, password, and 6-digit company code.");
    return false;
  }

  const authResponse = await fetch(
    SUPABASE_URL + "/auth/v1/token?grant_type=password",
    {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
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

  let context;
  try {
    context = await fetchMyAppContext(authData.access_token, companyCode);
  } catch {
    context = null;
  }

  if (!context || !context.active) {
    alert("Incorrect email, password, or company code.");
    return false;
  }

  const stayLoggedIn = $("stayLoggedIn")?.checked !== false;
  saveAuthTokens(authData, stayLoggedIn);

  if (stayLoggedIn) {
    localStorage.setItem(LOGIN_KEY, email);
    sessionStorage.removeItem(LOGIN_KEY);
  } else {
    sessionStorage.setItem(LOGIN_KEY, email);
    localStorage.removeItem(LOGIN_KEY);
  }

  context.email = email;
  authenticatedContext = context;
  sessionStorage.removeItem(PIN_VERIFIED_KEY);

  return true;
}

async function userHasQuickPin(accessToken) {
  if (!accessToken) return false;

  const response = await fetch(SUPABASE_URL + "/rest/v1/rpc/has_my_quick_pin", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: "{}"
  });

  if (!response.ok) return false;
  return (await response.json()) === true;
}

function isQuickPinVerified(userId) {
  return sessionStorage.getItem(PIN_VERIFIED_KEY) === String(userId || "");
}


const quickPinPadHandlers = new Map();

function quickPinPadMarkup(prefix) {
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return `
    <div id="${prefix}PinPadKeys" data-pin-pad="${prefix}"
      style="display:grid;grid-template-columns:repeat(3,72px);justify-content:center;gap:12px;margin:18px auto 6px;touch-action:manipulation;">
      ${keys.map(key => {
        if (!key) return '<span></span>';
        const safe = key === "⌫" ? "backspace" : key;
        return '<button type="button" data-pin-key="' + safe + '" data-pin-prefix="' + prefix + '" ' +
          'style="width:72px;height:58px;border-radius:14px;border:1px solid #d8e1ed;background:#fff;color:#16304f;font-size:22px;font-weight:800;box-shadow:0 3px 10px rgba(15,35,65,.05);touch-action:manipulation;pointer-events:auto;-webkit-tap-highlight-color:rgba(22,119,242,.18);">' +
          key + '</button>';
      }).join("")}
    </div>
  `;
}

function quickPinDisplayMarkup(prefix, label) {
  return `
    <div style="margin-top:16px;">
      <div style="font-size:12px;font-weight:800;color:#61728c;margin-bottom:8px;">${label}</div>
      <div id="${prefix}PinDots" style="display:flex;justify-content:center;gap:12px;min-height:20px;"></div>
      <div id="${prefix}PinShown" style="display:none;margin-top:8px;font-size:22px;font-weight:850;letter-spacing:8px;color:#0d2345;"></div>
      <button id="${prefix}ShowPin" type="button" style="margin-top:8px;border:0;background:transparent;color:#1677f2;font-weight:800;font-size:13px;cursor:pointer;">
        Show
      </button>
    </div>
  `;
}

function renderQuickPinDisplay(prefix, value, shown) {
  const dots = $(prefix + "PinDots");
  const text = $(prefix + "PinShown");
  const toggle = $(prefix + "ShowPin");
  const length = String(value || "").length;

  if (dots) {
    dots.style.display = shown ? "none" : "flex";
    dots.innerHTML = [0,1,2,3].map(i =>
      '<span style="width:14px;height:14px;border-radius:50%;display:inline-block;border:2px solid #9fb0c5;background:' +
      (i < length ? '#1677f2' : '#fff') + ';"></span>'
    ).join("");
  }

  if (text) {
    text.style.display = shown ? "block" : "none";
    text.textContent = shown ? String(value || "") : "";
  }

  if (toggle) toggle.textContent = shown ? "Hide" : "Show";
}

function attachQuickPinPad(prefix) {
  const entry = quickPinPadHandlers.get(prefix);
  const pad = document.getElementById(prefix + "PinPadKeys");
  if (!entry || !pad || pad.dataset.pinBound === "1") return;

  pad.dataset.pinBound = "1";
  pad.addEventListener("pointerdown", event => {
    const button = event.target.closest?.("[data-pin-key]");
    if (!button || !pad.contains(button)) return;

    event.preventDefault();
    event.stopPropagation();
    entry.press(button);
  }, { passive: false });
}

function bindQuickPinPad(prefix, getValue, setValue, onComplete) {
  let completing = false;

  const press = function (button) {
    const key = button.getAttribute("data-pin-key");
    let value = String(getValue() || "");

    if (key === "backspace") value = value.slice(0, -1);
    else if (/^\d$/.test(key) && value.length < 4) value += key;
    else return;

    setValue(value);

    if (value.length === 4 && typeof onComplete === "function" && !completing) {
      completing = true;
      setTimeout(async () => {
        try {
          await onComplete(value);
        } finally {
          completing = false;
        }
      }, 90);
    }
  };

  quickPinPadHandlers.set(prefix, { press });
  attachQuickPinPad(prefix);
}

function installQuickPinInteractionWatchdog() {
  if (window.__myservicePinWatchdogInstalled) return;
  window.__myservicePinWatchdogInstalled = true;

  setInterval(() => {
    const screen = document.getElementById("myservice-pin-screen");
    if (!screen) return;

    screen.style.pointerEvents = "auto";
    screen.style.zIndex = "2147483647";

    ["verify", "setup"].forEach(prefix => {
      const pad = document.getElementById(prefix + "PinPadKeys");
      if (!pad) return;

      pad.querySelectorAll("[data-pin-key]").forEach(button => {
        button.disabled = false;
        button.style.pointerEvents = "auto";
      });

      if (quickPinPadHandlers.has(prefix) && pad.dataset.pinBound !== "1") {
        attachQuickPinPad(prefix);
      }
    });
  }, 500);
}

installQuickPinInteractionWatchdog();

function showQuickPinSetupScreen(accessToken, userId) {
  window.__myservicePinScreenContext = { mode: "setup", accessToken, userId };
  let firstPin = "";
  let confirmPin = "";
  let stage = "first";
  let showPin = false;

  function renderStage() {
    const title = $("quickPinSetupTitle");
    const subtitle = $("quickPinSetupSubtitle");
    const display = $("quickPinSetupDisplay");
    const pad = $("quickPinSetupPad");
    const message = $("quickPinSetupMessage");

    if (message) message.textContent = "";
    if (stage === "first") {
      if (title) title.textContent = "Create your 4-digit login code";
      if (subtitle) subtitle.textContent = "Use the numbers below. Your iPhone keyboard will not open.";
    } else {
      if (title) title.textContent = "Confirm your login code";
      if (subtitle) subtitle.textContent = "Enter the same 4 digits again.";
    }

    if (display) display.innerHTML = quickPinDisplayMarkup("setup", stage === "first" ? "Login code" : "Confirm code");
    if (pad) pad.innerHTML = quickPinPadMarkup("setup");

    const currentValue = () => stage === "first" ? firstPin : confirmPin;
    renderQuickPinDisplay("setup", currentValue(), showPin);

    $("setupShowPin").onclick = function () {
      showPin = !showPin;
      renderQuickPinDisplay("setup", currentValue(), showPin);
    };

    bindQuickPinPad("setup", currentValue, value => {
      if (stage === "first") firstPin = value;
      else confirmPin = value;
      renderQuickPinDisplay("setup", value, showPin);
    }, async value => {
      if (stage === "first") {
        firstPin = value;
        stage = "confirm";
        showPin = false;
        renderStage();
        return;
      }

      confirmPin = value;
      if (firstPin !== confirmPin) {
        if (message) message.textContent = "Those codes do not match. Try again.";
        confirmPin = "";
        renderQuickPinDisplay("setup", confirmPin, showPin);
        return;
      }

      const response = await fetch(
        SUPABASE_URL + "/rest/v1/rpc/set_my_quick_pin",
        {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ new_pin: firstPin })
        }
      );

      if (!response.ok) {
        if (message) message.textContent = "Login code could not be saved. Please try again.";
        return;
      }

      sessionStorage.setItem(PIN_VERIFIED_KEY, String(userId || ""));
      location.reload();
    });
  }

  document.body.innerHTML = `
    <div id="myservice-pin-screen" style="position:fixed;inset:0;z-index:2147483647;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#1677f2;box-sizing:border-box;pointer-events:auto;overflow:auto;-webkit-overflow-scrolling:touch;">
      <div style="width:100%;max-width:390px;background:white;padding:24px;border-radius:20px;box-shadow:0 12px 36px rgba(16,42,76,.08);box-sizing:border-box;text-align:center;">
        <div style="font-size:12px;font-weight:900;letter-spacing:1.4px;color:#1677f2;margin-bottom:6px;">MYSERVICE LOGIN CODE</div>
        <h1 id="quickPinSetupTitle" style="margin:0;color:#0d2345;font-size:27px;"></h1>
        <p id="quickPinSetupSubtitle" style="color:#61728c;line-height:1.45;margin:8px 0 0;"></p>
        <div id="quickPinSetupDisplay"></div>
        <div id="quickPinSetupMessage" style="min-height:22px;margin-top:10px;color:#b91c1c;font-size:14px;"></div>
        <div id="quickPinSetupPad"></div>
      </div>
    </div>
  `;

  renderStage();
}

function showQuickPinVerificationScreen(accessToken, userId) {
  window.__myservicePinScreenContext = { mode: "verify", accessToken, userId };
  let pin = "";
  let showPin = false;

  document.body.innerHTML = `
    <div id="myservice-pin-screen" style="position:fixed;inset:0;z-index:2147483647;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#1677f2;box-sizing:border-box;pointer-events:auto;overflow:auto;-webkit-overflow-scrolling:touch;">
      <div style="width:100%;max-width:390px;background:white;padding:24px;border-radius:20px;box-shadow:0 12px 36px rgba(16,42,76,.08);box-sizing:border-box;text-align:center;">
        <div style="font-size:12px;font-weight:900;letter-spacing:1.4px;color:#1677f2;margin-bottom:6px;">MYSERVICE LOGIN CODE</div>
        <h1 style="margin:0;color:#0d2345;font-size:27px;">Enter your 4-digit login code</h1>
        <p style="color:#61728c;line-height:1.45;margin:8px 0 0;">Verify it is you before opening MyService.</p>

        <div id="verifyQuickPinDisplay">
          ${quickPinDisplayMarkup("verify", "Login code")}
        </div>

        <div id="pinVerifyMessage" style="min-height:22px;margin-top:10px;color:#b91c1c;font-size:14px;"></div>
        <div id="verifyQuickPinPad">${quickPinPadMarkup("verify")}</div>

        <button id="pinLogoutButton" type="button" class="outline-button"
          style="width:100%;min-height:46px;margin-top:12px;border-radius:12px;font-weight:800;">LOG OUT</button>
      </div>
    </div>
  `;

  renderQuickPinDisplay("verify", pin, showPin);

  $("verifyShowPin").onclick = function () {
    showPin = !showPin;
    renderQuickPinDisplay("verify", pin, showPin);
  };

  $("pinLogoutButton").onclick = logoutTestUser;

  bindQuickPinPad("verify", () => pin, value => {
    pin = value;
    renderQuickPinDisplay("verify", pin, showPin);
    const message = $("pinVerifyMessage");
    if (message) message.textContent = "";
  }, async value => {
    const message = $("pinVerifyMessage");

    const response = await fetch(SUPABASE_URL + "/rest/v1/rpc/verify_my_quick_pin", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ candidate_pin: value })
    });

    if (!response.ok) {
      if (message) message.textContent = "Login code could not be verified. Please try again.";
      return;
    }

    const result = await response.json();

    if (result?.verified) {
      sessionStorage.setItem(PIN_VERIFIED_KEY, String(userId || ""));
      location.reload();
      return;
    }

    if (result?.locked) {
      const until = result.locked_until
        ? new Date(result.locked_until).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : "15 minutes";
      if (message) message.textContent = "Too many attempts. Try again after " + until + ".";
      return;
    }

    if (message) message.textContent = "Incorrect login code. " + Number(result?.remaining_attempts || 0) + " attempt(s) remaining.";
    pin = "";
    renderQuickPinDisplay("verify", pin, showPin);
  });
}

function logoutTestUser() {
  const accessToken = getStoredAuthItem(ACCESS_TOKEN_KEY);

  if (accessToken) {
    fetch(SUPABASE_URL + "/auth/v1/logout", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + accessToken
      }
    }).catch(() => {});
  }

  [
    LOGIN_KEY,
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_ID_KEY
  ].forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  sessionStorage.removeItem(PIN_VERIFIED_KEY);
  localStorage.removeItem(DEVELOPER_VIEW_KEY);
  authenticatedContext = null;
  location.reload();
}

function getLoggedInTestUser() {
  return authenticatedContext;
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
    SUPABASE_URL + "/auth/v1/recover?redirect_to=" +
      encodeURIComponent("https://cnickerson-detailadmin.github.io/MyDetail/"),
    {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
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
      SUPABASE_URL + "/auth/v1/user",
      {
        method: "PUT",
        headers: {
          "apikey": SUPABASE_KEY,
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
          maxlength="6"
          pattern="[0-9]{6}"
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

function showAuthRecoveryScreen() {
  document.body.innerHTML = `
    <div style="position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:22px;background:#1677f2;box-sizing:border-box;">
      <div style="width:100%;max-width:390px;background:#fff;border-radius:20px;padding:24px;box-sizing:border-box;text-align:center;">
        <div style="font-size:12px;font-weight:900;letter-spacing:1.3px;color:#1677f2;">MYSERVICE SECURE SIGN-IN</div>
        <h1 style="margin:8px 0 6px;color:#0d2345;font-size:25px;">Connection interrupted</h1>
        <p style="margin:0;color:#61728c;line-height:1.45;">Your login was kept safe. MyService did not sign you out.</p>
        <button id="authRecoveryRetry" type="button" class="primary-button"
          style="width:100%;min-height:50px;margin-top:18px;border-radius:14px;">TRY AGAIN</button>
      </div>
    </div>
  `;

  const retry = $("authRecoveryRetry");
  if (retry) retry.onclick = () => location.reload();
}

function withAuthStartupTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AUTH_STARTUP_TIMEOUT")), ms)
    )
  ]);
}

document.addEventListener(
  "DOMContentLoaded",
  async function () {
    try {
      const recoverySession = getRecoverySessionFromUrl();

      if (recoverySession) {
        showPasswordRecoveryScreen(recoverySession.accessToken);
        return;
      }

      const loggedIn = await withAuthStartupTimeout(restoreAuthenticatedContext());

      if (!loggedIn) {
        [
          LOGIN_KEY,
          ACCESS_TOKEN_KEY,
          REFRESH_TOKEN_KEY,
          USER_ID_KEY
        ].forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        showLoginScreen();
        activateLoginScreen();
        return;
      }

      activateCompanyStorage(loggedIn.companyId);
      state.companyName = loggedIn.companyName;

      const accessToken = getStoredAuthItem(ACCESS_TOKEN_KEY);
      const userId = loggedIn.id;
      const hasQuickPin = await withAuthStartupTimeout(userHasQuickPin(accessToken));

      if (!hasQuickPin) {
        showQuickPinSetupScreen(accessToken, userId);
        return;
      }

      if (!isQuickPinVerified(userId)) {
        showQuickPinVerificationScreen(accessToken, userId);
        return;
      }

      const activeRole =
        loggedIn.role === "Developer"
          ? getDeveloperView()
          : loggedIn.role;

      state.currentUser = {
        id: userId,
        email: loggedIn.email,
        name: activeRole === "Developer"
          ? loggedIn.name
          : loggedIn.name + " (" + activeRole + " Preview)",
        role: activeRole,
        companyId: loggedIn.companyId
      };

      const currentEmployee = getCurrentEmployee();
      currentEmployee.name = state.currentUser.name;
      currentEmployee.role = activeRole;

      saveState();
      updateDateTime();

      document.getElementById("myservice-auth-boot")?.remove();

      const savedPage = localStorage.getItem(ACTIVE_PAGE_KEY);

      showSection(
        savedPage &&
        $(savedPage)?.classList.contains("page")
          ? savedPage
          : "dashboard"
      );
    } catch (error) {
      console.error("MyService auth startup failed:", error);

      const transient =
        error?.message === "AUTH_STARTUP_TIMEOUT" ||
        error?.message === "AUTH_TEMPORARY_UNAVAILABLE";

      if (transient && getStoredAuthItem(REFRESH_TOKEN_KEY)) {
        showAuthRecoveryScreen();
        return;
      }

      // Only clear stored credentials when the session is genuinely invalid.
      [
        LOGIN_KEY,
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_ID_KEY
      ].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      showLoginScreen();
      activateLoginScreen();
    }
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

/* =========================================================
   DEVELOPER SUPPLIER / BUYER CONNECTIONS
   Developer-only marketplace configuration workspace.
   ========================================================= */

const SUPPLIER_MARKETPLACE_KEY = "myservice_supplier_marketplace_v1";

function getSupplierMarketplaceState() {
  try {
    const raw = localStorage.getItem(SUPPLIER_MARKETPLACE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      suppliers: Array.isArray(parsed?.suppliers) ? parsed.suppliers : [],
      buyers: Array.isArray(parsed?.buyers) ? parsed.buyers : [],
      connections: Array.isArray(parsed?.connections) ? parsed.connections : [],
      settings: {
        supplierFeePercent: Number(parsed?.settings?.supplierFeePercent ?? 4),
        buyerCreditPercent: Number(parsed?.settings?.buyerCreditPercent ?? 2),
        myServicePercent: Number(parsed?.settings?.myServicePercent ?? 2),
        minMyServicePercent: Number(parsed?.settings?.minMyServicePercent ?? 1)
      }
    };
  } catch {
    return {
      suppliers: [], buyers: [], connections: [],
      settings: { supplierFeePercent: 4, buyerCreditPercent: 2, myServicePercent: 2, minMyServicePercent: 1 }
    };
  }
}

function saveSupplierMarketplaceState(value) {
  localStorage.setItem(SUPPLIER_MARKETPLACE_KEY, JSON.stringify(value));
}

function supplierMarketplaceMarkup() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;

  const dashboard = $("dashboard");
  if (!dashboard) return;

  let panel = $("developer-supplier-marketplace");
  if (!panel) {
    panel = document.createElement("section");
    panel.id = "developer-supplier-marketplace";
    panel.className = "panel";
    panel.style.cssText = "margin-bottom:18px;border:2px solid rgba(22,119,255,.18);";
    dashboard.insertBefore(panel, dashboard.children[1] || null);
  }

  const m = getSupplierMarketplaceState();
  const fee = m.settings.supplierFeePercent;
  const credit = m.settings.buyerCreditPercent;
  const retained = m.settings.myServicePercent;

  panel.innerHTML = `
    <div class="eyebrow">DEVELOPER ONLY • SUPPLIER MARKETPLACE</div>
    <h2 style="margin:4px 0 6px;">Supplier / Buyer Connections</h2>
    <p style="margin:0 0 16px;color:#61728c;">
      Configure the marketplace model before exposing it to customer businesses.
      This developer workspace does not process real orders or payments.
    </p>

    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:14px;">
      <div style="padding:14px;border-radius:15px;background:#f8fbff;">
        <small>SUPPLIER FEE</small><strong style="display:block;font-size:24px;">${fee}%</strong>
      </div>
      <div style="padding:14px;border-radius:15px;background:#f8fbff;">
        <small>BUYER CREDIT</small><strong style="display:block;font-size:24px;">${credit}%</strong>
      </div>
      <div style="padding:14px;border-radius:15px;background:#f8fbff;">
        <small>MYSERVICE RETAINED</small><strong style="display:block;font-size:24px;">${retained}%</strong>
      </div>
    </div>

    <div style="padding:14px;border:1px solid #dbe7f5;border-radius:15px;margin-bottom:14px;">
      <strong>Current proposed model</strong>
      <p style="margin:6px 0 0;color:#61728c;">
        Supplier pays ${fee}% per completed shipment. ${credit}% is credited to the buyer and
        ${retained}% is retained by MyService. The MyService retained share cannot be configured
        below ${m.settings.minMyServicePercent}%.
      </p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="outline-button" type="button" onclick="addDeveloperSupplier()">+ ADD SUPPLIER</button>
      <button class="outline-button" type="button" onclick="addDeveloperBuyer()">+ ADD BUYER</button>
      <button class="outline-button" type="button" onclick="connectDeveloperSupplierBuyer()">CONNECT SUPPLIER → BUYER</button>
      <button class="outline-button" type="button" onclick="showDeveloperMarketplaceConnections()">VIEW CONNECTIONS</button>
    </div>

    <div style="margin-top:14px;padding:14px;border-radius:15px;background:#f8fbff;">
      <strong>Developer setup counts</strong>
      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:8px;color:#61728c;font-size:13px;">
        <span>Suppliers: ${m.suppliers.length}</span>
        <span>Buyers: ${m.buyers.length}</span>
        <span>Connections: ${m.connections.length}</span>
      </div>
    </div>
  `;
}

function addDeveloperSupplier() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;
  const name = prompt("Supplier business name:");
  if (!name?.trim()) return;
  const m = getSupplierMarketplaceState();
  m.suppliers.push({ id: uid("supplier"), name: name.trim(), status: "Pending verification", createdAt: new Date().toISOString() });
  saveSupplierMarketplaceState(m);
  supplierMarketplaceMarkup();
}

function addDeveloperBuyer() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;
  const name = prompt("Buyer business name:");
  if (!name?.trim()) return;
  const m = getSupplierMarketplaceState();
  m.buyers.push({ id: uid("buyer"), name: name.trim(), status: "Pending verification", createdAt: new Date().toISOString() });
  saveSupplierMarketplaceState(m);
  supplierMarketplaceMarkup();
}

function connectDeveloperSupplierBuyer() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;
  const m = getSupplierMarketplaceState();
  if (!m.suppliers.length || !m.buyers.length) {
    alert("Add at least one supplier and one buyer first.");
    return;
  }

  const supplier = m.suppliers[m.suppliers.length - 1];
  const buyer = m.buyers[m.buyers.length - 1];

  m.connections.push({
    id: uid("connection"),
    supplierId: supplier.id,
    supplierName: supplier.name,
    buyerId: buyer.id,
    buyerName: buyer.name,
    status: "Pending supplier/buyer approval",
    feeModel: { supplierFeePercent: m.settings.supplierFeePercent, buyerCreditPercent: m.settings.buyerCreditPercent, myServicePercent: m.settings.myServicePercent },
    createdAt: new Date().toISOString()
  });

  saveSupplierMarketplaceState(m);
  supplierMarketplaceMarkup();
  alert("Developer test connection created. Real customer matching and payments require the secure backend.");
}

function showDeveloperMarketplaceConnections() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;
  const m = getSupplierMarketplaceState();
  if (!m.connections.length) {
    alert("No supplier/buyer connections yet.");
    return;
  }
  alert(m.connections.map((c, i) =>
    (i + 1) + ". " + c.supplierName + " → " + c.buyerName + " • " + c.status
  ).join("\\n"));
}

function installDeveloperSupplierMarketplace() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") {
    $("developer-supplier-marketplace")?.remove();
    return;
  }
  supplierMarketplaceMarkup();
}

const originalInstallDeveloperExperience = installDeveloperExperience;
installDeveloperExperience = function () {
  originalInstallDeveloperExperience();
  installDeveloperSupplierMarketplace();
};


/* =========================================================
   MYSERVICE ADVANCED OPERATIONS SUITE
   Functional frontend foundation for finance, inventory,
   staffing, intelligence, onboarding and integrations.
   External POS/payroll/weather/event connections remain
   connection-ready until provider credentials/APIs are added.
   ========================================================= */

const MYSERVICE_ADVANCED_KEY = "myservice_advanced_suite_v1";

function advancedDefaultState() {
  return {
    finance: {
      dailySales: [],
      weeklyNotes: [],
      monthlyNotes: []
    },
    inventory: [],
    inventoryActivity: [],
    goals: [],
    correctiveActions: [],
    events: [],
    integrationSettings: {
      posProvider: "",
      payrollProvider: "",
      posConnected: false,
      payrollConnected: false,
      businessAddress: "",
      businessStreet: "",
      businessCity: "",
      businessState: "",
      businessPostalCode: "",
      businessLat: null,
      businessLon: null
    },
    forecastSettings: {
      laborTargetPercent: 25,
      softwareLaborLow: 22,
      softwareLaborHigh: 30,
      eventRadiusMiles: 15
    },
    onboarding: {
      businessCreated: true,
      posConnected: false,
      payrollConnected: false,
      employeesImported: false,
      settingsReviewed: false,
      dashboardCustomized: false,
      intelligenceEnabled: true
    },
    supplierDetails: {}
  };
}

function getAdvancedState() {
  try {
    const raw = localStorage.getItem(MYSERVICE_ADVANCED_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const base = advancedDefaultState();
    return {
      ...base,
      ...parsed,
      finance: {...base.finance, ...(parsed.finance || {})},
      integrationSettings: {...base.integrationSettings, ...(parsed.integrationSettings || {})},
      forecastSettings: {...base.forecastSettings, ...(parsed.forecastSettings || {})},
      onboarding: {...base.onboarding, ...(parsed.onboarding || {})},
      supplierDetails: {...base.supplierDetails, ...(parsed.supplierDetails || {})},
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
      inventoryActivity: Array.isArray(parsed.inventoryActivity) ? parsed.inventoryActivity : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      correctiveActions: Array.isArray(parsed.correctiveActions) ? parsed.correctiveActions : [],
      events: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch {
    return advancedDefaultState();
  }
}

function saveAdvancedState(value) {
  localStorage.setItem(MYSERVICE_ADVANCED_KEY, JSON.stringify(value));
}

function advancedMoney(value) {
  return Number(value || 0).toLocaleString("en-US", {style:"currency", currency:"USD"});
}

function advancedDateKey(date = new Date()) {
  return dateKey(date);
}

function advancedWeekStart(input = new Date()) {
  const d = new Date(input);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0,0,0,0);
  return d;
}

function advancedMonthStart(input = new Date()) {
  const d = new Date(input);
  d.setDate(1);
  d.setHours(0,0,0,0);
  return d;
}

function advancedCompletedSalesBetween(start, end) {
  return (state.jobs || []).filter(job => {
    const when = job.completedAt || job.createdAt || job.date || job.time;
    if (!when) return false;
    const d = new Date(when);
    return !Number.isNaN(d.getTime()) && d >= start && d <= end && String(job.status || "").toLowerCase() === "completed";
  }).reduce((sum, job) => sum + Number(job.price || 0), 0);
}

function advancedPunchLaborBetween(start, end) {
  return (state.punches || []).reduce((sum, punch) => {
    const when = punch.clockIn ? new Date(punch.clockIn) : null;
    if (!when || when < start || when > end) return sum;
    const hours = calculatePunchHours(punch, true);
    const rate = Number(punch.hourlyRate || TEST_HOURLY_RATE || 0);
    return sum + (hours * rate);
  }, 0);
}

function advancedInventoryCostBetween(start, end) {
  const adv = getAdvancedState();
  return adv.inventoryActivity.reduce((sum, row) => {
    const d = row.time ? new Date(row.time) : null;
    if (!d || d < start || d > end) return sum;
    if (!["purchase","waste","used"].includes(row.type)) return sum;
    return sum + Number(row.cost || 0);
  }, 0);
}

function advancedFinancialSnapshot(start, end) {
  const adv = getAdvancedState();
  const manualSales = adv.finance.dailySales.reduce((sum, row) => {
    const d = new Date(row.date + "T12:00:00");
    if (d < start || d > end) return sum;
    return sum + Number(row.sales || 0);
  }, 0);
  const automatedSales = advancedCompletedSalesBetween(start, end);
  const sales = automatedSales > 0 ? automatedSales : manualSales;
  const labor = advancedPunchLaborBetween(start, end);
  const supplies = advancedInventoryCostBetween(start, end);
  const kept = sales - labor - supplies;
  return {sales, labor, supplies, kept};
}

function advancedTodayRange() {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);
  return {start,end};
}

function advancedWeekRange() {
  const start = advancedWeekStart(new Date());
  const end = new Date(start);
  end.setDate(end.getDate()+6);
  end.setHours(23,59,59,999);
  return {start,end};
}

function advancedMonthRange() {
  const start = advancedMonthStart(new Date());
  const end = new Date(start);
  end.setMonth(end.getMonth()+1);
  end.setMilliseconds(-1);
  return {start,end};
}

function recordDailySalesTotal() {
  if (!canManageEmployees()) return;
  const value = prompt("Enter today's total sales:");
  if (value === null) return;
  const sales = Number(value);
  if (!Number.isFinite(sales) || sales < 0) {
    alert("Enter a valid sales total.");
    return;
  }
  const adv = getAdvancedState();
  const key = advancedDateKey();
  const existing = adv.finance.dailySales.find(x => x.date === key);
  if (existing) existing.sales = sales;
  else adv.finance.dailySales.push({date:key, sales});
  saveAdvancedState(adv);
  renderAll();
}

function addInventoryItemAdvanced() {
  if (!canManageEmployees()) return;
  const name = prompt("Supply / inventory item:");
  if (!name?.trim()) return;
  const qty = Number(prompt("Current quantity:", "0"));
  const reorderAt = Number(prompt("Low-stock alert quantity:", "5"));
  const unitCost = Number(prompt("Cost per unit:", "0"));
  const adv = getAdvancedState();
  adv.inventory.push({
    id: uid("inv"),
    name: name.trim(),
    qty: Number.isFinite(qty) ? qty : 0,
    reorderAt: Number.isFinite(reorderAt) ? reorderAt : 5,
    unitCost: Number.isFinite(unitCost) ? unitCost : 0,
    updatedAt: new Date().toISOString()
  });
  saveAdvancedState(adv);
  renderAll();
}

function recordInventoryActivityAdvanced() {
  if (!canManageEmployees()) return;
  const adv = getAdvancedState();
  if (!adv.inventory.length) {
    alert("Add an inventory item first.");
    return;
  }
  const item = adv.inventory[adv.inventory.length - 1];
  const type = prompt("Type: purchase, used, or waste", "purchase");
  if (!["purchase","used","waste"].includes(String(type || "").toLowerCase())) return;
  const qty = Number(prompt("Quantity:", "1"));
  if (!Number.isFinite(qty) || qty <= 0) return;
  const normalized = String(type).toLowerCase();
  if (normalized === "purchase") item.qty += qty;
  else item.qty = Math.max(0, item.qty - qty);
  const cost = qty * Number(item.unitCost || 0);
  adv.inventoryActivity.push({
    id: uid("invlog"),
    itemId: item.id,
    itemName: item.name,
    type: normalized,
    qty,
    cost,
    time: new Date().toISOString()
  });
  item.updatedAt = new Date().toISOString();
  saveAdvancedState(adv);
  renderAll();
}

function addCorrectiveActionAdvanced() {
  if (!canManageEmployees()) return;
  const employee = prompt("Employee name:");
  if (!employee?.trim()) return;
  const reason = prompt("Corrective action reason:");
  if (!reason?.trim()) return;
  const followUp = prompt("Follow-up date (optional, YYYY-MM-DD):", "");
  const adv = getAdvancedState();
  adv.correctiveActions.unshift({
    id: uid("corrective"),
    employee: employee.trim(),
    reason: reason.trim(),
    outcome: "Open",
    acknowledged: false,
    followUp: followUp || "",
    createdAt: new Date().toISOString()
  });
  saveAdvancedState(adv);
  renderAll();
}

function addPlanningEventAdvanced() {
  if (!canManageEmployees()) return;
  const name = prompt("Event name:");
  if (!name?.trim()) return;
  const venue = prompt("Venue / place:", "");
  const date = prompt("Event date (YYYY-MM-DD):", advancedDateKey());
  const startTime = prompt("Start time (example 7:00 PM):", "");
  const estimatedEndTime = prompt("Estimated end time:", "");
  const demand = prompt("Demand hint: Low, Normal, or High", "High");
  const adv = getAdvancedState();
  adv.events.unshift({
    id: uid("event"),
    name: name.trim(),
    venue: venue || "",
    date: date || advancedDateKey(),
    startTime: startTime || "",
    estimatedEndTime: estimatedEndTime || "",
    demand: ["low","normal","high"].includes(String(demand).toLowerCase()) ? String(demand).toLowerCase() : "normal",
    source: "Manual planning entry",
    updatedAt: new Date().toISOString()
  });
  saveAdvancedState(adv);
  renderAll();
}

function addBusinessGoalAdvanced() {
  if (!canManageEmployees()) return;
  const name = prompt("Goal name:");
  if (!name?.trim()) return;
  const target = Number(prompt("Target value:", "0"));
  const current = Number(prompt("Current value:", "0"));
  const adv = getAdvancedState();
  adv.goals.unshift({
    id: uid("goal"),
    name: name.trim(),
    target: Number.isFinite(target) ? target : 0,
    current: Number.isFinite(current) ? current : 0,
    createdAt: new Date().toISOString()
  });
  saveAdvancedState(adv);
  renderAll();
}

function runWhatIfAdvanced() {
  const sales = Number(prompt("Projected sales:", "10000"));
  const labor = Number(prompt("Projected labor cost:", "2500"));
  const supplies = Number(prompt("Projected supply cost:", "1500"));
  if (![sales,labor,supplies].every(Number.isFinite)) return;
  const kept = sales - labor - supplies;
  alert("Projected money kept: " + advancedMoney(kept) + "\nProjected cost ratio: " +
    (sales > 0 ? (((labor + supplies) / sales) * 100).toFixed(1) : "0.0") + "%");
}

function businessAdvisorAdvanced(snapshot) {
  const notes = [];
  if (snapshot.sales <= 0) notes.push("No sales are recorded for this period yet.");
  if (snapshot.sales > 0) {
    const laborPct = snapshot.labor / snapshot.sales * 100;
    const suppliesPct = snapshot.supplies / snapshot.sales * 100;
    if (laborPct > 30) notes.push("Labor is above the software baseline range for this period.");
    else if (laborPct < 15) notes.push("Labor is unusually low relative to sales; confirm staffing and punch data are complete.");
    if (suppliesPct > 25) notes.push("Supply costs are taking a large share of sales; review purchasing and waste.");
    if (snapshot.kept < 0) notes.push("Recorded costs exceed recorded sales for this period.");
    if (snapshot.kept > 0) notes.push("Recorded sales currently exceed labor and supply costs.");
  }
  return notes;
}

function anomalyNotesAdvanced() {
  const adv = getAdvancedState();
  const rows = [...adv.finance.dailySales].sort((a,b) => a.date.localeCompare(b.date)).slice(-8);
  if (rows.length < 3) return ["Not enough daily sales history yet for anomaly detection."];
  const values = rows.map(r => Number(r.sales || 0));
  const avg = values.slice(0,-1).reduce((a,b)=>a+b,0) / Math.max(1, values.length-1);
  const latest = values[values.length-1];
  const diff = avg ? ((latest-avg)/avg)*100 : 0;
  if (Math.abs(diff) >= 30) return ["Latest recorded sales are " + Math.abs(diff).toFixed(0) + "% " + (diff > 0 ? "above" : "below") + " the recent average."];
  return ["No large sales anomaly detected from the available daily totals."];
}

function forecastNotesAdvanced() {
  const adv = getAdvancedState();
  const rows = [...adv.finance.dailySales].sort((a,b) => a.date.localeCompare(b.date)).slice(-7);
  if (rows.length < 2) return {text:"Not enough sales history for a data-based forecast.", confidence:"Not enough data"};
  const avg = rows.reduce((s,r)=>s+Number(r.sales||0),0)/rows.length;
  const nextWeek = avg * 7;
  const confidence = rows.length >= 7 ? "Medium" : "Low";
  return {text:"Current run-rate projects about " + advancedMoney(nextWeek) + " in weekly sales if recent activity holds.", confidence};
}

function staffingRecommendationAdvanced() {
  const range = advancedWeekRange();
  const snap = advancedFinancialSnapshot(range.start, range.end);
  const adv = getAdvancedState();
  const targetPct = Number(adv.forecastSettings.laborTargetPercent || 25) / 100;
  const targetLaborDollars = snap.sales * targetPct;
  const rate = Number(TEST_HOURLY_RATE || 17.5);
  const targetHours = rate > 0 ? targetLaborDollars / rate : 0;
  const actualHours = (state.punches || []).reduce((sum,p) => {
    const when = p.clockIn ? new Date(p.clockIn) : null;
    if (!when || when < range.start || when > range.end) return sum;
    return sum + calculatePunchHours(p,true);
  },0);
  return {
    targetHours,
    actualHours,
    delta: targetHours - actualHours,
    targetPct: Number(adv.forecastSettings.laborTargetPercent || 25)
  };
}

function inventoryForecastMarkupAdvanced() {
  const adv = getAdvancedState();
  if (!adv.inventory.length) return '<p style="margin:0;color:#61728c;">No inventory items yet. Add supplies to enable low-stock and order forecasting.</p>';
  return adv.inventory.map(item => {
    const low = Number(item.qty || 0) <= Number(item.reorderAt || 0);
    const useRows = adv.inventoryActivity.filter(x => x.itemId === item.id && ["used","waste"].includes(x.type)).slice(-10);
    const averageUse = useRows.length ? useRows.reduce((s,x)=>s+Number(x.qty||0),0)/useRows.length : 0;
    const remainingEvents = averageUse > 0 ? Number(item.qty||0)/averageUse : null;
    return '<div class="list-row"><div><strong>' + escapeHTML(item.name) + '</strong><small>' +
      Number(item.qty||0) + ' on hand • Low alert at ' + Number(item.reorderAt||0) +
      (remainingEvents ? ' • Roughly ' + remainingEvents.toFixed(1) + ' usage cycles remaining' : '') +
      '</small></div><span class="pill" style="' + (low ? 'background:#fee2e2;color:#b91c1c;' : 'background:#ecfdf5;color:#166534;') + '">' +
      (low ? 'LOW STOCK' : 'OK') + '</span></div>';
  }).join("");
}

function supplierScorecardsAdvanced() {
  if (typeof getSupplierMarketplaceState !== "function") return '<p>Supplier marketplace not loaded.</p>';
  const market = getSupplierMarketplaceState();
  const adv = getAdvancedState();
  if (!market.suppliers.length) return '<p style="margin:0;color:#61728c;">No suppliers added yet.</p>';
  return market.suppliers.map(s => {
    const detail = adv.supplierDetails[s.id] || {};
    return '<div class="list-row"><div><strong>' + escapeHTML(s.name) + '</strong><small>' +
      escapeHTML(detail.serviceArea || "Service area not set") + ' • On-time ' + Number(detail.onTimeRate ?? 100) + '% • Issue rate ' +
      Number(detail.issueRate ?? 0) + '% • Returns ' + Number(detail.returnRate ?? 0) + '%</small></div><span class="pill">' +
      escapeHTML(detail.verification || s.status || "Pending") + '</span></div>';
  }).join("");
}

function configureSupplierAdvanced() {
  if (!isDeveloperLogin() || getDeveloperView() !== "Developer") return;
  if (typeof getSupplierMarketplaceState !== "function") return;
  const market = getSupplierMarketplaceState();
  if (!market.suppliers.length) { alert("Add a supplier first."); return; }
  const s = market.suppliers[market.suppliers.length - 1];
  const adv = getAdvancedState();
  const current = adv.supplierDetails[s.id] || {};
  current.serviceArea = prompt("Supplier service area:", current.serviceArea || "Western New York") || "";
  current.onTimeRate = Number(prompt("On-time delivery %:", String(current.onTimeRate ?? 100)));
  current.issueRate = Number(prompt("Issue / damaged delivery %:", String(current.issueRate ?? 0)));
  current.returnRate = Number(prompt("Return rate %:", String(current.returnRate ?? 0)));
  current.verification = prompt("Verification status:", current.verification || "Pending verification") || "Pending verification";
  adv.supplierDetails[s.id] = current;
  saveAdvancedState(adv);
  renderAll();
}

function setIntegrationAdvanced(kind) {
  if (!canManageEmployees()) return;
  const adv = getAdvancedState();
  const provider = prompt((kind === "pos" ? "POS" : "Payroll") + " provider name:", kind === "pos" ? "Square" : "Gusto");
  if (!provider?.trim()) return;
  if (kind === "pos") {
    adv.integrationSettings.posProvider = provider.trim();
    adv.integrationSettings.posConnected = false;
    adv.onboarding.posConnected = false;
  } else {
    adv.integrationSettings.payrollProvider = provider.trim();
    adv.integrationSettings.payrollConnected = false;
    adv.onboarding.payrollConnected = false;
  }
  saveAdvancedState(adv);
  alert("Provider saved. Real data sync requires that provider's API authorization.");
  renderAll();
}

function markOnboardingAdvanced(key) {
  const adv = getAdvancedState();
  if (Object.prototype.hasOwnProperty.call(adv.onboarding, key)) {
    adv.onboarding[key] = !adv.onboarding[key];
    saveAdvancedState(adv);
    renderAll();
  }
}

function advancedOperationsMarkup() {
  if (!canManageEmployees()) return "";
  const today = advancedTodayRange();
  const week = advancedWeekRange();
  const month = advancedMonthRange();
  const daySnap = advancedFinancialSnapshot(today.start,today.end);
  const weekSnap = advancedFinancialSnapshot(week.start,week.end);
  const monthSnap = advancedFinancialSnapshot(month.start,month.end);
  const adv = getAdvancedState();
  const forecast = forecastNotesAdvanced();
  const staffing = staffingRecommendationAdvanced();
  const advisor = businessAdvisorAdvanced(weekSnap);
  const anomalies = anomalyNotesAdvanced();
  const eventRows = adv.events.slice(0,5).map(e =>
    '<div class="list-row"><div><strong>' + escapeHTML(e.name) + '</strong><small>' +
    escapeHTML(e.venue || "Location TBD") + ' • ' + escapeHTML(e.date) + ' • ' +
    escapeHTML(e.startTime || "Start TBD") + ' — ' + escapeHTML(e.estimatedEndTime || "Estimated end TBD") +
    ' • Source: ' + escapeHTML(e.source || "Manual") + '</small></div><span class="pill">' +
    escapeHTML(String(e.demand || "normal").toUpperCase()) + '</span></div>'
  ).join("");

  const goals = adv.goals.slice(0,5).map(g => {
    const pct = Number(g.target) ? Math.min(100, Math.max(0, Number(g.current||0)/Number(g.target)*100)) : 0;
    return '<div class="list-row"><div><strong>' + escapeHTML(g.name) + '</strong><small>' +
      Number(g.current||0) + ' / ' + Number(g.target||0) + ' • ' + pct.toFixed(0) + '%</small></div></div>';
  }).join("");

  const corrective = adv.correctiveActions.slice(0,5).map(c =>
    '<div class="list-row"><div><strong>' + escapeHTML(c.employee) + '</strong><small>' +
    escapeHTML(c.reason) + ' • ' + escapeHTML(c.outcome) +
    (c.followUp ? ' • Follow-up ' + escapeHTML(c.followUp) : '') + '</small></div></div>'
  ).join("");

  const onboardingKeys = [
    ["businessCreated","Business created"],
    ["posConnected","POS connected"],
    ["payrollConnected","Payroll connected"],
    ["employeesImported","Employees imported"],
    ["settingsReviewed","Key settings reviewed"],
    ["dashboardCustomized","Dashboard customized"],
    ["intelligenceEnabled","Business intelligence enabled"]
  ];

  return `
    <section class="panel" id="advanced-financials" style="border:2px solid rgba(22,119,255,.14);">
      <div class="panel-header">
        <div><div class="eyebrow">BUSINESS SNAPSHOT</div><h2>Daily / Weekly / Monthly Financials</h2>
        <p>Sales vs labor and supply costs. POS data will supersede manual totals when connected.</p></div>
        <button class="outline-button" type="button" onclick="recordDailySalesTotal()">ENTER TODAY'S SALES</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>Today Sales</span><strong>${advancedMoney(daySnap.sales)}</strong><small>Daily sales view</small></div>
        <div class="stat-card"><span>This Week Kept</span><strong>${advancedMoney(weekSnap.kept)}</strong><small>Sales − labor − supplies</small></div>
        <div class="stat-card"><span>This Month Sales</span><strong>${advancedMoney(monthSnap.sales)}</strong><small>Month-to-date</small></div>
        <div class="stat-card"><span>This Month Kept</span><strong>${advancedMoney(monthSnap.kept)}</strong><small>Before taxes / other expenses</small></div>
      </div>
      <div class="dashboard-grid">
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Weekly breakdown</h3>
          <div class="money-lines" style="margin-top:12px;">
            <div><span>Sales</span><strong>${advancedMoney(weekSnap.sales)}</strong></div>
            <div><span>Labor</span><strong>${advancedMoney(weekSnap.labor)}</strong></div>
            <div><span>Supplies</span><strong>${advancedMoney(weekSnap.supplies)}</strong></div>
            <div><span>Money kept</span><strong>${advancedMoney(weekSnap.kept)}</strong></div>
          </div>
        </div>
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Business health</h3>
          <div style="display:grid;gap:7px;margin-top:12px;">${advisor.map(n=>'<div>• '+escapeHTML(n)+'</div>').join("")}</div>
        </div>
      </div>
    </section>

    <section class="panel" id="advanced-inventory">
      <div class="panel-header"><div><div class="eyebrow">INVENTORY</div><h2>Inventory Forecast & Supply Alerts</h2>
      <p>Track purchases, usage, waste, low-stock alerts and estimated remaining usage.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="outline-button" onclick="addInventoryItemAdvanced()">+ ITEM</button><button class="outline-button" onclick="recordInventoryActivityAdvanced()">RECORD ACTIVITY</button></div></div>
      ${inventoryForecastMarkupAdvanced()}
    </section>

    <section class="panel" id="advanced-staffing">
      <div class="panel-header"><div><div class="eyebrow">LABOR PLANNING</div><h2>Demand & Staffing Forecast</h2>
      <p>Compares actual labor with the business target and software baseline.</p></div></div>
      <div class="stats-grid">
        <div class="stat-card"><span>Your labor target</span><strong>${staffing.targetPct.toFixed(0)}%</strong><small>Business-selected goal</small></div>
        <div class="stat-card"><span>Recommended hours</span><strong>${staffing.targetHours.toFixed(1)}</strong><small>Based on recorded sales and target</small></div>
        <div class="stat-card"><span>Hours recorded</span><strong>${staffing.actualHours.toFixed(1)}</strong><small>This week</small></div>
        <div class="stat-card"><span>Suggested adjustment</span><strong>${Math.abs(staffing.delta).toFixed(1)}h</strong><small>${staffing.delta >= 0 ? "More capacity available" : "Above target labor hours"}</small></div>
      </div>
      <div class="notification-card"><strong>Software baseline</strong><p>${adv.forecastSettings.softwareLaborLow}%–${adv.forecastSettings.softwareLaborHigh}% labor-to-sales range. Your target remains separate and under your control.</p></div>
    </section>

    <section class="panel" id="advanced-events">
      <div class="panel-header"><div><div class="eyebrow">SCHEDULING INTELLIGENCE</div><h2>Weather & Nearby Event Planning</h2>
      <p>Admin planning hints only. Never blocks scheduling.</p></div><button class="outline-button" onclick="addPlanningEventAdvanced()">+ PLANNING EVENT</button></div>
      <div class="notification-card"><strong>Connection-ready</strong><p>Real nearby events and weather require approved event/weather data providers. Until connected, manual planning entries are available.</p></div>
      ${eventRows || '<p style="color:#61728c;">No planning events added yet.</p>'}
    </section>

    <section class="panel" id="advanced-intelligence">
      <div class="panel-header"><div><div class="eyebrow">BUSINESS INTELLIGENCE</div><h2>Advisor, Anomalies, Forecasts, Goals & What-If</h2>
      <p>Uses the business's recorded data. Forecasts are estimates, not guarantees.</p></div><button class="outline-button" onclick="runWhatIfAdvanced()">WHAT-IF CALCULATOR</button></div>
      <div class="dashboard-grid">
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Business Advisor</h3><div style="display:grid;gap:7px;margin-top:10px;">${advisor.map(n=>'<div>• '+escapeHTML(n)+'</div>').join("")}</div></div>
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Anomaly Detection</h3><div style="display:grid;gap:7px;margin-top:10px;">${anomalies.map(n=>'<div>• '+escapeHTML(n)+'</div>').join("")}</div></div>
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Forecast</h3><p>${escapeHTML(forecast.text)}</p><span class="pill">Confidence: ${escapeHTML(forecast.confidence)}</span></div>
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Goals</h3>${goals || '<p>No goals yet.</p>'}<button class="outline-button" onclick="addBusinessGoalAdvanced()">+ GOAL</button></div>
      </div>
    </section>

    <section class="panel" id="advanced-employee-actions">
      <div class="panel-header"><div><div class="eyebrow">EMPLOYEE MANAGEMENT</div><h2>Corrective Action Log</h2>
      <p>Document coaching, corrective action, acknowledgment and follow-up.</p></div><button class="outline-button" onclick="addCorrectiveActionAdvanced()">+ CORRECTIVE ACTION</button></div>
      ${corrective || '<p style="color:#61728c;">No corrective actions recorded.</p>'}
    </section>

    <section class="panel" id="advanced-integrations">
      <div class="panel-header"><div><div class="eyebrow">INTEGRATIONS</div><h2>POS & Payroll Connections</h2>
      <p>Keep the customer's current POS/payroll and connect MyService around them.</p></div></div>
      <div class="dashboard-grid">
        <div class="panel" style="box-shadow:none;margin:0;"><h3>POS</h3><p>${escapeHTML(adv.integrationSettings.posProvider || "No provider selected")}</p><span class="pill">${adv.integrationSettings.posConnected ? "CONNECTED" : "AUTHORIZATION REQUIRED"}</span><br><br><button class="outline-button" onclick="setIntegrationAdvanced('pos')">SET POS PROVIDER</button></div>
        <div class="panel" style="box-shadow:none;margin:0;"><h3>Payroll</h3><p>${escapeHTML(adv.integrationSettings.payrollProvider || "No provider selected")}</p><span class="pill">${adv.integrationSettings.payrollConnected ? "CONNECTED" : "AUTHORIZATION REQUIRED"}</span><br><br><button class="outline-button" onclick="setIntegrationAdvanced('payroll')">SET PAYROLL PROVIDER</button></div>
      </div>
      <div class="notification-card"><strong>Security boundary</strong><p>MyService should send only the minimum required approved data (for example approved hours) and should not store bank-account, SSN or payroll-provider secrets in this frontend.</p></div>
    </section>

    <section class="panel" id="advanced-onboarding">
      <div class="panel-header"><div><div class="eyebrow">ONBOARDING</div><h2>Adaptive Business Setup</h2>
      <p>Autosaved checklist. Businesses can skip integrations they do not use.</p></div></div>
      <div style="display:grid;gap:8px;">${onboardingKeys.map(([key,label]) =>
        '<button class="list-row" type="button" onclick="markOnboardingAdvanced(\''+key+'\')" style="width:100%;text-align:left;cursor:pointer;"><div><strong>'+escapeHTML(label)+'</strong><small>Tap to toggle completion</small></div><span class="pill">'+(adv.onboarding[key] ? "DONE" : "PENDING")+'</span></button>'
      ).join("")}</div>
    </section>
  `;
}

function installAdvancedOperationsSuite() {
  const dashboard = $("dashboard");
  if (!dashboard || !canManageEmployees()) {
    $("myservice-advanced-suite")?.remove();
    return;
  }

  let suite = $("myservice-advanced-suite");
  if (!suite) {
    suite = document.createElement("div");
    suite.id = "myservice-advanced-suite";
    dashboard.appendChild(suite);
  }

  if (isDeveloperLogin() && getDeveloperView() === "Developer") {
    suite.hidden = false;
    suite.innerHTML = advancedOperationsMarkup() + `
      <section class="panel" id="advanced-supplier-scorecards">
        <div class="panel-header"><div><div class="eyebrow">DEVELOPER ONLY</div><h2>Supplier Reliability & Service Areas</h2>
        <p>Verification, delivery reliability, damage/issue rates, returns and service area.</p></div>
        <button class="outline-button" onclick="configureSupplierAdvanced()">CONFIGURE LATEST SUPPLIER</button></div>
        ${supplierScorecardsAdvanced()}
      </section>
    `;
    return;
  }

  if (getCurrentUser()?.role === "Admin" || getCurrentUser()?.role === "Manager") {
    suite.hidden = false;
    suite.innerHTML = advancedOperationsMarkup();
    return;
  }

  suite.hidden = true;
}

const originalRenderAllAdvancedSuite = renderAll;
renderAll = function () {
  originalRenderAllAdvancedSuite();
  installAdvancedOperationsSuite();
};


/* =========================================================
   MYSERVICE LIVE API BRIDGE
   Weather is live through NWS immediately.
   Ticketmaster, Square and Gusto become live when their
   provider credentials are added to Supabase Edge secrets.
   ========================================================= */

function getApiBridgeState() {
  const adv = getAdvancedState();
  adv.integrationSettings = adv.integrationSettings || {};
  if (typeof adv.integrationSettings.businessAddress !== "string") adv.integrationSettings.businessAddress = "";
  if (typeof adv.integrationSettings.businessStreet !== "string") adv.integrationSettings.businessStreet = "";
  if (typeof adv.integrationSettings.businessCity !== "string") adv.integrationSettings.businessCity = "";
  if (typeof adv.integrationSettings.businessState !== "string") adv.integrationSettings.businessState = "";
  if (typeof adv.integrationSettings.businessPostalCode !== "string") adv.integrationSettings.businessPostalCode = "";
  if (typeof adv.integrationSettings.businessLat !== "number") adv.integrationSettings.businessLat = null;
  if (typeof adv.integrationSettings.businessLon !== "number") adv.integrationSettings.businessLon = null;
  if (!adv.integrationSettings.apiStatus) adv.integrationSettings.apiStatus = {};
  return adv;
}

async function callMyServiceEdgeFunction(name, body) {
  let token = getStoredAuthItem(ACCESS_TOKEN_KEY);
  if (!token) throw new Error("You must be logged in.");

  async function makeRequest(activeToken) {
    return fetch(
      SUPABASE_URL + "/functions/v1/" + encodeURIComponent(name),
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + activeToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body || {})
      }
    );
  }

  let response = await makeRequest(token);

  if (response.status === 401) {
    const refreshed = await refreshStoredSession().catch(() => null);
    if (refreshed) {
      token = refreshed;
      response = await makeRequest(token);
    }
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "API request failed.");
  }
  return data;
}

let planningAddressSearchTimer = null;
let planningAddressSessionToken = "";
let planningAddressSuggestions = [];

function getPlanningAddressSessionToken() {
  if (!planningAddressSessionToken) {
    planningAddressSessionToken = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "address-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }
  return planningAddressSessionToken;
}

function setPlanningAddressStatus(message, isError = false) {
  const status = $("business-address-status");
  if (!status) return;
  status.textContent = message || "";
  status.style.color = isError ? "#b91c1c" : "#61728c";
}

function renderPlanningAddressSuggestions() {
  const list = $("business-address-suggestions");
  if (!list) return;

  list.innerHTML = planningAddressSuggestions.map((suggestion, index) => `
    <button
      type="button"
      class="outline-button"
      onclick="selectPlanningAddressSuggestion(${index})"
      style="width:100%;text-align:left;justify-content:flex-start;margin-top:8px;white-space:normal;"
    >
      ${escapeHTML(suggestion.fullAddress || suggestion.name || "Address")}
    </button>
  `).join("");
}

function schedulePlanningAddressSearch(value) {
  clearTimeout(planningAddressSearchTimer);
  const query = String(value || "").trim();

  if (query.length < 4) {
    planningAddressSuggestions = [];
    renderPlanningAddressSuggestions();
    setPlanningAddressStatus(query ? "Keep typing to find the full address." : "");
    return;
  }

  setPlanningAddressStatus("Finding nearby addresses…");
  planningAddressSearchTimer = setTimeout(() => searchPlanningAddressesApi(query), 350);
}

async function searchPlanningAddressesApi(query) {
  if (!canManageEmployees()) return;
  try {
    const data = await callMyServiceEdgeFunction("address-search", {
      action: "suggest",
      query,
      sessionToken: getPlanningAddressSessionToken()
    });

    planningAddressSuggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    renderPlanningAddressSuggestions();
    setPlanningAddressStatus(
      planningAddressSuggestions.length
        ? "Select the complete address below."
        : "No matching addresses found. Add the city, state, or ZIP and try again.",
      planningAddressSuggestions.length === 0
    );
  } catch (error) {
    planningAddressSuggestions = [];
    renderPlanningAddressSuggestions();
    setPlanningAddressStatus(error.message || "Address search is unavailable.", true);
  }
}

async function selectPlanningAddressSuggestion(index) {
  if (!canManageEmployees()) return;
  const suggestion = planningAddressSuggestions[index];
  if (!suggestion?.id) return;

  setPlanningAddressStatus("Saving business location…");
  try {
    let location = suggestion.location || null;
    if (!location) {
      const data = await callMyServiceEdgeFunction("address-search", {
        action: "retrieve",
        mapboxId: suggestion.id,
        sessionToken: getPlanningAddressSessionToken()
      });
      location = data.location || {};
    }
    const lat = Number(location.latitude);
    const lon = Number(location.longitude);

    if (!location.fullAddress || !Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new Error("That address did not return a complete location. Choose another suggestion.");
    }

    const adv = getApiBridgeState();
    adv.integrationSettings.businessAddress = location.fullAddress;
    adv.integrationSettings.businessStreet = location.street || "";
    adv.integrationSettings.businessCity = location.city || "";
    adv.integrationSettings.businessState = location.state || "";
    adv.integrationSettings.businessPostalCode = location.postalCode || "";
    adv.integrationSettings.businessLat = lat;
    adv.integrationSettings.businessLon = lon;
    saveAdvancedState(adv);

    planningAddressSuggestions = [];
    planningAddressSessionToken = "";
    renderAll();
    setPlanningAddressStatus("Business location saved.");
  } catch (error) {
    setPlanningAddressStatus(error.message || "The business location could not be saved.", true);
  }
}

async function loadLivePlanningIntelligenceApi() {
  if (!canManageEmployees()) return;

  const adv = getApiBridgeState();
  const lat = adv.integrationSettings.businessLat;
  const lon = adv.integrationSettings.businessLon;

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    alert("Set the business planning location first.");
    return;
  }

  const button = $("load-live-planning-api");
  if (button) {
    button.disabled = true;
    button.textContent = "LOADING…";
  }

  try {
    const data = await callMyServiceEdgeFunction("planning-intelligence", {
      lat,
      lon,
      radiusMiles: Number(adv.forecastSettings?.eventRadiusMiles || 15),
      startDateTime: new Date().toISOString()
    });

    adv.integrationSettings.lastPlanningApiResult = data;
    adv.integrationSettings.lastPlanningApiAt = new Date().toISOString();
    saveAdvancedState(adv);
    renderAll();
  } catch (error) {
    alert(error.message || "Could not load live planning data.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "LOAD LIVE WEATHER / EVENTS";
    }
  }
}

async function refreshIntegrationApiStatus() {
  if (!canManageEmployees()) return;

  try {
    const data = await callMyServiceEdgeFunction("integration-broker", {
      action: "status"
    });

    const adv = getApiBridgeState();
    adv.integrationSettings.apiStatus = data;
    adv.integrationSettings.apiStatusCheckedAt = new Date().toISOString();
    saveAdvancedState(adv);
    renderAll();
  } catch (error) {
    alert(error.message || "Could not check API status.");
  }
}

async function beginProviderOAuth(provider) {
  if (!canManageEmployees()) return;

  try {
    const data = await callMyServiceEdgeFunction("integration-broker", {
      action: "authorize_url",
      provider
    });

    if (!data?.url) {
      alert("No authorization URL was returned.");
      return;
    }

    sessionStorage.setItem("myservice_oauth_provider", provider);
    sessionStorage.setItem("myservice_oauth_state", data.state || "");
    location.href = data.url;
  } catch (error) {
    alert(
      (error.message || "Provider connection is not configured.") +
      "\n\nAdd that provider's developer credentials to Supabase Edge Function secrets first."
    );
  }
}

function formatApiPlanningResult() {
  const adv = getApiBridgeState();
  const data = adv.integrationSettings.lastPlanningApiResult;
  if (!data) {
    return '<div class="notification-card"><strong>No live planning data loaded yet</strong><p>Set the business location, then load live weather and event data.</p></div>';
  }

  const w = data.weather;
  const events = Array.isArray(data.events) ? data.events : [];
  const demand = data.demandHint || { level: "normal", reasons: [] };

  const weatherMarkup = w
    ? '<div class="list-row"><div><strong>' +
      escapeHTML(w.shortForecast || "Weather") +
      '</strong><small>' +
      escapeHTML(String(w.temperature ?? "—")) + '°' +
      escapeHTML(w.temperatureUnit || "F") +
      ' • Rain ' + escapeHTML(String(w.precipitationProbability ?? "—")) +
      '% • ' + escapeHTML(w.windSpeed || "") +
      ' • Source: National Weather Service</small></div><span class="pill">' +
      escapeHTML(String(demand.level || "normal").toUpperCase()) +
      '</span></div>'
    : '<div class="notification-card"><strong>Weather unavailable</strong><p>The National Weather Service feed did not return a forecast for this request.</p></div>';

  const eventMarkup = events.length
    ? events.slice(0, 10).map(event => {
        const start = event.startTime
          ? new Date(event.startTime).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})
          : "Start TBD";
        const end = event.estimatedEndTime
          ? new Date(event.estimatedEndTime).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})
          : "Estimated end TBD";
        return '<div class="list-row"><div><strong>' +
          escapeHTML(event.name || "Event") +
          '</strong><small>' +
          escapeHTML(event.venue || "") +
          (event.city ? ' • ' + escapeHTML(event.city) : '') +
          ' • ' + escapeHTML(start) + ' — ' + escapeHTML(end) +
          (event.endTimeIsEstimate ? ' • Estimated end time' : '') +
          ' • Source: ' + escapeHTML(event.source || "Event provider") +
          '</small></div></div>';
      }).join("")
    : '<div class="notification-card"><strong>No live events returned</strong><p>' +
      (data.sourceStatus?.events === "not_configured"
        ? "Ticketmaster API key has not been added yet. Weather is still live."
        : "No nearby events were returned for this search window.") +
      '</p></div>';

  return weatherMarkup + eventMarkup;
}

function integrationApiStatusMarkup() {
  const adv = getApiBridgeState();
  const status = adv.integrationSettings.apiStatus || {};

  const item = (name, configured, detail) =>
    '<div class="list-row"><div><strong>' + escapeHTML(name) +
    '</strong><small>' + escapeHTML(detail) +
    '</small></div><span class="pill" style="' +
    (configured
      ? 'background:#ecfdf5;color:#166534;'
      : 'background:#fff7ed;color:#9a3412;') +
    '">' + (configured ? "READY" : "NEEDS CREDENTIALS") + '</span></div>';

  return [
    item("Ticketmaster Events", status.ticketmaster?.configured === true, "Nearby public events"),
    item("Square POS", status.square?.configured === true, "Sales / order data via OAuth"),
    item("Gusto Payroll", status.gusto?.configured === true, "Payroll integration via OAuth")
  ].join("");
}

function installLiveApiBridge() {
  const dashboard = $("dashboard");
  if (!dashboard || !canManageEmployees()) return;

  let apiPanel = $("myservice-live-api-panel");
  if (!apiPanel) {
    apiPanel = document.createElement("section");
    apiPanel.id = "myservice-live-api-panel";
    apiPanel.className = "panel";
    dashboard.appendChild(apiPanel);
  }

  const adv = getApiBridgeState();
  const last = adv.integrationSettings.lastPlanningApiAt
    ? new Date(adv.integrationSettings.lastPlanningApiAt).toLocaleString()
    : "Never";

  apiPanel.innerHTML = `
    <div class="panel-header">
      <div>
        <div class="eyebrow">LIVE API CONNECTIONS</div>
        <h2>Weather, Events, POS & Payroll</h2>
        <p>Secure server-side API bridge through Supabase Edge Functions.</p>
      </div>
      <button class="outline-button" type="button" onclick="refreshIntegrationApiStatus()">CHECK API STATUS</button>
    </div>

    <div class="dashboard-grid">
      <div class="panel" style="box-shadow:none;margin:0;">
        <h3>Scheduling Intelligence API</h3>
        <p>Start typing the physical business address. MyService will suggest complete nearby addresses and use the selected location in the background for weather and events.</p>
        <label for="business-address-search" style="display:block;font-weight:750;margin-bottom:6px;">Business address</label>
        <input
          id="business-address-search"
          type="text"
          autocomplete="street-address"
          placeholder="Start typing a street address"
          value="${escapeHTML(adv.integrationSettings.businessAddress || "")}"
          oninput="schedulePlanningAddressSearch(this.value)"
          style="width:100%;min-height:50px;padding:12px 14px;border:1px solid #d6dfeb;border-radius:12px;font:inherit;"
        >
        <div id="business-address-suggestions" style="display:grid;"></div>
        <small id="business-address-status" style="display:block;min-height:20px;margin-top:7px;color:#61728c;"></small>
        <small style="display:block;color:#8a98aa;">Address results may use Mapbox or OpenStreetMap data.</small>

        ${adv.integrationSettings.businessAddress ? `
          <div class="list-row" style="margin:8px 0 12px;align-items:flex-start;">
            <div>
              <strong>Saved business location</strong>
              <small>${escapeHTML(adv.integrationSettings.businessStreet || adv.integrationSettings.businessAddress)}</small>
              <small>${escapeHTML([
                adv.integrationSettings.businessCity,
                adv.integrationSettings.businessState,
                adv.integrationSettings.businessPostalCode
              ].filter(Boolean).join(", "))}</small>
            </div>
            <span class="pill" style="background:#ecfdf5;color:#166534;">READY</span>
          </div>
        ` : ""}

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <button id="load-live-planning-api" class="primary-button" type="button" onclick="loadLivePlanningIntelligenceApi()">LOAD LIVE WEATHER / EVENTS</button>
        </div>
        <small style="display:block;margin-top:10px;color:#7b8aa0;">Last updated: ${escapeHTML(last)}</small>
      </div>

      <div class="panel" style="box-shadow:none;margin:0;">
        <h3>Business Integrations</h3>
        <p>Connect existing systems instead of replacing them.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="outline-button" type="button" onclick="beginProviderOAuth('square')">CONNECT SQUARE</button>
          <button class="outline-button" type="button" onclick="beginProviderOAuth('gusto')">CONNECT GUSTO</button>
        </div>
      </div>
    </div>

    <div style="margin-top:16px;">
      <h3 style="margin-bottom:10px;">Live planning result</h3>
      ${formatApiPlanningResult()}
    </div>

    <div style="margin-top:16px;">
      <h3 style="margin-bottom:10px;">Provider readiness</h3>
      ${integrationApiStatusMarkup()}
    </div>
  `;
}

const originalRenderAllLiveApiBridge = renderAll;
renderAll = function () {
  originalRenderAllLiveApiBridge();
  installLiveApiBridge();
};


/* =========================================================
   MYSERVICE PRINTING AND LABELS
   Browser-print foundation for office/receipt/label printers.
   Dedicated printer SDK/local bridge can be added later for
   direct thermal-printer control.
   ========================================================= */

const MYSERVICE_PRINTING_KEY = "myservice_printing_labels_v1";

function getPrintingState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MYSERVICE_PRINTING_KEY) || "{}");
    return {
      defaultPrinterName: parsed.defaultPrinterName || "",
      defaultLabelSize: parsed.defaultLabelSize || "2x1",
      templates: Array.isArray(parsed.templates) ? parsed.templates : [
        {
          id: "inventory",
          name: "Inventory Label",
          fields: ["item","date","employee","barcode"]
        },
        {
          id: "prep",
          name: "Prep / Date Label",
          fields: ["item","prepared","expires","employee"]
        },
        {
          id: "job",
          name: "Order / Job Label",
          fields: ["job","customer","date","qr"]
        }
      ]
    };
  } catch {
    return { defaultPrinterName:"", defaultLabelSize:"2x1", templates:[] };
  }
}

function savePrintingState(value) {
  localStorage.setItem(MYSERVICE_PRINTING_KEY, JSON.stringify(value));
}

function configurePrinterAdvanced() {
  if (!canManageEmployees()) return;
  const ps = getPrintingState();
  const printer = prompt("Default printer / label machine name:", ps.defaultPrinterName || "");
  if (printer === null) return;
  const size = prompt("Default label size (example 2x1, 4x2, Letter):", ps.defaultLabelSize || "2x1");
  if (size === null) return;
  ps.defaultPrinterName = printer.trim();
  ps.defaultLabelSize = size.trim() || "2x1";
  savePrintingState(ps);
  renderAll();
}

function createLabelTemplateAdvanced() {
  if (!canManageEmployees()) return;
  const ps = getPrintingState();
  const name = prompt("Template name:");
  if (!name?.trim()) return;
  const fieldsRaw = prompt("Fields separated by commas (example: item,date,expires,employee,barcode):", "item,date,employee");
  if (fieldsRaw === null) return;
  ps.templates.push({
    id: uid("labeltemplate"),
    name: name.trim(),
    fields: fieldsRaw.split(",").map(x => x.trim()).filter(Boolean)
  });
  savePrintingState(ps);
  renderAll();
}

function printLabelAdvanced(templateId) {
  if (!canManageEmployees()) return;
  const ps = getPrintingState();
  const template = ps.templates.find(t => t.id === templateId) || ps.templates[0];
  if (!template) {
    alert("Create a label template first.");
    return;
  }

  const values = {};
  for (const field of template.fields) {
    const value = prompt("Value for " + field + ":", "");
    if (value === null) return;
    values[field] = value;
  }

  const rows = template.fields.map(field => {
    const val = escapeHTML(String(values[field] || ""));
    if (field.toLowerCase().includes("barcode")) {
      return '<div style="font-family:monospace;font-size:18px;letter-spacing:2px;margin-top:8px;">' + val + '</div>';
    }
    if (field.toLowerCase().includes("qr")) {
      return '<div style="border:2px solid #111;padding:8px;margin-top:8px;font-size:12px;">QR DATA: ' + val + '</div>';
    }
    return '<div style="margin:4px 0;"><strong>' + escapeHTML(field) + ':</strong> ' + val + '</div>';
  }).join("");

  const win = window.open("", "_blank", "width=500,height=500");
  if (!win) {
    alert("Allow pop-ups to print labels.");
    return;
  }

  win.document.write(
    '<!doctype html><html><head><title>' + escapeHTML(template.name) + '</title>' +
    '<style>@page{margin:6mm;}body{font-family:Arial,sans-serif;margin:0;padding:12px;color:#111}.label{border:1px solid #111;padding:12px;max-width:360px}h2{margin:0 0 8px;font-size:18px}</style>' +
    '</head><body><div class="label"><h2>' + escapeHTML(template.name) + '</h2>' + rows +
    '<div style="margin-top:10px;font-size:10px;color:#555;">Printed from MyService</div></div>' +
    '<script>window.onload=function(){window.print();};<\/script></body></html>'
  );
  win.document.close();
}

function printingLabelsMarkup() {
  const ps = getPrintingState();
  return `
    <section class="panel" id="printing-labels-panel">
      <div class="panel-header">
        <div>
          <div class="eyebrow">PRINTING & LABELS</div>
          <h2>Printers, Sticker Machines & Label Templates</h2>
          <p>Print inventory, prep/date, order/job, barcode and QR-code labels.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="outline-button" type="button" onclick="configurePrinterAdvanced()">PRINTER SETTINGS</button>
          <button class="outline-button" type="button" onclick="createLabelTemplateAdvanced()">+ TEMPLATE</button>
        </div>
      </div>

      <div class="notification-card">
        <strong>Default printer</strong>
        <p>${escapeHTML(ps.defaultPrinterName || "Uses the device/browser print dialog")} • Label size: ${escapeHTML(ps.defaultLabelSize || "2x1")}</p>
      </div>

      <div style="display:grid;gap:8px;">
        ${ps.templates.map(t => `
          <div class="list-row">
            <div>
              <strong>${escapeHTML(t.name)}</strong>
              <small>${t.fields.map(escapeHTML).join(" • ")}</small>
            </div>
            <button class="outline-button" type="button" onclick="printLabelAdvanced('${String(t.id).replace(/'/g,"\\'")}')">PRINT</button>
          </div>
        `).join("")}
      </div>

      <div class="notification-card" style="margin-top:14px;">
        <strong>Direct thermal-printer control</strong>
        <p>Browser printing works now. Zebra, Brother, DYMO and similar printers can later use a vendor SDK or local print bridge for one-tap printing without the browser dialog.</p>
      </div>
    </section>
  `;
}

function installPrintingLabelsSuite() {
  const dashboard = $("dashboard");
  if (!dashboard || !canManageEmployees()) {
    $("printing-labels-suite")?.remove();
    return;
  }

  let wrap = $("printing-labels-suite");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "printing-labels-suite";
    dashboard.appendChild(wrap);
  }
  wrap.innerHTML = printingLabelsMarkup();
}

const originalRenderAllPrintingSuite = renderAll;
renderAll = function () {
  originalRenderAllPrintingSuite();
  installPrintingLabelsSuite();
};


/* =========================================================
   MYSERVICE OAUTH CALLBACK HANDLER
   Completes Square/Gusto OAuth without exposing tokens.
   ========================================================= */

async function completeMyServiceOAuthCallback() {
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const returnedState = params.get("state");
  if (!code) return;

  const provider = sessionStorage.getItem("myservice_oauth_provider") || "";
  const expectedState = sessionStorage.getItem("myservice_oauth_state") || "";

  if (!provider) return;

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    alert("Connection could not be completed because the security state did not match. Please try connecting again.");
    history.replaceState({}, document.title, location.pathname);
    sessionStorage.removeItem("myservice_oauth_provider");
    sessionStorage.removeItem("myservice_oauth_state");
    return;
  }

  try {
    const data = await callMyServiceEdgeFunction("integration-broker", {
      action: "exchange_code",
      provider,
      code
    });

    if (data?.connected) {
      const adv = getAdvancedState();
      adv.integrationSettings = adv.integrationSettings || {};
      if (provider === "square") {
        adv.integrationSettings.posProvider = "Square";
        adv.integrationSettings.posConnected = true;
        adv.onboarding.posConnected = true;
      }
      if (provider === "gusto") {
        adv.integrationSettings.payrollProvider = "Gusto";
        adv.integrationSettings.payrollConnected = true;
        adv.onboarding.payrollConnected = true;
      }
      saveAdvancedState(adv);
      alert((provider === "square" ? "Square" : "Gusto") + " connected successfully.");
    }
  } catch (error) {
    alert(error.message || "Could not complete provider connection.");
  } finally {
    sessionStorage.removeItem("myservice_oauth_provider");
    sessionStorage.removeItem("myservice_oauth_state");
    history.replaceState({}, document.title, location.pathname);
    renderAll();
  }
}

const originalRenderAllOAuthCallback = renderAll;
let myServiceOAuthCallbackHandled = false;
renderAll = function () {
  originalRenderAllOAuthCallback();
  if (!myServiceOAuthCallbackHandled) {
    myServiceOAuthCallbackHandled = true;
    setTimeout(() => completeMyServiceOAuthCallback(), 0);
  }
};



/* =========================================================
   MYSERVICE — DEVELOPER AI CHAT
   Developer-only AI copilot. AI analysis never directly mutates
   company data or security-sensitive state.
   ========================================================= */

const DEVELOPER_AI_CHAT_KEY = "myservice_developer_ai_chat_v1";

function getDeveloperAIHistory() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(DEVELOPER_AI_CHAT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-20) : [];
  } catch (_) {
    return [];
  }
}

function saveDeveloperAIHistory(messages) {
  sessionStorage.setItem(DEVELOPER_AI_CHAT_KEY, JSON.stringify((messages || []).slice(-20)));
}

function developerAIIsAllowed() {
  // Developer AI is intentionally platform-owner only. Never infer authorization
  // from visible UI or preview state; require the authenticated database role.
  const dbDeveloper =
    String(authenticatedContext?.databaseRole || "").toLowerCase() === "developer";
  const activeDeveloperSession =
    Boolean(authenticatedContext?.id) &&
    authenticatedContext?.active !== false;
  return dbDeveloper && activeDeveloperSession;
}

function renderDeveloperAIChat() {
  const box = $("developer-ai-messages");
  if (!box) return;

  const messages = getDeveloperAIHistory();
  if (!messages.length) {
    box.innerHTML = `
      <div style="padding:9px 13px;border-radius:18px;background:#ffffff;border:1px solid #dbe4f0;color:#34445f;">
        Ask about staffing, scheduling, support tickets, operations, inventory, labor, sales, or MyService troubleshooting.
      </div>
    `;
    return;
  }

  box.innerHTML = messages.map(message => {
    const mine = message.role === "user";
    return `
      <div style="padding:9px 13px;border-radius:18px;white-space:pre-wrap;line-height:1.4;width:100%;box-sizing:border-box;
        ${mine ? "background:#1677f2;color:#ffffff;" : "background:#ffffff;color:#24364d;border:1px solid #dbe4f0;"}">
        <strong style="display:block;margin-bottom:3px;">${mine ? "You" : "Developer AI"}</strong>
        ${escapeHTML(message.content)}
      </div>
    `;
  }).join("");

  box.scrollTop = box.scrollHeight;
}


document.addEventListener("click", event => {
  const button = event.target?.closest?.("#developer-ai-nav");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  openDeveloperAI();
}, true);

function openDeveloperAI() {
  if (!developerAIIsAllowed()) {
    alert("Developer AI is available only to the platform developer account.");
    return false;
  }

  if (typeof getDeveloperView === "function" && getDeveloperView() !== "Developer") {
    switchDeveloperView("Developer");
  }

  // Developer AI lives inside the dashboard/command center.
  // Always activate that page first so the card is actually visible.
  if ($("dashboard")) {
    showSection("dashboard");
  }

  setTimeout(() => {
    // renderAll/showSection may have rebuilt the command center, so resolve
    // the elements only after the dashboard is active.
    const card = $("developer-ai-card");
    if (card) {
      card.style.pointerEvents = "auto";
      card.style.position = "relative";
      card.style.zIndex = "5";
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const input = $("developer-ai-input");
    if (input) {
      input.disabled = false;
      input.readOnly = false;
      input.style.pointerEvents = "auto";
    }

    const send = $("developer-ai-send");
    if (send) send.style.pointerEvents = "auto";

    renderDeveloperAIChat();
    renderDeveloperAICodePushState();
    setTimeout(() => $("developer-ai-input")?.focus(), 120);
  }, 120);

  return false;
}

function clearDeveloperAIChat() {
  if (!developerAIIsAllowed()) return;
  sessionStorage.removeItem(DEVELOPER_AI_CHAT_KEY);
  renderDeveloperAIChat();
  const status = $("developer-ai-status");
  if (status) status.textContent = "Chat cleared. Developer-only.";
}

function getDeveloperAISafeContext() {
  const employees = Array.isArray(state.employees) ? state.employees : [];
  const jobs = Array.isArray(state.jobs) ? state.jobs : [];
  const tickets = Array.isArray(state.supportTickets) ? state.supportTickets : [];
  const schedule = Array.isArray(state.schedule) ? state.schedule : [];

  return {
    app: "MyService",
    companyName: String(state.companyName || authenticatedContext?.companyName || "Unknown"),
    developerView: typeof getDeveloperView === "function" ? getDeveloperView() : "Developer",
    counts: {
      employees: employees.length,
      activeEmployees: employees.filter(employee => employee.active !== false).length,
      openJobs: jobs.filter(job => String(job.status || "").toLowerCase() !== "completed").length,
      scheduleEntries: schedule.length,
      openSupportTickets: tickets.filter(ticket => String(ticket.status || "").toLowerCase() === "open").length
    },
    note: "Only summary counts are automatically supplied. No passwords, PINs, access tokens, or ticket descriptions are sent automatically. In voice calls, respond naturally and conversationally, with short spoken sentences and minimal formatting."
  };
}



const DEVELOPER_AI_CODE_PUSH_KEY = "myservice_developer_ai_code_push_session";

function developerAICodePushEnabled() {
  return sessionStorage.getItem(DEVELOPER_AI_CODE_PUSH_KEY) === "1";
}

function renderDeveloperAICodePushState() {
  const button = $("developer-ai-code-push");
  if (!button) return;
  const enabled = developerAICodePushEnabled();
  button.textContent = enabled ? "CODE PUSH: ON" : "CODE PUSH: OFF";
  button.style.borderColor = enabled ? "#1677f2" : "";
  button.style.background = enabled ? "#eaf3ff" : "";
  button.style.color = enabled ? "#0f5fc7" : "";
}

function toggleDeveloperAICodePush() {
  if (!developerAIIsAllowed()) return;

  if (developerAICodePushEnabled()) {
    sessionStorage.removeItem(DEVELOPER_AI_CODE_PUSH_KEY);
    renderDeveloperAICodePushState();
    const status = $("developer-ai-status");
    if (status) status.textContent = "Code push permission is OFF for this session.";
    return;
  }

  const ok = window.confirm(
    "Allow Developer AI to push approved MyService code during this session?\n\n" +
    "You will still have to explicitly confirm each code push. Sensitive changes remain blocked."
  );

  if (!ok) return;

  sessionStorage.setItem(DEVELOPER_AI_CODE_PUSH_KEY, "1");
  renderDeveloperAICodePushState();
  const status = $("developer-ai-status");
  if (status) status.textContent = "Code push permission is ON for this session. Each push still requires confirmation.";
}

let developerAICallMode = false;
let developerAIRecognition = null;
let developerAIAudio = null;
let developerAISpeaking = false;
let developerAIAudioContext = null;
let developerAIAudioSource = null;
let developerAIListenTimer = null;
let developerAIRealtimePc = null;
let developerAIRealtimeStream = null;
let developerAIRealtimeAudio = null;
let developerAIRealtimeChannel = null;
let developerAISpeechBuffer = "";
let developerAISpeechDebounce = null;
let developerAIPendingVoiceReply = null;
let developerAIUserIsSpeaking = false;
let developerAIFreeCallMode = false;
let developerAISpeakerMode = true;
let developerAISpeechUtterance = null;
let developerAIFreeRequestBusy = false;
let developerAILastSpokenReply = "";
let developerAIPendingWebsiteChange = "";
let developerAIQuietMode = false;
const DEVELOPER_AI_RESUME_PHRASES = ["developer ai", "hey developer", "hey ai", "myservice ai"];

function developerAIAddressed(text) {
  const value = String(text || "").toLowerCase().trim();
  return DEVELOPER_AI_RESUME_PHRASES.some(phrase => value.includes(phrase));
}

function setDeveloperAIQuietMode(enabled, reason = "") {
  developerAIQuietMode = Boolean(enabled);
  developerAISpeechBuffer = "";
  if (developerAISpeechDebounce) clearTimeout(developerAISpeechDebounce);
  developerAISpeechDebounce = null;
  stopDeveloperAIAudio();
  try { window.speechSynthesis?.cancel?.(); } catch (_) {}

  // In realtime WebRTC mode, actually mute the outgoing microphone track.
  // This prevents customer/coworker audio from being sent upstream while HOLD UP is active.
  try {
    developerAIRealtimeStream?.getAudioTracks?.().forEach(track => {
      track.enabled = !developerAIQuietMode;
    });
  } catch (_) {}

  const quietButton = $("developer-ai-call-quiet");
  if (quietButton) {
    quietButton.textContent = developerAIQuietMode ? "RESUME AI" : "HOLD UP";
    quietButton.style.background = developerAIQuietMode ? "white" : "rgba(255,255,255,.16)";
    quietButton.style.color = developerAIQuietMode ? "#0f5fc7" : "white";
  }

  const realtimeActive = Boolean(developerAIRealtimePc && developerAIRealtimeStream);
  updateDeveloperAICallWindow(
    developerAIQuietMode ? "Quiet mode" : "Listening…",
    developerAIQuietMode
      ? (realtimeActive
          ? "Microphone muted to Developer AI. Tap RESUME AI when you’re ready."
          : "Customer/coworker conversation is ignored. Say “Developer AI” or tap RESUME AI.")
      : (reason || "Talk naturally — I’ll wait for you to finish.")
  );
}

function setDeveloperAICallScrollSafe() {
  document.documentElement.style.overflowY = "auto";
  document.documentElement.style.touchAction = "pan-y";
  document.body.style.overflowY = "auto";
  document.body.style.touchAction = "pan-y";
  document.body.style.webkitOverflowScrolling = "touch";

  const card = $("developer-ai-card");
  if (card) {
    card.style.touchAction = "pan-y";
    card.style.overflow = "visible";
  }
}

function unlockDeveloperAIAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!developerAIAudioContext) developerAIAudioContext = new AudioCtx();
    if (developerAIAudioContext.state === "suspended") {
      developerAIAudioContext.resume().catch(() => {});
    }

    // Play a nearly silent buffer during the user's CALL tap so iOS grants
    // audio playback permission for the later AI response.
    const buffer = developerAIAudioContext.createBuffer(1, 1, 22050);
    const source = developerAIAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(developerAIAudioContext.destination);
    source.start(0);
  } catch (_) {}
}

function pauseDeveloperAIForUserSpeech() {
  if (!developerAISpeaking) return;

  developerAIUserIsSpeaking = true;

  try {
    if (developerAIAudio && !developerAIAudio.paused) developerAIAudio.pause();
  } catch (_) {}

  try {
    if (developerAIAudioSource) developerAIAudioSource.stop();
  } catch (_) {}

  developerAIAudioSource = null;
  developerAISpeaking = false;

  updateDeveloperAICallWindow("Listening…", "I stopped so you can finish.");
  const status = $("developer-ai-status");
  if (status) status.textContent = "Developer AI paused — listening to you.";
}

function resumePendingDeveloperAIVoiceReply() {
  if (!developerAIPendingVoiceReply || developerAIUserIsSpeaking || !developerAICallMode) return;

  const pending = developerAIPendingVoiceReply;
  developerAIPendingVoiceReply = null;
  playDeveloperAIAudio(pending.audioBase64, pending.mimeType || "audio/mpeg");
}

function queueDeveloperAIUserSpeech(transcript) {
  const text = String(transcript || "").trim();
  if (!text) return;

  const lower = text.toLowerCase();
  if (lower === "hold up" || lower.startsWith("hold up ") || lower.includes(" hold up")) {
    setDeveloperAIQuietMode(true);
    return;
  }

  if (developerAIQuietMode) {
    if (!developerAIAddressed(text)) return;
    setDeveloperAIQuietMode(false, "I’m back with you.");
  }

  developerAISpeechBuffer = [developerAISpeechBuffer, text].filter(Boolean).join(" ").trim();
  developerAIUserIsSpeaking = true;
  pauseDeveloperAIForUserSpeech();

  updateDeveloperAICallWindow("Listening…", developerAISpeechBuffer);

  if (developerAISpeechDebounce) clearTimeout(developerAISpeechDebounce);

  developerAISpeechDebounce = setTimeout(async () => {
    const message = developerAISpeechBuffer.trim();
    developerAISpeechBuffer = "";
    developerAIUserIsSpeaking = false;

    if (!message || !developerAICallMode) {
      resumePendingDeveloperAIVoiceReply();
      return;
    }

    const input = $("developer-ai-input");
    if (input) input.value = message;

    updateDeveloperAICallWindow("Thinking…", message);
    const status = $("developer-ai-status");
    if (status) status.textContent = "Heard you — working on it…";

    if (developerAIFreeCallMode) {
      await answerDeveloperAIFreeCall(message);
    } else {
      await sendDeveloperAIMessage();
    }
  }, 2400);
}

function stopDeveloperAIAudio() {
  try {
    developerAIAudio?.pause?.();
    if (developerAIAudio) developerAIAudio.src = "";
  } catch (_) {}
  developerAIAudio = null;

  try { developerAIAudioSource?.stop?.(); } catch (_) {}
  developerAIAudioSource = null;
  developerAISpeaking = false;
}

function stopDeveloperAICall() {
  developerAICallMode = false;

  if (developerAIListenTimer) clearTimeout(developerAIListenTimer);
  developerAIListenTimer = null;

  try { developerAIRecognition?.abort?.(); } catch (_) {}
  try { developerAIRecognition?.stop?.(); } catch (_) {}
  developerAIRecognition = null;

  try { developerAIRealtimeChannel?.close?.(); } catch (_) {}
  developerAIRealtimeChannel = null;

  try { developerAIRealtimePc?.close?.(); } catch (_) {}
  developerAIRealtimePc = null;

  try {
    developerAIRealtimeStream?.getTracks?.().forEach(track => track.stop());
  } catch (_) {}
  developerAIRealtimeStream = null;

  try {
    if (developerAIRealtimeAudio) {
      developerAIRealtimeAudio.pause();
      developerAIRealtimeAudio.srcObject = null;
      developerAIRealtimeAudio.remove();
    }
  } catch (_) {}
  developerAIRealtimeAudio = null;

  if (developerAISpeechDebounce) clearTimeout(developerAISpeechDebounce);
  developerAISpeechDebounce = null;
  developerAISpeechBuffer = "";
  developerAIUserIsSpeaking = false;
  developerAIPendingVoiceReply = null;
  developerAIFreeCallMode = false;
  developerAIQuietMode = false;

  try { window.speechSynthesis?.cancel?.(); } catch (_) {}
  developerAISpeechUtterance = null;

  stopDeveloperAIAudio();
  setDeveloperAICallScrollSafe();

  $("developer-ai-call-window")?.remove();

  const button = $("developer-ai-call");
  const status = $("developer-ai-status");
  if (button) {
    button.textContent = "☎ CALL";
    button.disabled = false;
  }
  if (status) status.textContent = "Developer AI call ended.";
}
function restartDeveloperAIListening(delay = 350) {
  if (!developerAICallMode || !developerAIRecognition || developerAIFreeRequestBusy || developerAISpeaking) return;
  if (developerAIListenTimer) clearTimeout(developerAIListenTimer);

  developerAIListenTimer = setTimeout(() => {
    if (!developerAICallMode || !developerAIRecognition) return;
    try { developerAIRecognition.start(); } catch (_) {}
  }, delay);
}

async function playDeveloperAIWebAudio(base64) {
  if (!developerAIAudioContext || !base64) throw new Error("Web Audio unavailable.");

  if (developerAIAudioContext.state === "suspended") {
    await developerAIAudioContext.resume();
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const decoded = await developerAIAudioContext.decodeAudioData(bytes.buffer.slice(0));
  const source = developerAIAudioContext.createBufferSource();
  developerAIAudioSource = source;
  source.buffer = decoded;
  source.connect(developerAIAudioContext.destination);

  source.onended = () => {
    if (developerAIAudioSource !== source) return;
    developerAIAudioSource = null;
    developerAISpeaking = false;
    const status = $("developer-ai-status");
    if (developerAICallMode && status) status.textContent = "Call mode active — listening…";
    restartDeveloperAIListening(250);
  };

  source.start(0);
}

function playDeveloperAIAudio(base64, mimeType = "audio/mpeg") {
  if (developerAIUserIsSpeaking) {
    developerAIPendingVoiceReply = { audioBase64: base64, mimeType };
    updateDeveloperAICallWindow("Listening…", "Reply is ready. I’ll wait until you finish.");
    return;
  }

  if (!base64) {
    developerAISpeaking = false;
    restartDeveloperAIListening();
    return;
  }

  developerAISpeaking = true;
  setDeveloperAICallScrollSafe();

  const status = $("developer-ai-status");
  if (status) status.textContent = "Developer AI is speaking…";
  updateDeveloperAICallWindow("Speaking…", "Developer AI");

  // Web Audio is preferred on iPhone because CALL unlocks its audio context.
  playDeveloperAIWebAudio(base64).catch(() => {
    try {
      developerAIAudio = new Audio("data:" + mimeType + ";base64," + base64);
      developerAIAudio.playsInline = true;
      developerAIAudio.volume = 1;

      developerAIAudio.onended = () => {
        developerAISpeaking = false;
        if (developerAICallMode && status) status.textContent = "Call mode active — listening…";
        restartDeveloperAIListening(250);
      };

      developerAIAudio.onerror = () => {
        developerAISpeaking = false;
        if (status) status.textContent = "Voice playback failed. AI reply is still shown in chat.";
        restartDeveloperAIListening(250);
      };

      developerAIAudio.play().catch(() => {
        developerAISpeaking = false;
        if (status) status.textContent = "Tap CALL once to re-enable iPhone audio, then try again.";
        restartDeveloperAIListening(250);
      });
    } catch (_) {
      developerAISpeaking = false;
      restartDeveloperAIListening(250);
    }
  });
}

function getDeveloperAINetworkQuality() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = String(connection?.effectiveType || "");
  const saveData = connection?.saveData === true;
  const downlink = Number(connection?.downlink || 0);

  if (saveData) return "poor";
  if (effectiveType === "slow-2g" || effectiveType === "2g") return "poor";
  if (effectiveType === "3g" || (downlink > 0 && downlink < 1.5)) return "fair";
  return "good";
}

function developerAIVoiceModeForNetwork() {
  const quality = getDeveloperAINetworkQuality();
  return {
    quality,
    compact: quality !== "good",
    maxReplyChars: quality === "poor" ? 600 : quality === "fair" ? 1000 : 1800
  };
}

function openDeveloperAICallWindow() {
  if ($("developer-ai-call-window")) return;

  const wrap = document.createElement("div");
  wrap.id = "developer-ai-call-window";
  wrap.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483646",
    "background:linear-gradient(180deg,#0f5fc7,#1677f2)",
    "color:white",
    "display:flex",
    "flex-direction:column",
    "padding:max(18px,env(safe-area-inset-top)) 18px max(18px,env(safe-area-inset-bottom))",
    "box-sizing:border-box",
    "overflow:auto",
    "-webkit-overflow-scrolling:touch"
  ].join(";");

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <div>
        <div style="font-size:12px;font-weight:850;letter-spacing:1.2px;opacity:.8;">MYSERVICE</div>
        <div style="font-size:24px;font-weight:900;">Developer AI Call</div>
      </div>
      <button id="developer-ai-call-close" type="button"
        style="border:0;background:rgba(255,255,255,.14);color:white;width:42px;height:42px;border-radius:50%;font-size:22px;">×</button>
    </div>

    <div style="flex:1;display:flex;align-items:center;justify-content:center;min-height:320px;text-align:center;">
      <div>
        <div style="width:112px;height:112px;margin:0 auto 18px;border-radius:50%;background:white;color:#1677f2;display:grid;place-items:center;font-size:42px;font-weight:900;box-shadow:0 18px 40px rgba(0,0,0,.18);">AI</div>
        <div id="developer-ai-call-window-status" style="font-size:21px;font-weight:850;">Connecting…</div>
        <div id="developer-ai-call-window-caption" style="margin-top:10px;font-size:14px;opacity:.85;max-width:310px;"></div>
      </div>
    </div>

    <button id="developer-ai-play-reply" type="button" style="padding:12px;margin-bottom:12px;border:0;border-radius:14px;">Play reply / test audio</button>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
      <button id="developer-ai-call-quiet" type="button"
        style="min-height:54px;border:0;border-radius:18px;background:rgba(255,255,255,.16);color:white;font-weight:850;">HOLD UP</button>
      <button id="developer-ai-call-mute" type="button"
        style="min-height:54px;border:0;border-radius:18px;background:rgba(255,255,255,.16);color:white;font-weight:850;">MUTE</button>
      </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button id="developer-ai-call-speaker" type="button"
        style="min-height:54px;border:0;border-radius:18px;background:white;color:#0f5fc7;font-weight:900;">🔊 LOUD</button>
      <button id="developer-ai-call-end" type="button"
        style="min-height:54px;border:0;border-radius:18px;background:#d92d20;color:white;font-weight:900;">END</button>
    </div>
  `;

  document.body.appendChild(wrap);

  $("developer-ai-play-reply").onclick = () => {
    try { developerAIRecognition?.abort(); } catch (_) {}
    speakDeveloperAIFreeReply(developerAILastSpokenReply || "Audio test. Can you hear me?").catch(() => {});
  };
  $("developer-ai-call-quiet").onclick = () => setDeveloperAIQuietMode(!developerAIQuietMode);
  $("developer-ai-call-end").onclick = () => stopDeveloperAICall();
  $("developer-ai-call-close").onclick = () => {
    stopDeveloperAICall();
  };

  let muted = false;
  $("developer-ai-call-mute").onclick = function () {
    muted = !muted;
    if (developerAIAudio) developerAIAudio.muted = muted;
    if (developerAIRealtimeAudio) developerAIRealtimeAudio.muted = muted;
    try {
      if (muted) window.speechSynthesis?.pause?.();
      else window.speechSynthesis?.resume?.();
      if (developerAIAudioContext) {
        if (muted) developerAIAudioContext.suspend();
        else developerAIAudioContext.resume();
      }
    } catch (_) {}
    this.textContent = muted ? "UNMUTE" : "MUTE";
  };

  $("developer-ai-call-speaker").onclick = function () {
    developerAISpeakerMode = !developerAISpeakerMode;
    if (developerAIRealtimeAudio) developerAIRealtimeAudio.volume = developerAISpeakerMode ? 1 : 0.45;
    if (developerAIAudio) developerAIAudio.volume = developerAISpeakerMode ? 1 : 0.45;
    this.textContent = developerAISpeakerMode ? "🔊 LOUD" : "🔉 QUIET";
    this.style.background = developerAISpeakerMode ? "white" : "rgba(255,255,255,.16)";
    this.style.color = developerAISpeakerMode ? "#0f5fc7" : "white";
  };
}

function updateDeveloperAICallWindow(statusText, captionText = "") {
  const status = $("developer-ai-call-window-status");
  const caption = $("developer-ai-call-window-caption");
  if (status && statusText) status.textContent = statusText;
  if (caption) caption.textContent = captionText || "";
}

async function waitForRealtimeIce(pc, timeoutMs = 2200) {
  if (pc.iceGatheringState === "complete") return;
  await Promise.race([
    new Promise(resolve => {
      const handler = () => {
        if (pc.iceGatheringState === "complete") {
          pc.removeEventListener("icegatheringstatechange", handler);
          resolve();
        }
      };
      pc.addEventListener("icegatheringstatechange", handler);
    }),
    new Promise(resolve => setTimeout(resolve, timeoutMs))
  ]);
}

function handleDeveloperAIRealtimeEvent(event) {
  let data = null;
  try { data = JSON.parse(event.data); } catch (_) { return; }
  const type = String(data?.type || "");

  if (type === "input_audio_buffer.speech_started") {
    developerAIUserIsSpeaking = true;
    updateDeveloperAICallWindow("Listening…", "Go ahead — I won’t interrupt.");
    return;
  }

  if (type === "input_audio_buffer.speech_stopped") {
    developerAIUserIsSpeaking = false;
    updateDeveloperAICallWindow("Thinking…", "");
    return;
  }

  if (
    type === "response.output_audio_transcript.delta" ||
    type === "response.audio_transcript.delta"
  ) {
    const delta = String(data?.delta || "");
    if (delta) {
      const caption = $("developer-ai-call-window-caption");
      if (caption) caption.textContent = (caption.textContent + delta).slice(-500);
    }
    return;
  }

  if (type === "output_audio_buffer.started") {
    updateDeveloperAICallWindow("Speaking…", "Developer AI");
    return;
  }

  if (type === "output_audio_buffer.stopped" || type === "response.done") {
    updateDeveloperAICallWindow("Listening…", "Your turn");
    return;
  }

  if (type === "error") {
    const message = String(data?.error?.message || "Realtime voice error.");
    updateDeveloperAICallWindow("Call issue", message);
    const status = $("developer-ai-status");
    if (status) status.textContent = "Developer AI realtime error — " + message;
  }
}

async function startDeveloperAIRealtimeCall() {
  if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
    throw new Error("Realtime voice is not supported by this browser.");
  }

  developerAICallMode = true;
  openDeveloperAICallWindow();
  updateDeveloperAICallWindow("Connecting…", "Starting realtime voice");
  setDeveloperAICallScrollSafe();
  $("developer-ai-input")?.blur?.();

  const button = $("developer-ai-call");
  const status = $("developer-ai-status");
  if (button) button.textContent = "■ END CALL";
  if (status) status.textContent = "Starting realtime Developer AI call…";

  developerAIRealtimeStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  const pc = new RTCPeerConnection();
  developerAIRealtimePc = pc;

  developerAIRealtimeAudio = document.createElement("audio");
  developerAIRealtimeAudio.autoplay = true;
  developerAIRealtimeAudio.playsInline = true;
  developerAIRealtimeAudio.volume = 1;
  developerAIRealtimeAudio.style.display = "none";
  document.body.appendChild(developerAIRealtimeAudio);

  pc.ontrack = event => {
    const remote = event.streams?.[0];
    if (!remote) return;
    developerAIRealtimeAudio.srcObject = remote;
    developerAIRealtimeAudio.play().catch(() => {
      updateDeveloperAICallWindow("Audio blocked", "Tap the call screen once, then keep talking.");
    });
  };

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;
    if (state === "connected") {
      updateDeveloperAICallWindow("Listening…", "Realtime voice connected");
      if (status) status.textContent = "Developer AI realtime call connected.";
    } else if (state === "failed" || state === "disconnected") {
      updateDeveloperAICallWindow("Connection interrupted", "Trying again may help.");
      if (status) status.textContent = "Developer AI realtime call connection interrupted.";
    }
  };

  developerAIRealtimeStream.getTracks().forEach(track => {
    pc.addTrack(track, developerAIRealtimeStream);
  });

  const dc = pc.createDataChannel("oai-events");
  developerAIRealtimeChannel = dc;
  dc.onmessage = handleDeveloperAIRealtimeEvent;
  dc.onopen = () => {
    updateDeveloperAICallWindow("Listening…", "Realtime voice connected");
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitForRealtimeIce(pc);

  const sdp = pc.localDescription?.sdp || offer.sdp;
  const answer = await callMyServiceEdgeFunction("developer-ai", {
    action: "realtime_offer",
    sdp
  });

  if (!answer?.sdp) throw new Error("Realtime voice returned no connection answer.");

  await pc.setRemoteDescription({
    type: "answer",
    sdp: answer.sdp
  });

  unlockDeveloperAIAudio();
  updateDeveloperAICallWindow("Listening…", "Talk naturally — I’ll wait for you to finish.");
  if (status) status.textContent = "Developer AI realtime voice ready.";
}


function getDeveloperAIFreeVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const preferredNames = ["Ava", "Samantha", "Zoe", "Nicky", "Evan", "Aaron", "Alex"];
  for (const name of preferredNames) {
    const voice = voices.find(item =>
      String(item.name || "").toLowerCase().includes(name.toLowerCase()) &&
      String(item.lang || "").toLowerCase().startsWith("en")
    );
    if (voice) return voice;
  }
  return voices.find(item =>
    String(item.lang || "").toLowerCase().startsWith("en-us") &&
    item.localService !== false
  ) || voices.find(item =>
    String(item.lang || "").toLowerCase().startsWith("en")
  ) || null;
}

function cleanDeveloperAIFreeReply(value) {
  const banned = /\b(fuck|shit|bitch|asshole|damn|cunt)\b/gi;
  return String(value || "")
    .replace(banned, "—")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
}

function buildDeveloperAIFreeReply(message) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();
  const currentUser = getCurrentUser?.();
  const tickets = Array.isArray(state?.supportTickets) ? state.supportTickets : [];
  const openTickets = tickets.filter(ticket => String(ticket.status || "").toLowerCase() !== "closed");
  const activeEmployees = Array.isArray(state?.employees)
    ? state.employees.filter(employee => employee.active !== false)
    : [];

  if (!text) return "I’m listening.";

  if (/^(confirm change|approve change|yes,? approve|yes,? confirm)$/i.test(text) && developerAIPendingWebsiteChange) {
    const request = developerAIPendingWebsiteChange;
    developerAIPendingWebsiteChange = "";

    if (!Array.isArray(state.supportTickets)) state.supportTickets = [];
    state.supportTickets.unshift({
      id: "MS-" + String(Date.now()).slice(-6),
      company: state.companyName || "MyService",
      user: currentUser?.name || "Developer",
      subject: "Approved website change request",
      description: request,
      priority: "standard",
      difficulty: "Needs Codex",
      estimatedMinutes: 0,
      estimateLabel: "Pending code review",
      chatgptDifficulty: "Ready for Codex",
      chatgptEstimateLabel: "Open ChatGPT to apply",
      mayBeTooSensitiveForChatGPT: false,
      status: "Approved — awaiting Codex",
      createdAt: new Date().toISOString()
    });
    saveState();
    renderSupportTickets?.();
    return "Confirmed. I saved the exact approved website change request. It will not edit or deploy anything silently. Open ChatGPT Codex to apply it.";
  }

  if (
    /\b(change|fix|add|remove|update|edit|redesign|move|rename)\b/.test(lower) &&
    /\b(site|website|app|page|screen|button|menu|dashboard|code)\b/.test(lower)
  ) {
    developerAIPendingWebsiteChange = text.slice(0, 500);
    return "I can queue that website change. I will not touch the site yet. Say confirm change to approve this exact request, or say cancel change.";
  }

  if (/^(cancel change|do not change|don’t change|never mind)$/i.test(text)) {
    developerAIPendingWebsiteChange = "";
    return "Canceled. I did not change or queue anything.";
  }

  if (/\b(hi|hey|hello|yo)\b/.test(lower)) {
    return "Hey Caleb. I’m here. What do you want to check in MyService?";
  }
  if (lower.includes("what time") || lower.includes("current time")) {
    return "It’s " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) + ".";
  }
  if (lower.includes("ticket")) {
    return openTickets.length
      ? "You have " + openTickets.length + " open support " + (openTickets.length === 1 ? "ticket" : "tickets") + "."
      : "You don’t have any open support tickets right now.";
  }
  if (lower.includes("employee") || lower.includes("staff")) {
    return "MyService currently has " + activeEmployees.length + " active " +
      (activeEmployees.length === 1 ? "team member" : "team members") + " in this workspace.";
  }
  if (lower.includes("who am i") || lower.includes("my role")) {
    return "You’re signed in as " + String(currentUser?.name || "the developer") +
      ", with the " + String(currentUser?.role || "Developer") + " role.";
  }
  if (lower.includes("security") || lower.includes("password") || lower.includes("api key")) {
    return "I can explain the security status, but I will not reveal passwords, API keys, private employee data, or bypass permissions.";
  }
  if (lower.includes("swear") || lower.includes("curse")) {
    return "No. I’ll keep it clean and professional.";
  }
  if (lower.includes("help") || lower.includes("what can you do")) {
    return "In no-credit call mode, I can read MyService status, team counts, support-ticket counts, time, role information, and give safe navigation help. I can’t change security settings or expose private information.";
  }
  if (lower.includes("schedule")) {
    return "I can help check scheduling information without changing anyone’s shift or permissions.";
  }
  if (lower.includes("clock")) {
    const employee = typeof getCurrentEmployee === "function" ? getCurrentEmployee() : null;
    return employee
      ? String(employee.name || "Your account") + " is currently " + String(employee.status || "off clock") + "."
      : "I couldn’t read the current clock status.";
  }
  return "I heard you. The no-credit call is working, but that request needs cloud-level reasoning. I can still help with MyService status, navigation, staffing, clock, schedule, or support tickets without charging API credits.";
}

function speakDeveloperAIFreeReply(reply) {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      resolve();
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanDeveloperAIFreeReply(reply));
    developerAISpeechUtterance = utterance;
    utterance.voice = getDeveloperAIFreeVoice();
    utterance.lang = utterance.voice?.lang || "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 0.98;
    utterance.volume = developerAISpeakerMode ? 1 : 0.45;

    utterance.onstart = () => {
      developerAISpeaking = true;
      updateDeveloperAICallWindow("Speaking…", "Developer AI • no-credit mode");
    };
    utterance.onend = () => {
      developerAISpeaking = false;
      developerAISpeechUtterance = null;
      updateDeveloperAICallWindow("Listening…", "Voice input ready");
      restartDeveloperAIListening(250);
      resolve();
    };
    utterance.onerror = () => {
      developerAISpeaking = false;
      developerAISpeechUtterance = null;
      restartDeveloperAIListening(250);
      resolve();
    };

    synth.speak(utterance);
  });
}

async function answerDeveloperAIFreeCall(message) {
  if (!developerAIIsAllowed() || developerAIFreeRequestBusy) return;
  developerAIFreeRequestBusy = true;
  try { developerAIRecognition?.abort(); } catch (_) {}
  const history = getDeveloperAIHistory();
  history.push({ role: "user", content: String(message).slice(0,5000) });
  saveDeveloperAIHistory(history);
  if ($("developer-ai-input")) $("developer-ai-input").value = "";
  updateDeveloperAICallWindow("Thinking…", message);
  try {
    const response = await callMyServiceEdgeFunction("developer-ai", {
      action: "gemini_chat", messages: history.slice(-12), voice: true
    });
    const reply = cleanDeveloperAIFreeReply(response.reply);
    history.push({ role: "assistant", content: reply });
    saveDeveloperAIHistory(history);
    renderDeveloperAIChat();
    developerAILastSpokenReply = reply;
    if (developerAICallMode) {
      updateDeveloperAICallWindow("Reply ready", reply);
      await speakDeveloperAIFreeReply(reply);
    }
  } catch (error) {
    const message = String(error.message || "AI connection failed.");
    updateDeveloperAICallWindow("AI unavailable", message);
    if ($("developer-ai-status")) $("developer-ai-status").textContent = message;
  } finally {
    developerAIFreeRequestBusy = false;
    if (developerAICallMode) restartDeveloperAIListening(350);
  }
}

async function startDeveloperAIFreeCall() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition || !window.speechSynthesis) {
    throw new Error("This device does not support the free voice-call mode.");
  }

  const setup = await callMyServiceEdgeFunction("developer-ai", { action: "gemini_status" });
  if (!setup.configured) throw new Error("Google AI needs its server key before calls can start.");
  developerAICallMode = true;
  developerAIFreeCallMode = true;
  developerAISpeakerMode = true;
  unlockDeveloperAIAudio();
  window.speechSynthesis.getVoices();

  openDeveloperAICallWindow();
  updateDeveloperAICallWindow("Connecting…", "Starting no-credit voice");
  setDeveloperAICallScrollSafe();

  const button = $("developer-ai-call");
  const status = $("developer-ai-status");
  if (button) button.textContent = "■ END CALL";
  if (status) status.textContent = "Starting no-credit Developer AI call…";

  const recognition = new Recognition();
  developerAIRecognition = recognition;
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    developerAIUserIsSpeaking = false;
    updateDeveloperAICallWindow("Listening…", "Voice input ready");
  };
  recognition.onspeechstart = () => {
    developerAIUserIsSpeaking = true;
    try { window.speechSynthesis.cancel(); } catch (_) {}
    updateDeveloperAICallWindow("Listening…", "Go ahead — I won’t interrupt.");
  };
  recognition.onresult = event => {
    const transcript = Array.from(event.results || [])
      .map(result => result?.[0]?.transcript || "")
      .join(" ")
      .trim();
    developerAIUserIsSpeaking = false;
    if (transcript) queueDeveloperAIUserSpeech(transcript);
  };
  recognition.onerror = event => {
    if (!developerAICallMode || !developerAIFreeCallMode) return;
    const code = String(event?.error || "");
    if (code === "not-allowed" || code === "service-not-allowed") {
      updateDeveloperAICallWindow("Microphone blocked", "Allow microphone and speech recognition in iPhone Settings.");
      return;
    }
    restartDeveloperAIListening(500);
  };
  recognition.onend = () => {
    if (developerAICallMode && developerAIFreeCallMode && !developerAISpeaking && !developerAIFreeRequestBusy) {
      restartDeveloperAIListening(350);
    }
  };

  try { recognition.start(); } catch (_) {}
  updateDeveloperAICallWindow("Listening…", "Voice input ready");
  if (status) status.textContent = "Developer AI no-credit call connected.";
}

async function toggleDeveloperAICall() {
  if (!developerAIIsAllowed()) return;

  if (developerAICallMode) {
    stopDeveloperAICall();
    return;
  }

  // Prefer the true streaming WebRTC call path. It has semantic turn detection,
  // natural barge-in, noise reduction, and streamed audio. Keep the existing
  // no-credit/browser path only as a fallback so CALL never becomes unusable.
  try {
    await startDeveloperAIRealtimeCall();
    return;
  } catch (realtimeError) {
    stopDeveloperAICall();
    try {
      await startDeveloperAIFreeCall();
      const status = $("developer-ai-status");
      if (status) status.textContent = "Developer AI fallback call connected.";
      return;
    } catch (fallbackError) {
      const message = String(fallbackError?.message || realtimeError?.message || "Voice could not start.");
      stopDeveloperAICall();
      openDeveloperAICallWindow();
      updateDeveloperAICallWindow("Couldn’t connect", message);
      const status = $("developer-ai-status");
      if (status) status.textContent = "Developer AI voice unavailable — " + message;
    }
  }
}

async function generateDeveloperAIImage() {
  if (!developerAIIsAllowed()) return;
  const input = $("developer-ai-input");
  const status = $("developer-ai-status");
  const prompt = String(input?.value || "").trim();

  if (!prompt) {
    if (status) status.textContent = "Type what image you want first.";
    return;
  }

  if (status) status.textContent = "Preparing image…";

  try {
    const response = await callMyServiceEdgeFunction("developer-ai", {
      action: "generate_image",
      prompt,
      context: getDeveloperAISafeContext()
    });

    const box = $("developer-ai-messages");
    if (box && response.imageBase64) {
      const wrap = document.createElement("div");
      wrap.style.cssText = "padding:9px 13px;border-radius:18px;background:#fff;border:1px solid #dbe4f0;";
      wrap.innerHTML =
        '<strong style="display:block;margin-bottom:8px;">Developer AI</strong>' +
        '<img alt="AI-generated image" style="display:block;width:100%;border-radius:16px;" src="data:image/png;base64,' +
        response.imageBase64 + '">';
      box.appendChild(wrap);
      box.scrollTop = box.scrollHeight;
    }

    if (input) input.value = "";
    if (status) status.textContent = "Image ready • AI-generated";
  } catch (error) {
    const messageText = String(error?.message || "Image generation failed.");
    if (status) status.textContent = messageText.includes("OPENAI_API_KEY")
      ? "Developer AI needs its secure server API key before image generation can run."
      : "Image generation unavailable — " + messageText;
  }
}

async function sendDeveloperAIMessage(event) {
  event?.preventDefault?.();

  if (!developerAIIsAllowed()) {
    alert("Developer AI is available only to the platform developer account.");
    return;
  }

  const input = $("developer-ai-input");
  const send = $("developer-ai-send");
  const status = $("developer-ai-status");
  const message = String(input?.value || "").trim();
  if (!message) return;

  const history = getDeveloperAIHistory();
  history.push({ role: "user", content: message });
  saveDeveloperAIHistory(history);
  if (input) input.value = "";
  renderDeveloperAIChat();

  if (send) send.disabled = true;
  if (status) status.textContent = "Developer AI is thinking…";

  try {
    const response = await callMyServiceEdgeFunction("developer-ai", {
      // Use the full Developer AI brain/tool path here. Gemini remains only as
      // a no-tools fallback; the primary developer chat can inspect approved
      // repo files and use the guarded code broker after explicit confirmation.
      action: "chat",
      messages: history.slice(-12),
      voice: developerAICallMode === true,
      voiceNetwork: developerAICallMode ? developerAIVoiceModeForNetwork() : null,
      allowCodePush: developerAICodePushEnabled()
    });

    history.push({
      role: "assistant",
      content: String(response.reply || "No response returned.")
    });
    saveDeveloperAIHistory(history);
    renderDeveloperAIChat();

    if (developerAICallMode) {
      if (response.audioBase64) {
        const callStatus = $("developer-ai-status");
        if (developerAIUserIsSpeaking) {
          developerAIPendingVoiceReply = {
            audioBase64: response.audioBase64,
            mimeType: response.audioMimeType || "audio/mpeg"
          };
          if (callStatus) callStatus.textContent = "Reply ready — waiting for you to finish.";
          updateDeveloperAICallWindow("Listening…", "Reply ready. I’ll wait until you finish.");
        } else {
          if (callStatus) callStatus.textContent = "Developer AI is speaking…";
          playDeveloperAIAudio(response.audioBase64, response.audioMimeType || "audio/mpeg");
        }
      } else {
        developerAILastSpokenReply = String(response.reply || "");
        await speakDeveloperAIFreeReply(developerAILastSpokenReply);
      }
    }

    if (status) {
      status.textContent = "Developer AI ready" + (response.model ? " • " + response.model : "");
    }
  } catch (error) {
    const messageText = String(error?.message || "Developer AI request failed.");
    history.push({
      role: "assistant",
      content: messageText.includes("OPENAI_API_KEY")
        ? "Developer AI is installed, but its secure AI API key still needs to be configured on the server."
        : "I couldn't complete that request: " + messageText
    });
    saveDeveloperAIHistory(history);
    renderDeveloperAIChat();
    if (status) status.textContent = "Developer AI unavailable — " + messageText;
  } finally {
    if (send) send.disabled = false;
    input?.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderDeveloperAIChat();
    renderDeveloperAICodePushState();
  }, 0);
});


/* =========================================================
   MYSERVICE PWA INSTALL
   Makes the GitHub Pages build installable as a standalone app.
   ========================================================= */

let myServiceInstallPrompt = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("MyService service worker registration failed:", error);
    });
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  myServiceInstallPrompt = event;
  const installButton = document.getElementById("myservice-install-button");
  if (installButton) installButton.hidden = false;
});

window.addEventListener("appinstalled", () => {
  myServiceInstallPrompt = null;
  const installButton = document.getElementById("myservice-install-button");
  if (installButton) installButton.hidden = true;
});

async function installMyServiceApp() {
  if (myServiceInstallPrompt) {
    myServiceInstallPrompt.prompt();
    await myServiceInstallPrompt.userChoice;
    myServiceInstallPrompt = null;
    return;
  }

  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isiOS) {
    alert("On iPhone: tap the Share button in Safari, then tap Add to Home Screen, then Add.");
    return;
  }

  alert("Open this site in your browser menu and choose Install App or Add to Home Screen.");
}


/* =========================================================
   MYSERVICE MOBILE INSTALL REDIRECT
   Mobile browsers go to the install screen unless the PWA
   is already running in standalone mode.
   ========================================================= */
(function () {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Remove any old desktop-access bypass saved by earlier builds.
  if (isMobile) {
    localStorage.removeItem("myservice_desktop_access");
  }

  if (
    isMobile &&
    !isStandalone &&
    !location.pathname.endsWith("/install.html")
  ) {
    location.replace(new URL("./install.html", location.href).href);
  }
})();


/* =========================================================
   ONBOARDING + TRAINING CENTER (NO PAYROLL)
   ========================================================= */
function ensureTrainingState() {
  if (!Array.isArray(state.trainingModules)) state.trainingModules = [
    {id:"orientation",title:"New Employee Orientation",type:"orientation",description:"Company welcome, workplace expectations, safety basics, and who to contact for help.",videoUrl:"",required:true},
    {id:"role-training",title:"Role Training",type:"training",description:"Job-specific training assigned by management.",videoUrl:"",required:true}
  ];
  if (!Array.isArray(state.trainingProgress)) state.trainingProgress = [];
}

function trainingProgressFor(userId,moduleId) {
  ensureTrainingState();
  return state.trainingProgress.find(x => x.userId === userId && x.moduleId === moduleId);
}

function completeTrainingModule(moduleId) {
  ensureTrainingState();
  const user=getCurrentUser();
  if (!user) return;
  let row=trainingProgressFor(user.id,moduleId);
  if (!row) {
    row={id:uid("training"),userId:user.id,moduleId,status:"completed",completedAt:new Date().toISOString()};
    state.trainingProgress.push(row);
  } else {
    row.status="completed";
    row.completedAt=new Date().toISOString();
  }
  addActivity("Training completed", user.name+" completed a training module.", "✓");
  saveState();
  renderTrainingCenter();
}

function addTrainingModule(event) {
  event.preventDefault();
  if (!canManageEmployees()) return;
  ensureTrainingState();
  const title=$("trainingTitle")?.value.trim();
  if (!title) return;
  state.trainingModules.push({
    id:uid("module"),
    title,
    type:$("trainingType")?.value || "training",
    description:$("trainingDescription")?.value.trim() || "",
    videoUrl:$("trainingVideoUrl")?.value.trim() || "",
    required:$("trainingRequired")?.checked !== false
  });
  saveState();
  $("trainingModuleForm")?.reset();
  renderTrainingCenter();
}

function renderTrainingCenter() {
  const root=$("trainingCenterBody");
  if (!root) return;
  ensureTrainingState();
  const user=getCurrentUser();
  const manager=canManageEmployees();
  const completed=state.trainingModules.filter(m => trainingProgressFor(user.id,m.id)?.status==="completed").length;
  const pct=state.trainingModules.length ? Math.round(completed/state.trainingModules.length*100) : 100;

  root.innerHTML=`
    <div class="stats-grid">
      <div class="stat-card"><span>My progress</span><strong>${pct}%</strong><small>${completed} of ${state.trainingModules.length} complete</small></div>
      <div class="stat-card"><span>Required</span><strong>${state.trainingModules.filter(m=>m.required).length}</strong><small>orientation + training</small></div>
    </div>
    <div class="dashboard-grid">
      <div class="panel">
        <div class="panel-header"><div><h2>My onboarding & training</h2><p>Complete assigned orientation, videos, and training.</p></div></div>
        ${state.trainingModules.map(m => {
          const done=trainingProgressFor(user.id,m.id)?.status==="completed";
          const safeUrl=escapeHTML(m.videoUrl||"");
          return `<div class="list-row" style="align-items:flex-start;">
            <div><strong>${escapeHTML(m.title)}</strong><small>${escapeHTML(m.type)}${m.required?" • Required":""}</small>
            <p style="margin:7px 0;font-size:12px;">${escapeHTML(m.description||"")}</p>
            ${safeUrl ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="outline-button" style="display:inline-block;text-decoration:none;">Watch training video</a>` : ""}
            </div>
            <button class="${done?"outline-button":"primary-button"}" type="button" ${done?"disabled":""} onclick="completeTrainingModule('${m.id}')">${done?"Completed ✓":"Mark complete"}</button>
          </div>`;
        }).join("")}
      </div>
      ${manager ? `<div class="panel">
        <div class="panel-header"><div><h2>Manage training</h2><p>Add orientation steps or training videos. No payroll features are included.</p></div></div>
        <form id="trainingModuleForm" onsubmit="addTrainingModule(event)">
          <label>Title</label><input id="trainingTitle" required placeholder="Example: Food safety orientation">
          <label>Type</label><select id="trainingType"><option value="orientation">Orientation</option><option value="training">Training</option><option value="video">Training video</option></select>
          <label>Description</label><textarea id="trainingDescription" placeholder="What the employee should learn"></textarea>
          <label>Video link (optional)</label><input id="trainingVideoUrl" type="url" placeholder="https://…">
          <label style="display:flex;gap:8px;align-items:center;"><input id="trainingRequired" type="checkbox" checked style="width:auto;min-height:auto;"> Required</label>
          <button class="primary-button" type="submit" style="margin-top:14px;">Add training</button>
        </form>
      </div>` : ""}
    </div>`;
}

function installTrainingCenter() {
  if (!$("training")) {
    const main=document.querySelector(".main-content");
    if (main) {
      const section=document.createElement("section");
      section.id="training";
      section.className="page";
      section.innerHTML=`<div class="page-header"><div><div class="eyebrow">PEOPLE</div><h1>Onboarding & Training</h1><p>Orientation, training videos, required learning, and completion tracking.</p></div></div><div id="trainingCenterBody"></div>`;
      main.appendChild(section);
    }
  }
  if (!document.querySelector('[data-training-nav]')) {
    const employeeNav=[...document.querySelectorAll(".nav")].find(b => (b.getAttribute("onclick")||"").includes("employees"));
    if (employeeNav) {
      const b=document.createElement("button");
      b.className="nav"; b.type="button"; b.dataset.trainingNav="1";
      b.setAttribute("onclick","showSection('training')");
      b.innerHTML="<span>▶</span>Training";
      employeeNav.insertAdjacentElement("afterend",b);
    }
  }
  renderTrainingCenter();
}
