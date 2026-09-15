/* =========================================================
   MYDETAIL — MVP APPLICATION
   Universal detailing/business management platform
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
      location: null
    },
    {
      id: "manager-1",
      name: "Manager Demo",
      role: "Manager",
      status: "Off Clock",
      hours: 0,
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
      id: Date.now(),
      title: "MyDetail workspace loaded",
      description: "MVP dashboard is ready.",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      }),
      icon: "✓"
    }
  ]
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(defaultState);
    }

    const parsed = JSON.parse(saved);

    return {
      ...structuredClone(defaultState),
      ...parsed
    };
  } catch (error) {
    console.error("MyDetail storage error:", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
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

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function isAdmin() {
  return state.currentUser?.role === "Admin";
}

function isManagerOrAdmin() {
  return ["Admin", "Manager"].includes(state.currentUser?.role);
}

function canCreateAccounts() {
  return isAdmin();
}

function addActivity(title, description, icon = "•") {
  state.activity.unshift({
    id: Date.now(),
    title,
    description,
    time: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    }),
    icon
  });

  state.activity = state.activity.slice(0, 50);

  saveState();
}

function notify(title, message) {
  state.notifications.unshift({
    id: Date.now(),
    title,
    message,
    read: false,
    time: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    })
  });

  state.notifications = state.notifications.slice(0, 50);

  saveState();
}

/* =========================================================
   ROLE PERMISSIONS
   ========================================================= */

const permissions = {
  Admin: {
    createAccounts: true,
    viewLocations: true,
    viewFinancials: true,
    manageSettings: true,
    manageEmployees: true
  },

  Manager: {
    createAccounts: false,
    viewLocations: true,
    viewFinancials: true,
    manageSettings: false,
    manageEmployees: false
  },

  Employee: {
    createAccounts: false,
    viewLocations: false,
    viewFinancials: false,
    manageSettings: false,
    manageEmployees: false
  }
};

function hasPermission(permission) {
  if (!state.currentUser) return false;

  return !!permissions[state.currentUser.role]?.[permission];
}

/* =========================================================
   LOGIN
   ========================================================= */

function createLoginScreen() {
  if (document.getElementById("mydetail-login")) return;

  const overlay = document.createElement("div");

  overlay.id = "mydetail-login";

  overlay.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      z-index:99999;
      background:#f7f8fa;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      font-family:Arial,sans-serif;
    ">
      <div style="
        width:100%;
        max-width:420px;
        background:white;
        border-radius:20px;
        padding:30px;
        box-shadow:0 20px 60px rgba(0,0,0,.12);
      ">

        <div style="text-align:center;margin-bottom:25px;">
          <div style="
            font-size:30px;
            font-weight:800;
            letter-spacing:-1px;
          ">
            MyDetail
          </div>

          <div style="
            margin-top:5px;
            color:#667085;
            font-size:14px;
          ">
            Business Management Platform
          </div>
        </div>

        <form id="mydetail-login-form">

          <label style="display:block;margin-bottom:6px;font-weight:600;">
            Email
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            required
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              border:1px solid #d0d5dd;
              border-radius:10px;
              margin-bottom:15px;
            "
          >

          <label style="display:block;margin-bottom:6px;font-weight:600;">
            Password
          </label>

          <input
            id="login-password"
            type="password"
            placeholder="Password"
            required
            style="
              width:100%;
              box-sizing:border-box;
              padding:13px;
              border:1px solid #d0d5dd;
              border-radius:10px;
              margin-bottom:18px;
            "
          >

          <button
            type="submit"
            style="
              width:100%;
              border:0;
              border-radius:10px;
              padding:14px;
              background:#1677ff;
              color:white;
              font-size:16px;
              font-weight:700;
            "
          >
            Sign In
          </button>

        </form>

        <div style="
          margin-top:20px;
          padding:12px;
          background:#f2f4f7;
          border-radius:10px;
          font-size:12px;
          color:#667085;
        ">
          <strong>Demo accounts</strong><br><br>
          Admin: admin@mydetail.test / admin123<br>
          Manager: manager@mydetail.test / manager123<br>
          Employee: employee@mydetail.test / employee123
        </div>

        <div style="
          margin-top:15px;
          text-align:center;
          font-size:11px;
          color:#98a2b3;
        ">
          MVP login — production authentication will use Supabase Auth.
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document
    .getElementById("mydetail-login-form")
    .addEventListener("submit", login);
}

function login(event) {
  event.preventDefault();

  const email = document
    .getElementById("login-email")
    .value
    .trim()
    .toLowerCase();

  const password =
    document.getElementById("login-password").value;

  const user = state.users.find(
    u =>
      u.email.toLowerCase() === email &&
      u.password === password &&
      u.active
  );

  if (!user) {
    alert("Incorrect email or password.");
    return;
  }

  state.currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  saveState();

  document.getElementById("mydetail-login")?.
    } remove();

  /* =========================================================
   HAMBURGER / MOBILE SIDEBAR
   ========================================================= */

function setupHamburger() {
  let button =
    document.querySelector(
      "#menuButton, #menuToggle, .menu-button, .hamburger, .hamburger-button"
    );

  if (!button) {
    button = document.createElement("button");
    button.id = "mydetail-hamburger";
    button.innerHTML = "☰";

    button.style.cssText = `
      position:fixed;
      left:12px;
      top:12px;
      z-index:5000;
      width:44px;
      height:44px;
      border:0;
      border-radius:10px;
      background:white;
      box-shadow:0 3px 15px rgba(0,0,0,.12);
      font-size:23px;
      cursor:pointer;
    `;

    document.body.appendChild(button);
  }

  if (button.dataset.myDetailBound === "1") return;
  button.dataset.myDetailBound = "1";

  button.addEventListener("click", () => {
    const sidebar =
      document.querySelector(
        ".sidebar, #sidebar, .side-bar, aside"
      );

    if (!sidebar) return;

    sidebar.classList.toggle("open");
    sidebar.style.zIndex = "4000";

    if (sidebar.classList.contains("open")) {
      sidebar.style.display = "block";
    }
  });
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionName) {
  const sections =
    document.querySelectorAll(
      ".page-section, section[data-section], [data-page-section], .page"
    );

  let found = false;

  sections.forEach(section => {
    const id =
      section.dataset.section ||
      section.dataset.pageSection ||
      section.id;

    const matches =
      id === sectionName ||
      id === `${sectionName}Section`;

    section.style.display = matches ? "" : "none";

    section.classList.toggle("active", matches);

    if (matches) found = true;
  });

  document
    .querySelectorAll("[data-section]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.section === sectionName
      );
    });

  const sidebar =
    document.getElementById("sidebar") ||
    document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (!found) {
    console.warn(
      "MyDetail: Section not found:",
      sectionName
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (typeof renderSection === "function") {
    renderSection(sectionName);
  }
}

window.showSection = showSection;


/* =========================================================
   NAVIGATION CLICK HANDLER
   ========================================================= */

function setupNavigation() {
  document.addEventListener("click", event => {
    const button =
      event.target.closest("[data-section]");

    if (!button) return;

    const section =
      button.dataset.section;

    if (!section) return;

    event.preventDefault();

    showSection(section);
  });
}
      "MyDetail: Section not found:",
      sectionName
    );
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (typeof renderSection === "function") {
    renderSection(sectionName);
  }
}

window.showSection = showSection;

    section.style.display = matches ? "" : "none";

    if (matches) found = true;
  });

  document
    .querySelectorAll("[data-section]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.section === sectionName
      );
    });

  if (!found) {
    console.log("Section not found:", sectionName);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  renderSection(sectionName);
}

window.showSection = showSection;

function setupNavigation() {
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-section]");

    if (!button) return;

    const section = button.dataset.section;

    showSection(section);
  });
}

/* =========================================================
   COMPANY NAME
   ========================================================= */

function renderCompanyName() {
  const element = $("companyName");

  if (element) {
    element.textContent = state.companyName;
  }

  document.title = `${state.companyName} — MyDetail`;
}

/* =========================================================
   USER PROFILE
   ========================================================= */

function renderUserProfile() {
  const user = state.currentUser;

  if (!user) return;

  document
    .querySelectorAll(
      "#currentUserName, .current-user-name, #profileName"
    )
    .forEach(el => {
      el.textContent = user.name;
    });

  document
    .querySelectorAll(
      "#currentUserRole, .current-user-role, #profileRole"
    )
    .forEach(el => {
      el.textContent = user.role;
    });
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {
  const completed = state.jobs.filter(
    j => j.status === "Completed"
  );

  const remaining = state.jobs.filter(
    j => j.status !== "Completed"
  );

  const working = state.employees.filter(
    e => e.status === "Working"
  );

  const revenue = completed.reduce(
    (sum, job) => sum + Number(job.price || 0),
    0
  );

  setText("todayRevenue", money(revenue));
  setText("jobsCompleted", completed.length);
  setText("jobsRemaining", remaining.length);
  setText("employeesWorking", working.length);

  renderWeeklyChart();
  renderDashboardActivity();
}

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value;
  }
}

function renderDashboardActivity() {
  const container =
    $("activityList") ||
    document.querySelector(".activity-list");

  if (!container) return;

  container.innerHTML = state.activity
    .slice(0, 8)
    .map(
      item => `
        <div class="activity-item" style="padding:12px 0;border-bottom:1px solid #eee;">
          <strong>${escapeHTML(item.icon)} ${escapeHTML(item.title)}</strong>
          <div style="font-size:13px;color:#667085;">
            ${escapeHTML(item.description)}
          </div>
          <small style="color:#98a2b3;">
            ${escapeHTML(item.time)}
          </small>
        </div>
      `
    )
    .join("");
}

/* =========================================================
   WEEKLY GRAPH
   ========================================================= */

function renderWeeklyChart() {
  const container = $("weeklyChart");

  if (!container) return;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const completed = state.jobs.filter(
    j => j.status === "Completed"
  );

  const values = days.map((day, index) => {
    if (!completed.length) return 0;

    return completed.reduce(
      (sum, job) =>
        sum +
        (index ===
        new Date().getDay()
          ? Number(job.price || 0)
          : 0),
      0
    );
  });

  const max = Math.max(...values, 1);

  container.innerHTML = `
    <div style="
      display:flex;
      align-items:flex-end;
      gap:10px;
      height:180px;
      padding:15px;
    ">
      ${days
        .map((day, index) => {
          const height =
            values[index] === 0
              ? 5
              : Math.max(
                  10,
                  (values[index] / max) * 130
                );

          return `
            <div style="
              flex:1;
              text-align:center;
              height:160px;
              display:flex;
              flex-direction:column;
              justify-content:flex-end;
            ">
              <div style="
                height:${height}px;
                background:#1677ff;
                border-radius:6px 6px 2px 2px;
              "></div>

              <small style="margin-top:6px;">
                ${day}
              </small>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

/* =========================================================
   EMPLOYEES
   ========================================================= */

function renderEmployees() {
  const container =
    $("employeesList") ||
    document.querySelector(".employees-list");

  if (!container) return;

  container.innerHTML = state.employees
    .map(employee => {
      const locationText =
        hasPermission("viewLocations") &&
        employee.location
          ? `${employee.location.lat.toFixed(4)}, ${employee.location.lng.toFixed(4)}`
          : hasPermission("viewLocations")
          ? "No location"
          : "Private";

      return `
        <div class="employee-card" style="
          padding:16px;
          margin-bottom:12px;
          border:1px solid #eaecf0;
          border-radius:12px;
          background:white;
        ">

          <strong>${escapeHTML(employee.name)}</strong>

          <div style="color:#667085;margin-top:4px;">
            ${escapeHTML(employee.role)}
          </div>

          <div style="margin-top:8px;">
            <strong>Status:</strong>
            ${escapeHTML(employee.status)}
          </div>

          <div>
            <strong>Hours:</strong>
            ${Number(employee.hours || 0).toFixed(2)}
          </div>

          ${
            hasPermission("viewLocations")
              ? `<div style="font-size:12px;color:#667085;margin-top:6px;">
                  📍 ${escapeHTML(locationText)}
                </div>`
              : ""
          }

        </div>
      `;
    })
    .join("");

  if (isAdmin()) {
    addAdminEmployeeButton(container);
  }
}

function addAdminEmployeeButton(container) {
  if (document.getElementById("addEmployeeMVP")) return;

  const button = document.createElement("button");

  button.id = "addEmployeeMVP";
  button.textContent = "＋ Create Account";
  button.style.cssText = `
    margin-bottom:15px;
    padding:11px 16px;
    border:0;
    border-radius:9px;
    background:#1677ff;
    color:white;
    font-weight:700;
  `;

  button.onclick = createAccount;

  container.prepend(button);
}

function createAccount() {
  if (!canCreateAccounts()) {
    alert("Only Admins can create accounts.");
    return;
  }

  const name = prompt("Employee/Manager/Admin name:");

  if (!name) return;

  const email = prompt("Email:");

  if (!email) return;

  const password = prompt(
    "Temporary password:"
  );

  if (!password) return;

  const roleInput = prompt(
    "Role: Admin, Manager, or Employee",
    "Employee"
  );

  const role =
    ["Admin", "Manager", "Employee"].find(
      r => r.toLowerCase() === roleInput?.toLowerCase()
    ) || "Employee";

  const newUser = {
    id: uid("user"),
    name,
    email,
    password,
    role,
    active: true
  };

  state.users.push(newUser);

  if (role !== "Admin") {
    state.employees.push({
      id: newUser.id,
      name,
      role,
      status: "Off Clock",
      hours: 0,
      location: null
    });
  }

  addActivity(
    "Account created",
    `${name} was created as ${role}.`,
    "👤"
  );

  notify(
    "New account",
    `${name} was added as ${role}.`
  );

  saveState();
  renderEverything();

  alert(
    `Account created!\n\nEmail: ${email}\nPassword: ${password}\nRole: ${role}`
  );
}

/* =========================================================
   JOBS
   ========================================================= */

function renderJobs() {
  const container =
    $("jobsList") ||
    document.querySelector(".jobs-list");

  if (!container) return;

  container.innerHTML = `
    ${
      isAdmin() || isManagerOrAdmin()
        ? `
          <button
            onclick="createJob()"
            style="
              margin-bottom:15px;
              padding:11px 16px;
              border:0;
              border-radius:9px;
              background:#1677ff;
              color:white;
              font-weight:700;
            "
          >
            ＋ Add Job
          </button>
        `
        : ""
    }

    ${state.jobs
      .map(
        job => `
          <div style="
            padding:15px;
            border:1px solid #eaecf0;
            border-radius:12px;
            margin-bottom:12px;
            background:white;
          ">

            <strong>
              ${escapeHTML(job.vehicle)}
            </strong>

            <div>
              Customer:
              ${escapeHTML(job.customer)}
            </div>

            <div>
              Employee:
              ${escapeHTML(job.employee)}
            </div>

            <div>
              Time:
              ${escapeHTML(job.time)}
            </div>

            <div>
              Price:
              ${money(job.price)}
            </div>

            <div style="margin-top:7px;">
              Status:
              <strong>${escapeHTML(job.status)}</strong>
            </div>

            <div style="margin-top:10px;">

              ${
                job.status !== "Completed"
                  ? `
                    <button
                      onclick="completeJob('${job.id}')"
                      style="
                        padding:8px 12px;
                        border:0;
                        border-radius:8px;
                        background:#12b76a;
                        color:white;
                      "
                    >
                      ✓ Complete
                    </button>
                  `
                  : "✓ Completed"
              }

            </div>

          </div>
        `
      )
      .join("")}
  `;
}

window.createJob = function () {
  if (!isManagerOrAdmin()) {
    alert("Employees cannot create jobs.");
    return;
  }

  const customer =
    prompt("Customer name:");

  if (!customer) return;

  const vehicle =
    prompt("Vehicle:");

  if (!vehicle) return;

  const employee =
    prompt(
      "Assigned employee:",
      state.employees[0]?.name || ""
    );

  const time =
    prompt("Appointment time:", "10:00 AM");

  const price =
    Number(prompt("Job price:", "250")) || 0;

  state.jobs.push({
    id: uid("job"),
    customer,
    vehicle,
    employee,
    time,
    price,
    status: "Scheduled",
    checklist: {},
    beforePhotos: [],
    afterPhotos: []
  });

  addActivity(
    "New job created",
    `${vehicle} scheduled for ${customer}.`,
    "🚗"
  );

  saveState();
  renderEverything();
};

window.completeJob = function (id) {
  const job = state.jobs.find(j => j.id === id);

  if (!job) return;

  job.status = "Completed";

  addActivity(
    "Job completed",
    `${job.vehicle} was marked completed.`,
    "✓"
  );

  notify(
    "Job completed",
    `${job.vehicle} has been completed.`
  );

  saveState();
  renderEverything();
};

/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {
  const container =
    $("customersList") ||
    document.querySelector(".customers-list");

  if (!container) return;

  container.innerHTML = `
    <button
      onclick="createCustomer()"
      style="
        margin-bottom:15px;
        padding:11px 16px;
        border:0;
        border-radius:9px;
        background:#1677ff;
        color:white;
        font-weight:700;
      "
    >
      ＋ Add Customer
    </button>

    ${state.customers
      .map(
        customer => `
          <div style="
            padding:15px;
            border:1px solid #eaecf0;
            border-radius:12px;
            margin-bottom:12px;
            background:white;
          ">
            <strong>${escapeHTML(customer.name)}</strong>

            <div>
              📞 ${escapeHTML(customer.phone)}
            </div>

            ${
              customer.email
                ? `<div>✉️ ${escapeHTML(customer.email)}</div>`
                : ""
            }

            <div>
              🚗 ${escapeHTML(customer.vehicle)}
            </div>
          </div>
        `
      )
      .join("")}
  `;
}

window.createCustomer = function () {
  const name = prompt("Customer name:");

  if (!name) return;

  const phone =
    prompt("Phone:", "(555) 555-0000") || "";

  const email =
    prompt("Email:") || "";

  const vehicle =
    prompt("Vehicle:") || "";

  state.customers.push({
    id: uid("customer"),
    name,
    phone,
    email,
    vehicle
  });

  addActivity(
    "Customer added",
    `${name} was added to customers.`,
    "👤"
  );

  saveState();
  renderEverything();
};

/* =========================================================
   SCHEDULE
   ========================================================= */

function renderSchedule() {
  const container =
    $("scheduleList") ||
    document.querySelector(".schedule-list");

  if (!container) return;

  container.innerHTML = state.jobs
    .slice()
    .sort((a, b) =>
      String(a.time).localeCompare(String(b.time))
    )
    .map(
      job => `
        <div style="
          padding:15px;
          border-left:4px solid #1677ff;
          background:white;
          margin-bottom:10px;
          border-radius:8px;
        ">
          <strong>${escapeHTML(job.time)}</strong>
          —
          ${escapeHTML(job.vehicle)}

          <div style="font-size:13px;color:#667085;">
            ${escapeHTML(job.customer)}
            •
            ${escapeHTML(job.employee)}
          </div>
        </div>
      `
    )
    .join("");
}

/* =========================================================
   CHECKLIST
   ========================================================= */

const interiorChecklist = [
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

function renderChecklist() {
  const container =
    $("checklistList") ||
    document.querySelector(".checklist-list");

  if (!container) return;

  const visibleJobs =
    state.currentUser?.role === "Employee"
      ? state.jobs.filter(
          job =>
            job.employee === state.currentUser.name &&
            job.status !== "Completed"
        )
      : state.jobs.filter(
          job => job.status !== "Completed"
        );

  if (!visibleJobs.length) {
    container.innerHTML = `
      <div style="padding:20px;color:#667085;">
        No scheduled interior-detail jobs.
      </div>
    `;

    return;
  }

  container.innerHTML = visibleJobs
    .map(job => {
      job.checklist ||= {};

      const completeCount =
        interiorChecklist.filter(
          item => job.checklist[item]
        ).length;

      return `
        <div style="
          padding:18px;
          background:white;
          border:1px solid #eaecf0;
          border-radius:14px;
          margin-bottom:18px;
        ">

          <h3 style="margin-top:0;">
            ${escapeHTML(job.vehicle)}
          </h3>

          <div style="
            color:#667085;
            margin-bottom:12px;
          ">
            ${escapeHTML(job.customer)}
            •
            ${completeCount}/${interiorChecklist.length}
            complete
          </div>

          ${interiorChecklist
            .map(
              item => `
                <label style="
                  display:flex;
                  gap:10px;
                  align-items:center;
                  padding:9px 0;
                  border-bottom:1px solid #f2f4f7;
                ">

                  <input
                    type="checkbox"
                    ${
                      job.checklist[item]
                        ? "checked"
                        : ""
                    }
                    onchange="toggleChecklist('${job.id}', ${JSON.stringify(
                      item
                    )})"
                  >

                  <span>
                    ${escapeHTML(item)}
                  </span>

                </label>
              `
            )
            .join("")}

          <div style="margin-top:15px;">

            <button
              onclick="photoPicker('${job.id}','before')"
              style="
                padding:9px 12px;
                border:1px solid #d0d5dd;
                border-radius:8px;
                background:white;
              "
            >
              📷 Before Photos
            </button>

            <button
              onclick="photoPicker('${job.id}','after')"
              style="
                padding:9px 12px;
                border:1px solid #d0d5dd;
                border-radius:8px;
                background:white;
              "
            >
              📷 After Photos
            </button>

          </div>

          <div style="
            margin-top:8px;
            font-size:12px;
            color:#667085;
          ">
            Before: ${job.beforePhotos?.length || 0}
            •
            After: ${job.afterPhotos?.length || 0}
          </div>

        </div>
      `;
    })
    .join("");
}

window.toggleChecklist = function (jobId, item) {
  const job = state.jobs.find(
    j => j.id === jobId
  );

  if (!job) return;

  job.checklist ||= {};

  job.checklist[item] =
    !job.checklist[item];

  saveState();
  renderChecklist();

  addActivity(
    "Checklist updated",
    `${item} marked ${
      job.checklist[item]
        ? "complete"
        : "not complete"
    }.`,
    "☑"
  );
};

window.photoPicker = function (jobId, type) {
  const input =
    document.createElement("input");

  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;

  input.onchange = () => {
    const job =
      state.jobs.find(j => j.id === jobId);

    if (!job) return;

    const names =
      Array.from(input.files).map(
        file => file.name
      );

    if (type === "before") {
      job.beforePhotos ||= [];
      job.beforePhotos.push(...names);
    } else {
      job.afterPhotos ||= [];
      job.afterPhotos.push(...names);
    }

    addActivity(
      "Photos added",
      `${names.length} ${type} photo(s) added to ${job.vehicle}.`,
      "📷"
    );

    saveState();
    renderChecklist();
  };

  input.click();
};

/* =========================================================
   TIME CLOCK
   ========================================================= */

function renderClock() {
  const user = state.currentUser;

  if (!user) return;

  const employee =
    state.employees.find(
      e => e.id === user.id
    );

  if (!employee) return;

  const button =
    $("clockButton") ||
    document.querySelector(
      "#clockButton, .clock-button"
    );

  if (button) {
    button.textContent =
      employee.status === "Working"
        ? "Clock Out"
        : "Clock In";

    button.onclick = toggleClock;
  }

  setText(
    "clockStatus",
    employee.status
  );

  if (employee.status === "Working") {
    startHoursTimer();
  }
}

function toggleClock() {
  const user = state.currentUser;

  if (!user) return;

  const employee =
    state.employees.find(
      e => e.id === user.id
    );

  if (!employee) {
    alert("No employee record exists for this account.");
    return;
  }

  if (employee.status === "Working") {
    clockOut(employee);
  } else {
    clockIn(employee);
  }
}

function clockIn(employee) {
  employee.status = "Working";

  employee.clockIn = new Date().toISOString();

  employee.location = null;

  if (
    navigator.geolocation &&
    isManagerOrAdmin() === false
  ) {
    navigator.geolocation.getCurrentPosition(
      position => {
        employee.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        saveState();
      },
      () => {
        saveState();
      }
    );
  }

  state.punches.unshift({
    id: uid("punch"),
    employeeId: employee.id,
    employee: employee.name,
    clockIn: employee.clockIn,
    clockOut: null,
    breaks: []
  });

  addActivity(
    `${employee.name} clocked in`,
    "Employee started their shift.",
    "🕐"
  );

  notify(
    "Employee clocked in",
    `${employee.name} is now working.`
  );

  saveState();
  renderEverything();
}

function clockOut(employee) {
  employee.status = "Off Clock";

  const punch =
    state.punches.find(
      p =>
        p.employeeId === employee.id &&
        !p.clockOut
    );

  if (punch) {
    punch.clockOut =
      new Date().toISOString();

    const start =
      new Date(punch.clockIn);

    const end =
      new Date(punch.clockOut);

    const hours =
      (end - start) /
      1000 /
      60 /
      60;

    employee.hours =
      Number(employee.hours || 0) +
      Math.max(0, hours);
  }

  employee.clockIn = null;

  addActivity(
    `${employee.name} clocked out`,
    "Employee ended their shift.",
    "✓"
  );

  notify(
    "Employee clocked out",
    `${employee.name} is no longer working.`
  );

  saveState();
  renderEverything();
}

function startHoursTimer() {
  const element =
    $("currentHours");

  if (!element) return;

  const update = () => {
    const user = state.currentUser;

    const employee =
      state.employees.find(
        e => e.id === user?.id
      );

    if (
      !employee ||
      !employee.clockIn
    ) {
      return;
    }

    const hours =
      (Date.now() -
        new Date(employee.clockIn).getTime()) /
      1000 /
      60 /
      60;

    element.textContent =
      `${hours.toFixed(2)} hrs`;
  };

  update();

  clearInterval(
    window.myDetailHoursTimer
  );

  window.myDetailHoursTimer =
    setInterval(update, 1000);
}

/* =========================================================
   PUNCH LOG
   ========================================================= */

function renderPunchLog() {
  const container =
    $("punchHistory") ||
    document.querySelector(".punch-history");

  if (!container) return;

  let punches = state.punches;

  if (state.currentUser?.role === "Employee") {
    punches =
      punches.filter(
        p =>
          p.employeeId ===
          state.currentUser.id
      );
  }

  container.innerHTML = punches
    .slice(0, 50)
    .map(
      punch => `
        <div style="
          padding:14px;
          border-bottom:1px solid #eaecf0;
        ">
          <strong>
            ${escapeHTML(punch.employee)}
          </strong>

          <div>
            In:
            ${new Date(
              punch.clockIn
            ).toLocaleString()}
          </div>

          <div>
            Out:
            ${
              punch.clockOut
                ? new Date(
                    punch.clockOut
                  ).toLocaleString()
                : "Currently working"
            }
          </div>

          <button
            onclick="requestPunchCorrection('${punch.id}')"
            style="
              margin-top:7px;
              padding:6px 10px;
              border:1px solid #d0d5dd;
              border-radius:7px;
              background:white;
            "
          >
            Request Correction
          </button>

        </div>
      `
    )
    .join("");
}

window.requestPunchCorrection =
  function (id) {
    const punch =
      state.punches.find(
        p => p.id === id
      );

    if (!punch) return;

    addActivity(
      "Punch correction requested",
      `${punch.employee} requested a punch correction.`,
      "📝"
    );

    notify(
      "Punch correction",
      `${punch.employee} requested a correction.`
    );

    saveState();

    alert(
      "Correction request submitted to management."
    );
  };

/* =========================================================
   CASH DROPS
   ========================================================= */

function renderCashDrops() {
  const container =
    $("cashDifference")?.parentElement ||
    document.querySelector(".cash-drops");

  if (!container) return;

  if (!hasPermission("viewFinancials")) {
    container.innerHTML = `
      <div style="
        padding:20px;
        background:#fff3cd;
        border-radius:10px;
      ">
        Financial information is restricted.
      </div>
    `;

    return;
  }

  const totalExpected =
    state.cashDrops.reduce(
      (sum, drop) =>
        sum + Number(drop.expected || 0),
      0
    );

  const totalDeposited =
    state.cashDrops.reduce(
      (sum, drop) =>
        sum + Number(drop.deposited || 0),
      0
    );

  const net =
    totalDeposited - totalExpected;

  container.innerHTML = `
    <div style="
      padding:18px;
      background:white;
      border-radius:14px;
      border:1px solid #eaecf0;
    ">

      <button
        onclick="createCashDrop()"
        style="
          padding:11px 16px;
          border:0;
          border-radius:9px;
          background:#1677ff;
          color:white;
          font-weight:700;
        "
      >
        ＋ New Cash Drop
      </button>

      <div style="
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:10px;
        margin:15px 0;
      ">

        <div>
          <small>Total Expected</small>
          <strong>${money(totalExpected)}</strong>
        </div>

        <div>
          <small>Total Deposited</small>
          <strong>${money(totalDeposited)}</strong>
        </div>

        <div>
          <small>Net</small>
          <strong>
            ${net >= 0 ? "+" : ""}
            ${money(net)}
          </strong>
        </div>

      </div>

      ${state.cashDrops
        .map(drop => {
          const difference =
            Number(drop.deposited) -
            Number(drop.expected);

          const label =
            difference === 0
              ? "BALANCED"
              : difference < 0
              ? `${money(difference)} UNDER`
              : `+${money(difference)} OVER`;

          return `
            <div style="
              padding:14px;
              border-top:1px solid #eaecf0;
            ">

              <strong>
                ${escapeHTML(drop.employee)}
              </strong>

              <div>
                Expected:
                ${money(drop.expected)}
              </div>

              <div>
                Deposited:
                ${money(drop.deposited)}
              </div>

              <div>
                Result:
                <strong>${label}</strong>
              </div>

              <div style="
                font-size:12px;
                color:#667085;
              ">
                ${escapeHTML(drop.bank || "Bank not specified")}
              </div>

              <div style="
                font-size:12px;
                color:#667085;
              ">
                Photos:
                ${drop.photos?.length || 0}
              </div>

            </div>
          `;
        })
        .join("")}

    </div>
  `;
}

window.createCashDrop = function () {
  if (!hasPermission("viewFinancials")) {
    alert("Financial access is restricted.");
    return;
  }

  const expected =
    Number(
      prompt("Expected cash amount:")
    ) || 0;

  const deposited =
    Number(
      prompt("Actual deposited amount:")
    ) || 0;

  const bank =
    prompt("Bank/location:") || "";

  const slip =
    prompt("Deposit slip number:") || "";

  const photos =
    prompt(
      "Deposit photo file name(s), separated by commas:"
    ) || "";

  const difference =
    deposited - expected;

  state.cashDrops.unshift({
    id: uid("cash"),
    expected,
    deposited,
    bank,
    slip,
    employee:
      state.currentUser?.name || "Unknown",
    photos:
      photos
        .split(",")
        .map(x => x.trim())
        .filter(Boolean),
    difference,
    createdAt:
      new Date().toISOString()
  });

  const result =
    difference === 0
      ? "BALANCED"
      : difference < 0
      ? `${money(difference)} UNDER`
      : `+${money(difference)} OVER`;

  addActivity(
    "Cash drop submitted",
    `Deposit recorded: ${result}.`,
    "💵"
  );

  if (difference !== 0) {
    notify(
      "Cash discrepancy",
      `Cash drop is ${result}.`
    );
  }

  saveState();
  renderEverything();
};

/* =========================================================
   PTO / SICK LEAVE
   ========================================================= */

function renderPTO() {
  let section =
    document.getElementById("ptoSection");

  if (!section) {
    section = document.createElement("section");

    section.id = "ptoSection";
    section.className = "page-section";
    section.style.padding = "20px";

    document.body.appendChild(section);
  }

  const requests =
    state.ptoRequests.filter(
      request =>
        state.currentUser?.role !== "Employee" ||
        request.employeeId ===
          state.currentUser.id
    );

  section.innerHTML = `
    <div style="
      max-width:1000px;
      margin:auto;
    ">

      <h2>Time Off / PTO</h2>

      <div style="
        background:white;
        border:1px solid #eaecf0;
        border-radius:14px;
        padding:18px;
        margin-bottom:15px;
      ">

        <p>
          Employees can submit time-off requests here.
          Your company's PTO policy can be configured by an Admin.
        </p>

        <button
          onclick="requestPTO()"
          style="
            padding:11px 16px;
            border:0;
            border-radius:9px;
            background:#1677ff;
            color:white;
            font-weight:700;
          "
        >
          ＋ Request Time Off
        </button>

      </div>

      <div style="
        background:white;
        border:1px solid #eaecf0;
        border-radius:14px;
        padding:18px;
      ">

        <h3>Requests</h3>

        ${
          requests.length
            ? requests
                .map(
                  request => `
                    <div style="
                      padding:13px 0;
                      border-bottom:1px solid #eaecf0;
                    ">

                      <strong>
                        ${escapeHTML(
                          request.employee
                        )}
                      </strong>

                      <div>
                        ${escapeHTML(
                          request.type
                        )}
                        —
                        ${escapeHTML(
                          request.date
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
                        isAdmin()
                          ? `
                            <button
                              onclick="approvePTO('${request.id}')"
                              style="
                                margin-top:7px;
                                padding:7px 10px;
                                border:0;
                                border-radius:7px;
                                background:#12b76a;
                                color:white;
                              "
                            >
                              Approve
                            </button>
                          `
                          : ""
                      }

                    </div>
                  `
                )
                .join("")
            : `<p style="color:#667085;">No requests yet.</p>`
        }

      </div>

      <div style="
        margin-top:15px;
        padding:15px;
        background:#f2f4f7;
        border-radius:12px;
        font-size:13px;
      ">
        <strong>NYS reminder:</strong>
        New York's sick-leave requirements depend on employer
        size and, for certain small employers, net income.
        PTO/vacation benefits can also depend on the employer's
        written policy.
      </div>

    </div>
  `;

  section.style.display = "none";
}

window.requestPTO = function () {
  const date =
    prompt(
      "Requested date (example: 09/25/2026):"
    );

  if (!date) return;

  const type =
    prompt(
      "Type: PTO, Sick, Personal, or Other",
      "PTO"
    ) || "PTO";

  state.ptoRequests.unshift({
    id: uid("pto"),
    employeeId:
      state.currentUser.id,
    employee:
      state.currentUser.name,
    date,
    type,
    status: "Pending"
  });

  notify(
    "Time-off request",
    `${state.currentUser.name} submitted a ${type} request.`
  );

  addActivity(
    "Time-off request",
    `${state.currentUser.name} requested ${type}.`,
    "🏖️"
  );

  saveState();
  renderPTO();
};

window.approvePTO = function (id) {
  if (!isAdmin()) {
    alert("Only Admins can approve PTO requests.");
    return;
  }

  const request =
    state.ptoRequests.find(
      r => r.id === id
    );

  if (!request) return;

  request.status = "Approved";

  addActivity(
    "Time-off approved",
    `${request.employee}'s request was approved.`,
    "✓"
  );

  notify(
    "Time-off approved",
    `${request.employee}'s request was approved.`
  );

  saveState();
  renderPTO();
};

/* =========================================================
   DAILY NYS LABOR LAW INFORMATION
   ========================================================= */

const nysLaborTips = [
  {
    title: "Paid Sick Leave",
    text:
      "NYS sick-leave requirements vary by employer size and, for certain employers with 4 or fewer employees, net income.",
    source:
      "NYS Department of Labor"
  },
  {
    title: "Meal Periods",
    text:
      "New York generally requires at least 30 minutes of meal time when an employee works more than 6 hours, subject to the applicable rules and exceptions.",
    source:
      "NYS Department of Labor"
  },
  {
    title: "Written Leave Policies",
    text:
      "Employers must notify employees in writing or by publicly posting policies covering sick leave, vacation, personal leave, holidays and hours.",
    source:
      "NYS Labor Law §195.5"
  },
  {
    title: "Overtime",
    text:
      "Most employees must receive overtime at time-and-one-half for hours worked over 40 in a workweek, although exceptions exist.",
    source:
      "NYS Department of Labor"
  },
  {
    title: "Wage Statements",
    text:
      "Employees generally must receive a wage statement/pay stub containing required wage and hour information.",
    source:
      "NYS Department of Labor"
  },
  {
    title: "Retaliation",
    text:
      "NYS Labor Law protects employees from retaliation for certain complaints about labor-law violations.",
    source:
      "NYS Department of Labor"
  },
  {
    title: "Pay Policies",
    text:
      "Employers should clearly communicate wage rates, pay frequency and applicable policies to employees.",
    source:
      "NYS Department of Labor"
  }
];

function renderLaborLawBanner() {
  const dayNumber =
    Math.floor(
      new Date().getTime() /
        86400000
    );

  const tip =
    nysLaborTips[
      dayNumber %
        nysLaborTips.length
    ];

  let banner =
    document.getElementById(
      "mydetailLaborBanner"
    );

  if (!banner) {
    banner =
      document.createElement("div");

    banner.id =
      "mydetailLaborBanner";

    document.body.prepend(banner);
  }

  banner.innerHTML = `
    <div style="
      background:#eef6ff;
      border-bottom:1px solid #cfe4ff;
      padding:10px 16px;
      font-family:Arial,sans-serif;
      font-size:13px;
    ">

      <strong>
        ⚖️ NYS Labor Law — Daily Info:
        ${escapeHTML(tip.title)}
      </strong>

      <span style="margin-left:5px;">
        ${escapeHTML(tip.text)}
      </span>

      <span style="
        margin-left:7px;
        color:#667085;
      ">
        Source: ${escapeHTML(tip.source)}
      </span>

    </div>
  `;
}

/* =========================================================
   LIVE ACTIVITY
   ========================================================= */

function renderActivity() {
  const container =
    $("activityList") ||
    document.querySelector(".activity-list");

  if (!container) return;

  container.innerHTML =
    state.activity
      .map(
        item => `
          <div style="
            padding:13px 0;
            border-bottom:1px solid #eaecf0;
          ">
            <strong>
              ${escapeHTML(item.icon)}
              ${escapeHTML(item.title)}
            </strong>

            <div style="
              color:#667085;
              font-size:13px;
            ">
              ${escapeHTML(
                item.description
              )}
            </div>

            <small style="
              color:#98a2b3;
            ">
              ${escapeHTML(item.time)}
            </small>
          </div>
        `
      )
      .join("");
}

/* =========================================================
   REPORTS
   ========================================================= */

function renderReports() {
  const completed =
    state.jobs.filter(
      j => j.status === "Completed"
    );

  const revenue =
    completed.reduce(
      (sum, job) =>
        sum + Number(job.price || 0),
      0
    );

  const expected =
    state.cashDrops.reduce(
      (sum, drop) =>
        sum + Number(drop.expected || 0),
      0
    );

  const deposited =
    state.cashDrops.reduce(
      (sum, drop) =>
        sum + Number(drop.deposited || 0),
      0
    );

  const difference =
    deposited - expected;

  const container =
    document.querySelector(
      "#reports, #reportsSection, .reports"
    );

  if (!container) return;

  container.innerHTML = `
    <div style="
      padding:20px;
      background:white;
      border-radius:14px;
    ">

      <h2>Business Report</h2>

      <div style="
        display:grid;
        gap:12px;
        grid-template-columns:
        repeat(auto-fit,minmax(160px,1fr));
      ">

        <div>
          <small>Completed Jobs</small>
          <h3>${completed.length}</h3>
        </div>

        <div>
          <small>Revenue</small>
          <h3>${money(revenue)}</h3>
        </div>

        <div>
          <small>Cash Expected</small>
          <h3>${money(expected)}</h3>
        </div>

        <div>
          <small>Cash Deposited</small>
          <h3>${money(deposited)}</h3>
        </div>

        <div>
          <small>Cash Difference</small>
          <h3>
            ${difference >= 0 ? "+" : ""}
            ${money(difference)}
          </h3>
        </div>

      </div>

      <p style="
        color:#667085;
        margin-top:20px;
      ">
        Weekly push-report automation will be connected
        to the production backend later.
      </p>

    </div>
  `;
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function renderNotifications() {
  const unread =
    state.notifications.filter(
      n => !n.read
    ).length;

  document
    .querySelectorAll(
      "#notificationCount, .notification-count"
    )
    .forEach(el => {
      el.textContent =
        unread > 0 ? unread : "";
    });
}

/* =========================================================
   ADMIN SETTINGS
   ========================================================= */

function renderAdminSettings() {
  const section =
    document.querySelector(
      "#adminSettings, #adminSettingsSection"
    );

  if (!section) return;

  if (!isAdmin()) {
    section.innerHTML = `
      <div style="
        padding:20px;
        background:#fff3cd;
        border-radius:12px;
      ">
        Admin Settings are restricted to Admin accounts.
      </div>
    `;

    return;
  }

  section.innerHTML = `
    <div style="
      display:grid;
      gap:15px;
    ">

      <div style="
        padding:18px;
        background:white;
        border-radius:14px;
        border:1px solid #eaecf0;
      ">
        <h3>Company Profile</h3>

        <button
          onclick="changeCompanyName()"
          style="
            padding:10px 14px;
            border:0;
            border-radius:8px;
            background:#1677ff;
            color:white;
          "
        >
          Change Company Name
        </button>
      </div>

      <div style="
        padding:18px;
        background:white;
        border-radius:14px;
        border:1px solid #eaecf0;
      ">
        <h3>Account Management</h3>

        <p>
          Only Admin accounts can create accounts.
        </p>

        <button
          onclick="createAccount()"
          style="
            padding:10px 14px;
            border:0;
            border-radius:8px;
            background:#1677ff;
            color:white;
          "
        >
          Create Account
        </button>
      </div>

      <div style="
        padding:18px;
        background:white;
        border-radius:14px;
        border:1px solid #eaecf0;
      ">
        <h3>Security</h3>

        <p>
          Production authentication, MFA, database RLS,
          secure storage and audit enforcement will be
          connected through Supabase.
        </p>
      </div>

      <div style="
        padding:18px;
        background:white;
        border-radius:14px;
        border:1px solid #eaecf0;
      ">
        <h3>Data</h3>

        <button
          onclick="resetMVPData()"
          style="
            padding:10px 14px;
            border:0;
            border-radius:8px;
            background:#d92d20;
            color:white;
          "
        >
          Reset Demo Data
        </button>
      </div>

    </div>
  `;
}

window.changeCompanyName = function () {
  if (!isAdmin()) {
    alert("Admin only.");
    return;
  }

  const name =
    prompt(
      "Company name:",
      state.companyName
    );

  if (!name) return;

  state.companyName = name;

  saveState();
  renderEverything();
};

window.resetMVPData = function () {
  if (!isAdmin()) {
    alert("Admin only.");
    return;
  }

  if (
    !confirm(
      "Reset all MVP demo data?"
    )
  ) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );

  location.reload();
};

/* =========================================================
   SECTION RENDERING
   ========================================================= */

function renderSection(section) {
  switch (section) {
    case "dashboard":
      renderDashboard();
      break;

    case "jobs":
      renderJobs();
      break;

    case "schedule":
      renderSchedule();
      break;

    case "customers":
      renderCustomers();
      break;

    case "employees":
      renderEmployees();
      break;

    case "timeclock":
    case "time-clock":
      renderClock();
      break;

    case "punchlog":
    case "punch-log":
    case "my-punch-log":
      renderPunchLog();
      break;

    case "checklist":
    case "daily-checklist":
      renderChecklist();
      break;

    case "cash":
    case "cashdrops":
    case "cash-drops":
      renderCashDrops();
      break;

    case "activity":
    case "live-activity":
      renderActivity();
      break;

    case "reports":
      renderReports();
      break;

    case "settings":
    case "admin-settings":
      renderAdminSettings();
      break;

    case "pto":
      renderPTO();
      break;

    default:
      break;
  }
}

/* =========================================================
   ADD PTO NAVIGATION IF NEEDED
   ========================================================= */

function addPTOButton() {
  const existing =
    document.querySelector(
      '[data-section="pto"]'
    );

  if (existing) return;

  const sidebar =
    document.querySelector(
      ".sidebar, #sidebar, aside"
    );

  if (!sidebar) return;

  const button =
    document.createElement("button");

  button.textContent =
    "🏖️ PTO / Time Off";

  button.dataset.section = "pto";

  button.style.cssText = `
    width:100%;
    text-align:left;
    padding:11px 14px;
    border:0;
    background:transparent;
    cursor:pointer;
    font:inherit;
  `;

  sidebar.appendChild(button);
}

/* =========================================================
   LOGOUT BUTTON
   ========================================================= */

function addLogoutButton() {
  if (
    document.getElementById(
      "mydetailLogout"
    )
  ) {
    return;
  }

  const profile =
    document.querySelector(
      "#profileButton, .profile-button, .topbar"
    );

  const button =
    document.createElement("button");

  button.id =
    "mydetailLogout";

  button.textContent =
    "Sign Out";

  button.style.cssText = `
    position:fixed;
    right:12px;
    bottom:12px;
    z-index:5000;
    padding:9px 13px;
    border:1px solid #d0d5dd;
    border-radius:9px;
    background:white;
    box-shadow:0 3px 12px rgba(0,0,0,.08);
  `;

  button.onclick = logout;

  document.body.appendChild(button);
}

/* =========================================================
   LIVE CLOCK
   ========================================================= */

function setupLiveClock() {
  let clock =
    document.getElementById(
      "mydetailLiveClock"
    );

  if (!clock) {
    clock =
      document.createElement("div");

    clock.id =
      "mydetailLiveClock";

    clock.style.cssText = `
      position:fixed;
      right:12px;
      top:12px;
      z-index:3000;
      padding:7px 10px;
      background:white;
      border-radius:8px;
      box-shadow:0 2px 10px rgba(0,0,0,.08);
      font-size:12px;
      color:#667085;
    `;

    document.body.appendChild(clock);
  }

  const update = () => {
    clock.textContent =
      new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
  };

  update();

  setInterval(update, 1000);
}

/* =========================================================
   GLOBAL REFRESH
   ========================================================= */

function renderEverything() {
  if (!state.currentUser) return;

  renderCompanyName();
  renderUserProfile();

  renderDashboard();
  renderEmployees();
  renderJobs();
  renderCustomers();
  renderSchedule();
  renderChecklist();
  renderClock();
  renderPunchLog();
  renderCashDrops();
  renderActivity();
  renderReports();
  renderNotifications();
  renderAdminSettings();
  renderPTO();

  addPTOButton();
  addLogoutButton();
}

/* =========================================================
   STARTUP
   ========================================================= */

function startMyDetail() {
  console.log(
    "MyDetail MVP starting..."
  );

  renderLaborLawBanner();

  setupHamburger();
  setupNavigation();
  setupLiveClock();

  if (!state.currentUser) {
    createLoginScreen();
    return;
  }

  renderEverything();

  addActivity(
    "MyDetail ready",
    `Signed in as ${state.currentUser.role}.`,
    "✓"
  );

  saveState();
}

document.addEventListener(
  "DOMContentLoaded",
  startMyDetail
);

/* =========================================================
   AUTO SAVE
   ========================================================= */

setInterval(() => {
  saveState();
}, 5000);

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
        .register("service-worker.js")
        .catch(error =>
          console.log(
            "Service worker:",
            error
          )
        );
    }
  );
}
