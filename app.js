/* =========================================================
   MYSERVICE — RESTAURANT MANAGEMENT APPLICATION
   5 Star Restaurant
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "myservice_restaurant_v1";

const defaultState = {
  companyName: "5 Star Restaurant",

  currentUser: null,

  users: [
    {
      id: "admin-1",
      name: "Admin",
      email: "admin@myservice.test",
      password: "admin123",
      role: "Admin",
      active: true
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      email: "manager@myservice.test",
      password: "manager123",
      role: "Manager",
      active: true
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      email: "employee@myservice.test",
      password: "employee123",
      role: "Employee",
      active: true
    }
  ],

  employees: [
    {
      id: "manager-1",
      name: "Manager Demo",
      role: "Manager",
      status: "Off Clock",
      clockIn: null,
      lunchStart: null,
      totalHours: 0
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      role: "Employee",
      status: "Off Clock",
      clockIn: null,
      lunchStart: null,
      totalHours: 0
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Example Customer",
      phone: "(555) 555-0101",
      email: "customer@example.com",
      notes: "Regular customer"
    },
    {
      id: "cust-2",
      name: "Example Customer 2",
      phone: "(555) 555-0102",
      email: "",
      notes: ""
    }
  ],

  jobs: [
    {
      id: "job-1",
      customer: "Example Customer",
      orderType: "Dine-In",
      order: "Burger, Fries, Soft Drink",
      employee: "Employee Demo",
      time: "12:00 PM",
      status: "Open",
      price: 19.99
    },
    {
      id: "job-2",
      customer: "Example Customer 2",
      orderType: "Takeout",
      order: "Chicken Sandwich, Fries",
      employee: "Manager Demo",
      time: "1:30 PM",
      status: "Open",
      price: 16.49
    }
  ],

  punches: [],

  cashDrops: [],

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
      description: "5 Star Restaurant management dashboard is ready.",
      time: new Date().toLocaleString(),
      icon: "✓"
    }
  ],

  notifications: [
    {
      id: "welcome-notification",
      title: "Welcome to MyService",
      message: "Your restaurant workspace is ready.",
      time: new Date().toLocaleString(),
      read: false
    }
  ]
};


/* =========================================================
   STATE
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

      checklist: Array.isArray(parsed.checklist)
        ? parsed.checklist
        : clone(defaultState.checklist),

      activity: Array.isArray(parsed.activity)
        ? parsed.activity
        : clone(defaultState.activity),

      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : clone(defaultState.notifications)
    };
  } catch (error) {
    console.error("MyService storage error:", error);
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
  if (!state.currentUser) {
    return null;
  }

  return (
    state.employees.find(
      employee =>
        employee.id === state.currentUser.id
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

function notify(
  title,
  message
) {
  state.notifications.unshift({
    id: uid("notification"),
    title,
    message,
    time: new Date().toLocaleString(),
    read: false
  });

  state.notifications =
    state.notifications.slice(0, 100);

  saveState();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {
  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  document
    .querySelectorAll(".nav")
    .forEach(button => {
      button.classList.remove("active");
    });

  const section = $(sectionId);

  if (section) {
    section.classList.add("active");
  }

  const navButton =
    document.querySelector(
      `.nav[onclick*="'${sectionId}'"]`
    );

  if (navButton) {
    navButton.classList.add("active");
  }

  const sidebar = $("sidebar");

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  renderEverything();
}

function toggleSidebar() {
  const sidebar = $("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

window.showSection = showSection;
window.toggleSidebar = toggleSidebar;


/* =========================================================
   DATE / TIME
   ========================================================= */

function updateDateTime() {
  const now = new Date();

  setText(
    "currentDate",
    now.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    )
  );

  setText(
    "currentTime",
    now.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      }
    )
  );

  setText(
    "liveClock",
    now.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      }
    )
  );
}

setInterval(
  updateDateTime,
  1000
);


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {
  const completed =
    state.jobs.filter(
      job =>
        job.status === "Completed"
    );

  const open =
    state.jobs.filter(
      job =>
        job.status !== "Completed" &&
        job.status !== "Cancelled"
    );

  const revenue =
    completed.reduce(
      (total, job) =>
        total +
        Number(job.price || 0),
      0
    );

  const working =
    state.employees.filter(
      employee =>
        employee.status === "Clocked In" ||
        employee.status === "Lunch"
    );

  setText(
    "todayRevenue",
    money(revenue)
  );

  setText(
    "jobsCompleted",
    completed.length
  );

  setText(
    "jobsRemaining",
    open.length
  );

  setText(
    "employeesWorking",
    working.length
  );

  renderEmployeeStatus();
  renderDashboardActivity();
  renderWeeklyChart();
  renderCashSummary();
}

function renderEmployeeStatus() {
  const container =
    $("employeeStatus");

  if (!container) {
    return;
  }

  if (!state.employees.length) {
    container.innerHTML =
      "<p>No employees.</p>";

    return;
  }

  container.innerHTML =
    state.employees
      .map(employee => `
        <div class="list-row">
          <div>
            <strong>
              ${escapeHTML(employee.name)}
            </strong>

            <small>
              ${escapeHTML(employee.role)}
            </small>
          </div>

          <span class="pill">
            ${escapeHTML(employee.status)}
          </span>
        </div>
      `)
      .join("");
}

function renderDashboardActivity() {
  const container =
    $("dashboardActivity");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.activity
      .slice(0, 5)
      .map(item => `
        <div class="list-row">
          <div>
            <strong>
              ${escapeHTML(item.icon)}
              ${escapeHTML(item.title)}
            </strong>

            <small>
              ${escapeHTML(item.description)}
            </small>
          </div>

          <small>
            ${escapeHTML(item.time)}
          </small>
        </div>
      `)
      .join("");
}

function renderWeeklyChart() {
  const weekly =
    $("weeklyChart");

  const report =
    $("reportChart");

  const values = [
    420,
    580,
    350,
    760,
    640,
    890,
    510
  ];

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  const max =
    Math.max(...values);

  const chartHTML =
    values
      .map((value, index) => `
        <div class="chart-column">
          <div
            class="chart-bar"
            style="
              height:${Math.max(
                12,
                (value / max) * 140
              )}px;
            "
            title="${money(value)}"
          ></div>

          <small>
            ${days[index]}
          </small>
        </div>
      `)
      .join("");

  if (weekly) {
    weekly.innerHTML =
      chartHTML;
  }

  if (report) {
    report.innerHTML =
      chartHTML;
  }
}


/* =========================================================
   ORDERS
   ========================================================= */

function renderJobs() {
  const container =
    $("jobList");

  if (!container) {
    return;
  }

  if (!state.jobs.length) {
    container.innerHTML = `
      <div class="panel">
        <p>No orders yet.</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    state.jobs
      .map(job => `
        <div class="panel">

          <div class="panel-header">

            <div>
              <h2>
                ${escapeHTML(job.customer)}
              </h2>

              <p>
                ${escapeHTML(job.orderType || "Order")}
              </p>
            </div>

            <span class="pill">
              ${escapeHTML(job.status)}
            </span>

          </div>

          <p>
            <strong>Order:</strong>
            ${escapeHTML(job.order || "")}
          </p>

          <p>
            <strong>Assigned:</strong>
            ${escapeHTML(job.employee || "Unassigned")}
          </p>

          <p>
            <strong>Time:</strong>
            ${escapeHTML(job.time || "")}
          </p>

          <p>
            <strong>Total:</strong>
            ${money(job.price)}
          </p>

          ${
            job.status !== "Completed"
              ? `
                <button
                  class="primary-button"
                  onclick="completeJob('${job.id}')"
                >
                  Complete Order
                </button>
              `
              : ""
          }

        </div>
      `)
      .join("");
}

function addJob() {
  const customer =
    prompt(
      "Customer name:",
      "Walk-In Customer"
    );

  if (!customer) {
    return;
  }

  const orderType =
    prompt(
      "Order type: Dine-In, Takeout, Delivery",
      "Dine-In"
    ) || "Dine-In";

  const order =
    prompt(
      "Order items:"
    );

  if (!order) {
    return;
  }

  const employee =
    prompt(
      "Assigned employee:",
      state.currentUser?.name ||
        "Unassigned"
    ) || "Unassigned";

  const time =
    prompt(
      "Order time:",
      new Date().toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit"
        }
      )
    ) || "";

  const price =
    Number(
      prompt(
        "Order total:",
        "0"
      ) || 0
    );

  state.jobs.unshift({
    id: uid("job"),
    customer:
      customer.trim(),
    orderType:
      orderType.trim(),
    order:
      order.trim(),
    employee:
      employee.trim(),
    time:
      time.trim(),
    status: "Open",
    price
  });

  addActivity(
    "Order created",
    `${customer.trim()} — ${order.trim()}`,
    "🍽️"
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
    "Order completed",
    `${job.customer} — ${job.order}`,
    "✓"
  );

  notify(
    "Order completed",
    `${job.customer}'s order was completed.`
  );

  saveState();
  renderEverything();
}

window.addJob = addJob;
window.completeJob = completeJob;


/* =========================================================
   SCHEDULE
   ========================================================= */

function renderSchedule() {
  const container =
    $("scheduleGrid");

  if (!container) {
    return;
  }

  const jobs =
    [...state.jobs];

  if (!jobs.length) {
    container.innerHTML =
      "<p>No scheduled items.</p>";

    return;
  }

  container.innerHTML =
    jobs
      .map(job => `
        <div class="panel">

          <strong>
            ${escapeHTML(job.time || "Unscheduled")}
          </strong>

          <p>
            ${escapeHTML(job.customer)}
          </p>

          <p>
            ${escapeHTML(job.orderType)}
          </p>

          <span class="pill">
            ${escapeHTML(job.status)}
          </span>

        </div>
      `)
      .join("");
}


/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {
  const container =
    $("customerList");

  if (!container) {
    return;
  }

  const search =
    (
      $("customerSearch")?.value ||
      ""
    )
      .trim()
      .toLowerCase();

  const customers =
    state.customers.filter(customer => {
      const text = `
        ${customer.name}
        ${customer.phone}
        ${customer.email}
      `.toLowerCase();

      return text.includes(search);
    });

  if (!customers.length) {
    container.innerHTML =
      "<p>No customers found.</p>";

    return;
  }

  container.innerHTML =
    customers
      .map(customer => `
        <div class="list-row">

          <div>

            <strong>
              ${escapeHTML(customer.name)}
            </strong>

            <small>
              ${escapeHTML(customer.phone || "")}
            </small>

            <small>
              ${escapeHTML(customer.email || "")}
            </small>

          </div>

        </div>
      `)
      .join("");
}

function addCustomer() {
  const name =
    prompt(
      "Customer name:"
    );

  if (!name) {
    return;
  }

  const phone =
    prompt(
      "Phone number:"
    ) || "";

  const email =
    prompt(
      "Email:"
    ) || "";

  const notes =
    prompt(
      "Customer notes:"
    ) || "";

  state.customers.unshift({
    id: uid("customer"),
    name:
      name.trim(),
    phone:
      phone.trim(),
    email:
      email.trim(),
    notes:
      notes.trim()
  });

  addActivity(
    "Customer added",
    `${name.trim()} was added.`,
    "👤"
  );

  saveState();
  renderEverything();
}

window.addCustomer = addCustomer;
window.renderCustomers = renderCustomers;


/* =========================================================
   EMPLOYEES
   ========================================================= */

function renderEmployees() {
  const container =
    $("employeeGrid");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.employees
      .map(employee => `
        <div class="panel">

          <h2>
            ${escapeHTML(employee.name)}
          </h2>

          <p>
            ${escapeHTML(employee.role)}
          </p>

          <span class="pill">
            ${escapeHTML(employee.status)}
          </span>

          <p>
            Total Hours:
            <strong>
              ${Number(
                employee.totalHours || 0
              ).toFixed(2)}
            </strong>
          </p>

        </div>
      `)
      .join("");
}


/* =========================================================
   ACCOUNT CREATION
   ========================================================= */

function createAccount() {
  if (
    state.currentUser &&
    !isAdmin()
  ) {
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
    alert(
      "Role must be Admin, Manager, or Employee."
    );

    return;
  }

  const id =
    uid(
      role.toLowerCase()
    );

  state.users.push({
    id,
    name:
      name.trim(),
    email:
      email
        .trim()
        .toLowerCase(),
    password,
    role,
    active: true
  });

  if (
    role === "Manager" ||
    role === "Employee"
  ) {
    state.employees.push({
      id,
      name:
        name.trim(),
      role,
      status: "Off Clock",
      clockIn: null,
      lunchStart: null,
      totalHours: 0
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

window.createAccount = createAccount;


/* =========================================================
   TIME CLOCK
   ========================================================= */

function addPunch(
  employee,
  type
) {
  state.punches.unshift({
    id: uid("punch"),
    employeeId:
      employee.id,
    employeeName:
      employee.name,
    type,
    timestamp:
      new Date().toISOString()
  });
}

function toggleClock() {
  const employee =
    currentEmployee();

  if (!employee) {
    alert(
      "This account does not have an employee time-clock profile."
    );

    return;
  }

  if (
    employee.status === "Clocked In" ||
    employee.status === "Lunch"
  ) {
    clockOut();
  } else {
    clockIn();
  }
}

function clockIn() {
  const employee =
    currentEmployee();

  if (!employee) {
    alert(
      "No employee profile connected to this account."
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

  employee.lunchStart =
    null;

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
      "You are not currently clocked in."
    );

    return;
  }

  const start =
    new Date(
      employee.clockIn
    ).getTime();

  const hours =
    Math.max(
      0,
      (Date.now() - start) /
        3600000
    );

  employee.totalHours =
    Number(
      (
        Number(
          employee.totalHours ||
            0
        ) + hours
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

  employee.clockIn =
    null;

  employee.lunchStart =
    null;

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
      "You must be clocked in first."
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
    "🍽️"
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
      "No lunch break is active."
    );

    return;
  }

  employee.status =
    "Clocked In";

  employee.lunchStart =
    null;

  addPunch(
    employee,
    "End Lunch"
  );

  addActivity(
    "Lunch ended",
    `${employee.name} returned from lunch.`,
    "✓"
  );

  saveState();
  renderEverything();
}

window.toggleClock = toggleClock;
window.clockIn = clockIn;
window.clockOut = clockOut;
window.startLunch = startLunch;
window.endLunch = endLunch;


/* =========================================================
   TIME CLOCK DISPLAY
   ========================================================= */

function renderTimeClock() {
  const employee =
    currentEmployee();

  if (!employee) {
    setText(
      "clockStatus",
      "ADMIN ACCOUNT"
    );

    setText(
      "clockMessage",
      "Admin accounts do not require an employee punch profile."
    );

    return;
  }

  setText(
    "clockStatus",
    employee.status.toUpperCase()
  );

  const button =
    $("clockButton");

  if (button) {
    button.textContent =
      employee.status === "Off Clock"
        ? "CLOCK IN"
        : "CLOCK OUT";
  }

  if (
    employee.status === "Off Clock"
  ) {
    setText(
      "clockMessage",
      "Your exact punch time will be recorded."
    );
  } else {
    setText(
      "clockMessage",
      `Currently ${employee.status}.`
    );
  }

  renderPunchTables();
}

function renderPunchTables() {
  const adminTable =
    $("punchTable");

  if (adminTable) {
    adminTable.innerHTML =
      state.employees
        .map(employee => {
          const employeePunches =
            state.punches.filter(
              punch =>
                punch.employeeId ===
                employee.id
            );

          const lastIn =
            employeePunches.find(
              punch =>
                punch.type ===
                "Clock In"
            );

          const lastOut =
            employeePunches.find(
              punch =>
                punch.type ===
                "Clock Out"
            );

          return `
            <tr>
              <td>
                ${escapeHTML(employee.name)}
              </td>

              <td>
                ${escapeHTML(employee.status)}
              </td>

              <td>
                ${
                  lastIn
                    ? new Date(
                        lastIn.timestamp
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit"
                        }
                      )
                    : "—"
                }
              </td>

              <td>
                ${
                  lastOut
                    ? new Date(
                        lastOut.timestamp
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit"
                        }
                      )
                    : "—"
                }
              </td>

              <td>
                ${Number(
                  employee.totalHours || 0
                ).toFixed(2)} hrs
              </td>
            </tr>
          `;
        })
        .join("");
  }

  const myTable =
    $("myPunchLog");

  if (myTable) {
    const employee =
      currentEmployee();

    const punches =
      employee
        ? state.punches.filter(
            punch =>
              punch.employeeId ===
              employee.id
          )
        : [];

    myTable.innerHTML =
      punches.length
        ? punches
            .map(punch => `
              <tr>

                <td>
                  ${new Date(
                    punch.timestamp
                  ).toLocaleDateString()}
                </td>

                <td colspan="2">
                  ${escapeHTML(punch.type)}
                  —
                  ${new Date(
                    punch.timestamp
                  ).toLocaleTimeString()}
                </td>

                <td>—</td>

                <td>—</td>

                <td>—</td>

              </tr>
            `)
            .join("")
        : `
          <tr>
            <td colspan="6">
              No punches yet.
            </td>
          </tr>
        `;

    if (employee) {
      setText(
        "todayHours",
        Number(
          employee.totalHours || 0
        ).toFixed(2)
      );

      setText(
        "weekHours",
        `${Number(
          employee.totalHours || 0
        ).toFixed(2)} hrs`
      );
    }
  }
}


/* =========================================================
   DAILY CHECKLIST
   ========================================================= */

function renderChecklist() {
  const container =
    $("checklistJobs");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.checklist
      .map(item => `
        <div class="list-row">

          <div>
            <strong>
              ${escapeHTML(item.title)}
            </strong>
          </div>

          <button
            class="${
              item.completed
                ? "outline-button"
                : "primary-button"
            }"
            onclick="toggleChecklist('${item.id}')"
          >
            ${
              item.completed
                ? "Completed ✓"
                : "Complete"
            }
          </button>

        </div>
      `)
      .join("");
}

function toggleChecklist(id) {
  const item =
    state.checklist.find(
      entry =>
        entry.id === id
    );

  if (!item) {
    return;
  }

  item.completed =
    !item.completed;

  addActivity(
    item.completed
      ? "Checklist task completed"
      : "Checklist task reopened",
    item.title,
    item.completed
      ? "✓"
      : "↻"
  );

  saveState();
  renderEverything();
}

window.toggleChecklist =
  toggleChecklist;


/* =========================================================
   CASH DROPS
   ========================================================= */

function expectedCashTotal() {
  return state.jobs
    .filter(
      job =>
        job.status === "Completed"
    )
    .reduce(
      (total, job) =>
        total +
        Number(job.price || 0),
      0
    );
}

function depositedCashTotal() {
  return state.cashDrops.reduce(
    (total, drop) =>
      total +
      Number(drop.amount || 0),
    0
  );
}

function renderCashSummary() {
  const expected =
    expectedCashTotal();

  const deposited =
    depositedCashTotal();

  const difference =
    deposited - expected;

  setText(
    "expectedCash",
    money(expected)
  );

  setText(
    "actualCash",
    money(deposited)
  );

  setText(
    "cashExpected",
    money(expected)
  );

  setText(
    "cashDeposited",
    money(deposited)
  );

  setText(
    "cashOverUnder",
    money(difference)
  );

  const differenceBox =
    $("cashDifference");

  if (differenceBox) {
    if (
      Math.abs(difference) < 0.01
    ) {
      differenceBox.textContent =
        "$0.00 — BALANCED";

      differenceBox.className =
        "difference balanced";
    } else if (difference > 0) {
      differenceBox.textContent =
        `${money(difference)} — OVER`;

      differenceBox.className =
        "difference";
    } else {
      differenceBox.textContent =
        `${money(
          Math.abs(difference)
        )} — UNDER`;

      differenceBox.className =
        "difference";
    }
  }

  renderCashDrops();
}

function newCashDrop() {
  if (!isManagerOrAdmin()) {
    alert(
      "Manager or Admin access required."
    );

    return;
  }

  const amount =
    Number(
      prompt(
        "Cash drop amount:"
      ) || 0
    );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    alert(
      "Enter a valid amount."
    );

    return;
  }

  const note =
    prompt(
      "Deposit note:",
      "Register cash drop"
    ) || "";

  state.cashDrops.unshift({
    id: uid("cash"),
    amount,
    note:
      note.trim(),
    employee:
      state.currentUser?.name ||
      "Unknown",
    time:
      new Date().toLocaleString()
  });

  addActivity(
    "Cash drop recorded",
    `${money(amount)} deposited by ${
      state.currentUser?.name ||
      "Unknown"
    }.`,
    "$"
  );

  saveState();
  renderEverything();
}

function renderCashDrops() {
  const container =
    $("cashDropList");

  if (!container) {
    return;
  }

  if (!state.cashDrops.length) {
    container.innerHTML =
      "<p>No cash drops recorded.</p>";

    return;
  }

  container.innerHTML =
    state.cashDrops
      .map(drop => `
        <div class="list-row">

          <div>

            <strong>
              ${money(drop.amount)}
            </strong>

            <small>
              ${escapeHTML(drop.note)}
            </small>

            <small>
              ${escapeHTML(drop.employee)}
              —
              ${escapeHTML(drop.time)}
            </small>

          </div>

        </div>
      `)
      .join("");
}

window.newCashDrop =
  newCashDrop;


/* =========================================================
   ACTIVITY
   ========================================================= */

function renderActivity() {
  const container =
    $("activityList");

  if (!container) {
    return;
  }

  container.innerHTML =
    state.activity
      .slice(0, 50)
      .map(item => `
        <div class="list-row">

          <div>

            <strong>
              ${escapeHTML(item.icon)}
              ${escapeHTML(item.title)}
            </strong>

            <small>
              ${escapeHTML(item.description)}
            </small>

          </div>

          <small>
            ${escapeHTML(item.time)}
          </small>

        </div>
      `)
      .join("");
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function renderNotifications() {
  const section =
    $("notifications");

  if (!section) {
    return;
  }

  let list =
    $("notificationList");

  if (!list) {
    list =
      document.createElement("div");

    list.id =
      "notificationList";

    section.appendChild(list);
  }

  list.innerHTML =
    state.notifications
      .map(notification => `
        <div class="notification-card">

          <strong>
            ${escapeHTML(notification.title)}
          </strong>

          <p>
            ${escapeHTML(notification.message)}
          </p>

          <small>
            ${escapeHTML(notification.time)}
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

  const employeeHours =
    state.employees.reduce(
      (total, employee) =>
        total +
        Number(
          employee.totalHours ||
          0
        ),
      0
    );

  const cashDifference =
    depositedCashTotal() -
    expectedCashTotal();

  setText(
    "reportWeeklyRevenue",
    money(revenue)
  );

  setText(
    "reportJobs",
    completed.length
  );

  setText(
    "reportEmployeeHours",
    employeeHours.toFixed(2)
  );

  setText(
    "reportCashDifference",
    money(cashDifference)
  );
}


/* =========================================================
   LOGIN
   ========================================================= */

function createLoginScreen() {
  if (
    $("myserviceLogin")
  ) {
    return;
  }

  const overlay =
    document.createElement("div");

  overlay.id =
    "myserviceLogin";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:99999;
    background:#f3f7fc;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
  `;

  overlay.innerHTML = `
    <div style="
      width:100%;
      max-width:420px;
      background:white;
      border-radius:24px;
      padding:28px;
      box-shadow:0 20px 60px rgba(0,0,0,.12);
    ">

      <div style="
        font-size:30px;
        font-weight:900;
        margin-bottom:4px;
      ">
        MyService
      </div>

      <div style="
        color:#667085;
        margin-bottom:24px;
      ">
        5 Star Restaurant
      </div>

      <label>
        Email
      </label>

      <input
        id="loginEmail"
        type="email"
        value="admin@myservice.test"
        style="
          width:100%;
          padding:14px;
          margin:8px 0 16px;
          border:1px solid #d0d5dd;
          border-radius:12px;
        "
      >

      <label>
        Password
      </label>

      <input
        id="loginPassword"
        type="password"
        value="admin123"
        style="
          width:100%;
          padding:14px;
          margin:8px 0 20px;
          border:1px solid #d0d5dd;
          border-radius:12px;
        "
      >

      <button
        onclick="login()"
        style="
          width:100%;
          padding:15px;
          border:0;
          border-radius:12px;
          background:#1677ff;
          color:white;
          font-size:16px;
          font-weight:800;
        "
      >
        Sign In
      </button>

      <p style="
        margin-top:20px;
        font-size:12px;
        color:#667085;
      ">
        Demo Admin:
        admin@myservice.test
        /
        admin123
      </p>

    </div>
  `;

  document.body.appendChild(
    overlay
  );
}

function login() {
  const email =
    $("loginEmail")
      ?.value
      .trim()
      .toLowerCase();

  const password =
    $("loginPassword")
      ?.value || "";

  const user =
    state.users.find(
      account =>
        account.active &&
        account.email.toLowerCase() ===
          email &&
        account.password ===
          password
    );

  if (!user) {
    alert(
      "Incorrect email or password."
    );

    return;
  }

  state.currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  saveState();

  const loginScreen =
    $("myserviceLogin");

  if (loginScreen) {
    loginScreen.remove();
  }

  addActivity(
    "User signed in",
    `${user.name} signed in.`,
    "🔐"
  );

  renderEverything();
  showSection("dashboard");
}

function logout() {
  state.currentUser =
    null;

  saveState();

  const button =
    $("myserviceLogout");

  if (button) {
    button.remove();
  }

  createLoginScreen();
}

window.login = login;
window.logout = logout;


/* =========================================================
   LOGOUT BUTTON
   ========================================================= */

function renderLogoutButton() {
  if (!state.currentUser) {
    return;
  }

  let button =
    $("myserviceLogout");

  if (!button) {
    button =
      document.createElement(
        "button"
      );

    button.id =
      "myserviceLogout";

    button.textContent =
      "Log Out";

    button.style.cssText = `
      position:fixed;
      right:12px;
      bottom:12px;
      z-index:5000;
      border:0;
      border-radius:12px;
      padding:10px 14px;
      background:#101828;
      color:white;
      font-weight:800;
      cursor:pointer;
    `;

    button.onclick =
      logout;

    document.body.appendChild(
      button
    );
  }
}


/* =========================================================
   ROLE VISIBILITY
   ========================================================= */

function applyRoleVisibility() {
  if (!state.currentUser) {
    return;
  }

  const role =
    state.currentUser.role;

  const adminOnlySections = [
    "reports",
    "settings"
  ];

  adminOnlySections.forEach(
    sectionId => {
      const section =
        $(sectionId);

      const button =
        document.querySelector(
          `.nav[onclick*="'${sectionId}'"]`
        );

      const allowed =
        role === "Admin";

      if (section) {
        section.dataset.allowed =
          String(allowed);
      }

      if (button) {
        button.style.display =
          allowed
            ? ""
            : "none";
      }
    }
  );

  const cashButton =
    document.querySelector(
      `.nav[onclick*="'cash'"]`
    );

  if (cashButton) {
    cashButton.style.display =
      isManagerOrAdmin()
        ? ""
        : "none";
  }
}


/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile() {
  if (!state.currentUser) {
    return;
  }

  const profileName =
    document.querySelector(
      ".profile-name"
    );

  const avatar =
    document.querySelector(
      ".avatar"
    );

  if (profileName) {
    profileName.textContent =
      state.currentUser.name;
  }

  if (avatar) {
    avatar.textContent =
      state.currentUser.name
        .charAt(0)
        .toUpperCase();
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

  renderProfile();
  applyRoleVisibility();

  renderDashboard();
  renderJobs();
  renderSchedule();
  renderCustomers();
  renderEmployees();
  renderTimeClock();
  renderChecklist();
  renderCashSummary();
  renderActivity();
  renderNotifications();
  renderReports();
  renderLogoutButton();

  updateDateTime();
}


/* =========================================================
   APP START
   ========================================================= */

function startMyService() {
  updateDateTime();

  if (state.currentUser) {
    renderEverything();
    showSection("dashboard");
  } else {
    createLoginScreen();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  startMyService
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

if ("serviceWorker" in navigator) {
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
