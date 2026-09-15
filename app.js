const state = {
  companyName: "Five Star Detail",

  currentUser: {
    name: "Admin",
    role: "Admin"
  },

  clockedIn: false,
  clockInTime: null,

  employees: [
    {
      name: "Admin",
      role: "Admin",
      status: "Working",
      hours: "0.0"
    },
    {
      name: "Employee 1",
      role: "Employee",
      status: "Off Clock",
      hours: "0.0"
    },
    {
      name: "Manager 1",
      role: "Manager",
      status: "Off Clock",
      hours: "0.0"
    }
  ],

  jobs: [
    {
      customer: "Example Customer",
      vehicle: "2022 Honda Civic",
      employee: "Employee 1",
      time: "9:00 AM",
      status: "Scheduled",
      checklist: 0,
      totalChecklist: 10
    },
    {
      customer: "Example Customer 2",
      vehicle: "2021 Ford F-150",
      employee: "Manager 1",
      time: "1:00 PM",
      status: "Scheduled",
      checklist: 0,
      totalChecklist: 10
    }
  ],

  customers: [
    {
      name: "Example Customer",
      phone: "(555) 555-0101",
      vehicle: "2022 Honda Civic"
    },
    {
      name: "Example Customer 2",
      phone: "(555) 555-0102",
      vehicle: "2021 Ford F-150"
    }
  ],

  cash: {
    expected: 0,
    deposited: 0
  },

  activity: [
    {
      icon: "✓",
      title: "MyDetail workspace loaded",
      description: "Admin dashboard opened",
      time: "Just now"
    }
  ],

  punchHistory: []
};


/* =========================
   NAVIGATION
========================= */

function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(sectionId);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll("[data-section]").forEach(button => {
    button.classList.remove("active");
  });

  const activeButton = document.querySelector(
    `[data-section="${sectionId}"]`
  );

  if (activeButton) {
    activeButton.classList.add("active");
  }

  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.classList.remove("open");
  }
}


/* =========================
   MOBILE SIDEBAR
========================= */

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}


/* =========================
   CLOCK
========================= */

function updateClock() {
  const now = new Date();

  const timeString = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  document.querySelectorAll(".live-clock").forEach(element => {
    element.textContent = timeString;
  });

  updateWorkingHours();
}


/* =========================
   CLOCK IN / OUT
========================= */

function clockIn() {
  if (state.clockedIn) {
    return;
  }

  state.clockedIn = true;
  state.clockInTime = new Date();

  state.employees[0].status = "Working";

  state.activity.unshift({
    icon: "🟢",
    title: "Clock In",
    description: `${state.currentUser.name} clocked in`,
    time: "Just now"
  });

  addPunchRecord("Clock In");

  updateClockButton();
  renderEmployees();
  renderActivity();
  renderPunchHistory();
  renderDashboard();
}


function clockOut() {
  if (!state.clockedIn) {
    return;
  }

  const now = new Date();

  state.clockedIn = false;

  state.employees[0].status = "Off Clock";

  state.activity.unshift({
    icon: "🔴",
    title: "Clock Out",
    description: `${state.currentUser.name} clocked out`,
    time: "Just now"
  });

  addPunchRecord("Clock Out", now);

  state.clockInTime = null;

  updateClockButton();
  renderEmployees();
  renderActivity();
  renderPunchHistory();
  renderDashboard();
}


function updateClockButton() {
  const button = document.getElementById("clockButton");

  if (!button) {
    return;
  }

  if (state.clockedIn) {
    button.textContent = "Clock Out";
    button.classList.add("danger");
  } else {
    button.textContent = "Clock In";
    button.classList.remove("danger");
  }
}


/* =========================
   WORKING HOURS
========================= */

function updateWorkingHours() {
  if (!state.clockedIn || !state.clockInTime) {
    return;
  }

  const now = new Date();

  const milliseconds =
    now.getTime() - state.clockInTime.getTime();

  const hours = milliseconds / 1000 / 60 / 60;

  state.employees[0].hours = hours.toFixed(2);

  const hoursElement =
    document.getElementById("currentHours");

  if (hoursElement) {
    hoursElement.textContent =
      `${state.employees[0].hours} hrs`;
  }
}


/* =========================
   EMPLOYEES
========================= */

function renderEmployees() {
  const container =
    document.getElementById("employeesList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.employees.forEach(employee => {
    const card = document.createElement("div");

    card.className = "employee-card";

    card.innerHTML = `
      <div>
        <strong>${employee.name}</strong>
        <span>${employee.role}</span>
      </div>

      <div>
        <span class="status ${
          employee.status === "Working"
            ? "working"
            : "off"
        }">
          ${employee.status}
        </span>

        <small>${employee.hours} hrs</small>
      </div>
    `;

    container.appendChild(card);
  });
}


/* =========================
   CREATE ACCOUNT
========================= */

function createAccount() {
  const name = prompt("Employee or manager name:");

  if (!name) {
    return;
  }

  const role = prompt(
    "Role: Employee, Manager, or Admin"
  );

  if (!role) {
    return;
  }

  const normalizedRole =
    role.charAt(0).toUpperCase() +
    role.slice(1).toLowerCase();

  state.employees.push({
    name,
    role: normalizedRole,
    status: "Off Clock",
    hours: "0.0"
  });

  state.activity.unshift({
    icon: "👤",
    title: "Account created",
    description: `${name} was added as ${normalizedRole}`,
    time: "Just now"
  });

  renderEmployees();
  renderActivity();
}


/* =========================
   JOBS
========================= */

function createJob() {
  const customer =
    prompt("Customer name:");

  if (!customer) {
    return;
  }

  const vehicle =
    prompt("Vehicle:");

  if (!vehicle) {
    return;
  }

  const employee =
    prompt("Assigned employee:");

  if (!employee) {
    return;
  }

  const time =
    prompt("Appointment time:");

  if (!time) {
    return;
  }

  state.jobs.push({
    customer,
    vehicle,
    employee,
    time,
    status: "Scheduled",
    checklist: 0,
    totalChecklist: 10
  });

  state.activity.unshift({
    icon: "🚗",
    title: "Job created",
    description: `${customer} — ${vehicle}`,
    time: "Just now"
  });

  renderJobs();
  renderSchedule();
  renderActivity();
  renderDashboard();
}


function renderJobs() {
  const container =
    document.getElementById("jobsList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.jobs.forEach((job, index) => {
    const row = document.createElement("div");

    row.className = "job-row";

    row.innerHTML = `
      <div>
        <strong>${job.customer}</strong>
        <span>${job.vehicle}</span>
      </div>

      <div>${job.employee}</div>

      <div>
        ${job.checklist}/${job.totalChecklist}
      </div>

      <div>
        <span class="status">${job.status}</span>
      </div>

      <button onclick="completeJob(${index})">
        Complete
      </button>
    `;

    container.appendChild(row);
  });
}


function completeJob(index) {
  const job = state.jobs[index];

  if (!job) {
    return;
  }

  job.status = "Completed";

  state.activity.unshift({
    icon: "✓",
    title: "Job completed",
    description: `${job.customer} — ${job.vehicle}`,
    time: "Just now"
  });

  renderJobs();
  renderActivity();
  renderDashboard();
}


/* =========================
   SCHEDULE
========================= */

function renderSchedule() {
  const container =
    document.getElementById("scheduleList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.jobs.forEach(job => {
    const item = document.createElement("div");

    item.className = "schedule-item";

    item.innerHTML = `
      <strong>${job.time}</strong>

      <div>
        <strong>${job.customer}</strong>
        <span>${job.vehicle}</span>
      </div>

      <div>
        Assigned: ${job.employee}
      </div>

      <span class="status">
        ${job.status}
      </span>
    `;

    container.appendChild(item);
  });
}


/* =========================
   CUSTOMERS
========================= */

function createCustomer() {
  const name =
    prompt("Customer name:");

  if (!name) {
    return;
  }

  const phone =
    prompt("Phone number:");

  const vehicle =
    prompt("Vehicle:");

  state.customers.push({
    name,
    phone: phone || "",
    vehicle: vehicle || ""
  });

  state.activity.unshift({
    icon: "👤",
    title: "Customer added",
    description: name,
    time: "Just now"
  });

  renderCustomers();
  renderActivity();
}


function renderCustomers() {
  const container =
    document.getElementById("customersList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.customers.forEach(customer => {
    const item = document.createElement("div");

    item.className = "customer-row";

    item.innerHTML = `
      <div>
        <strong>${customer.name}</strong>
        <span>${customer.phone}</span>
      </div>

      <div>
        ${customer.vehicle}
      </div>
    `;

    container.appendChild(item);
  });
}


function searchCustomers() {
  const input =
    document.getElementById("customerSearch");

  if (!input) {
    return;
  }

  const query =
    input.value.toLowerCase();

  document
    .querySelectorAll(".customer-row")
    .forEach(row => {
      row.style.display =
        row.textContent
          .toLowerCase()
          .includes(query)
          ? ""
          : "none";
    });
}


/* =========================
   DAILY INTERIOR CHECKLIST
========================= */

const checklistItems = [
  "Vacuum",
  "Floor mats",
  "Seats",
  "Dashboard",
  "Center console",
  "Door panels",
  "Cup holders",
  "Interior windows / glass",
  "Vents",
  "Final interior inspection"
];


function renderChecklists() {
  const container =
    document.getElementById("checklistList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.jobs.forEach((job, jobIndex) => {

    const card =
      document.createElement("div");

    card.className = "checklist-card";

    card.innerHTML = `
      <div class="checklist-header">
        <div>
          <strong>${job.customer}</strong>
          <span>${job.vehicle}</span>
        </div>

        <span>
          ${job.checklist}/${job.totalChecklist}
        </span>
      </div>

      <div class="checklist-items">
        ${checklistItems.map((item, itemIndex) => `
          <label>
            <input
              type="checkbox"
              onchange="toggleChecklist(
                ${jobIndex},
                ${itemIndex},
                this.checked
              )"
            >

            <span>${item}</span>
          </label>
        `).join("")}
      </div>

      <div class="photo-box">
        <strong>Before Interior Photos</strong>
        <input type="file" accept="image/*" multiple>
      </div>

      <div class="photo-box">
        <strong>After Interior Photos</strong>
        <input type="file" accept="image/*" multiple>
      </div>
    `;

    container.appendChild(card);
  });
}


function toggleChecklist(
  jobIndex,
  itemIndex,
  checked
) {
  const job = state.jobs[jobIndex];

  if (!job) {
    return;
  }

  if (checked) {
    job.checklist++;
  } else {
    job.checklist--;
  }

  if (job.checklist < 0) {
    job.checklist = 0;
  }

  if (job.checklist > job.totalChecklist) {
    job.checklist = job.totalChecklist;
  }

  renderJobs();
  renderDashboard();
}


/* =========================
   CASH DROPS
========================= */

function addCashDrop() {
  const expected =
    Number(prompt("Expected cash amount:"));

  if (isNaN(expected)) {
    return;
  }

  const deposited =
    Number(prompt("Actual deposited amount:"));

  if (isNaN(deposited)) {
    return;
  }

  state.cash.expected += expected;
  state.cash.deposited += deposited;

  const difference =
    deposited - expected;

  let status = "BALANCED";

  if (difference < 0) {
    status = "UNDER";
  }

  if (difference > 0) {
    status = "OVER";
  }

  state.activity.unshift({
    icon: "💵",
    title: "Cash drop recorded",
    description:
      `$${deposited.toFixed(2)} deposited — ${status}`,
    time: "Just now"
  });

  renderCash();
  renderActivity();
  renderDashboard();
}


function renderCash() {
  const expected =
    document.getElementById("cashExpected");

  const deposited =
    document.getElementById("cashDeposited");

  const difference =
    document.getElementById("cashDifference");

  if (expected) {
    expected.textContent =
      money(state.cash.expected);
  }

  if (deposited) {
    deposited.textContent =
      money(state.cash.deposited);
  }

  if (difference) {
    const value =
      state.cash.deposited -
      state.cash.expected;

    difference.textContent =
      money(value);
  }
}


/* =========================
   ACTIVITY
========================= */

function renderActivity() {
  const container =
    document.getElementById("activityList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.activity
    .slice(0, 20)
    .forEach(item => {

      const row =
        document.createElement("div");

      row.className = "activity-item";

      row.innerHTML = `
        <div class="activity-icon">
          ${item.icon}
        </div>

        <div>
          <strong>${item.title}</strong>
          <span>${item.description}</span>
          <small>${item.time}</small>
        </div>
      `;

      container.appendChild(row);
    });
}


/* =========================
   PUNCH HISTORY
========================= */

function addPunchRecord(
  type,
  timestamp = new Date()
) {
  state.punchHistory.unshift({
    date: timestamp.toLocaleDateString(),
    type,
    time: timestamp.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }),
    status: state.clockedIn
      ? "Working"
      : "Off Clock"
  });
}


function renderPunchHistory() {
  const container =
    document.getElementById("punchHistory");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  state.punchHistory.forEach(punch => {

    const row =
      document.createElement("div");

    row.className = "punch-row";

    row.innerHTML = `
      <div>
        <strong>${punch.date}</strong>
        <span>${punch.type}</span>
      </div>

      <div>${punch.time}</div>

      <div>${punch.status}</div>

      <button onclick="requestPunchCorrection()">
        Request Correction
      </button>
    `;

    container.appendChild(row);
  });
}


function requestPunchCorrection() {
  const reason =
    prompt(
      "Explain the punch correction needed:"
    );

  if (!reason) {
    return;
  }

  state.activity.unshift({
    icon: "✏️",
    title: "Punch correction requested",
    description: reason,
    time: "Just now"
  });

  renderActivity();

  alert(
    "Correction request submitted for admin review."
  );
}


/* =========================
   DASHBOARD
========================= */

function renderDashboard() {
  const completed =
    state.jobs.filter(
      job => job.status === "Completed"
    ).length;

  const remaining =
    state.jobs.length - completed;

  const working =
    state.employees.filter(
      employee =>
        employee.status === "Working"
    ).length;

  const revenue =
    completed * 150;

  const revenueElement =
    document.getElementById("todayRevenue");

  const completedElement =
    document.getElementById("jobsCompleted");

  const remainingElement =
    document.getElementById("jobsRemaining");

  const workingElement =
    document.getElementById("employeesWorking");

  if (revenueElement) {
    revenueElement.textContent =
      money(revenue);
  }

  if (completedElement) {
    completedElement.textContent =
      completed;
  }

  if (remainingElement) {
    remainingElement.textContent =
      remaining;
  }

  if (workingElement) {
    workingElement.textContent =
      working;
  }

  renderWeeklyChart();
}


/* =========================
   WEEKLY GRAPH
========================= */

function renderWeeklyChart() {
  const canvas =
    document.getElementById("weeklyChart");

  if (!canvas) {
    return;
  }

  const context =
    canvas.getContext("2d");

  const width =
    canvas.width = canvas.clientWidth * 2;

  const height =
    canvas.height = 260;

  context.clearRect(
    0,
    0,
    width,
    height
  );

  const values = [
    820,
    1100,
    950,
    1450,
    1280,
    1650,
    1900
  ];

  const max =
    Math.max(...values);

  const padding = 40;

  context.beginPath();

  values.forEach((value, index) => {

    const x =
      padding +
      index *
      ((width - padding * 2) /
        (values.length - 1));

    const y =
      height -
      padding -
      (value / max) *
      (height - padding * 2);

    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });

  context.stroke();

  values.forEach((value, index) => {

    const x =
      padding +
      index *
      ((width - padding * 2) /
        (values.length - 1));

    const y =
      height -
      padding -
      (value / max) *
      (height - padding * 2);

    context.beginPath();

    context.arc(
      x,
      y,
      5,
      0,
      Math.PI * 2
    );

    context.fill();
  });
}


/* =========================
   MONEY
========================= */

function money(value) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(value);
}


/* =========================
   NOTIFICATIONS
========================= */

function showNotifications() {
  alert(
    "MyDetail notifications\n\n" +
    "No new notifications."
  );
}


/* =========================
   PROFILE
========================= */

function showProfile() {
  alert(
    `Signed in as:\n\n` +
    `${state.currentUser.name}\n` +
    `${state.currentUser.role}`
  );
}


/* =========================
   INITIALIZE
========================= */

function renderEverything() {
  const company =
    document.getElementById("companyName");

  if (company) {
    company.textContent =
      state.companyName;
  }

  renderEmployees();
  renderJobs();
  renderSchedule();
  renderCustomers();
  renderChecklists();
  renderCash();
  renderActivity();
  renderPunchHistory();
  renderDashboard();
  updateClockButton();
}


document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderEverything();

    updateClock();

    setInterval(
      updateClock,
      1000
    );

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js")
        .catch(error => {
          console.log(
            "Service worker registration failed:",
            error
          );
        });
    }
  }
);
