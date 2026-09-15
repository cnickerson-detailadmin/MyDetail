const state = {
  employees: [
    {
      name: "Manager",
      status: "Online"
    },
    {
      name: "Employee 1",
      status: "Offline"
    },
    {
      name: "Employee 2",
      status: "Offline"
    }
  ],

  openJobs: 0,
  revenue: 0,
  updates: 0
};


function renderDashboard() {

  const onlineEmployees =
    state.employees.filter(
      employee => employee.status === "Online"
    ).length;


  document.getElementById(
    "employeesOnline"
  ).textContent = onlineEmployees;


  document.getElementById(
    "openJobs"
  ).textContent = state.openJobs;


  document.getElementById(
    "revenue"
  ).textContent =
    "$" + state.revenue.toLocaleString();


  document.getElementById(
    "updates"
  ).textContent = state.updates;


  const employeeList =
    document.getElementById("employeeList");


  employeeList.innerHTML = "";


  state.employees.forEach(employee => {

    const row = document.createElement("div");

    row.className = "employee";


    row.innerHTML = `
      <span>
        ${employee.name}
      </span>

      <span class="${
        employee.status === "Online"
          ? "online"
          : "offline"
      }">

        ${employee.status}

      </span>
    `;


    employeeList.appendChild(row);

  });

}


renderDashboard();


/*
  LIVE UPDATE HOOK

  This will later connect to the
  real-time Five Star Detail database.
*/

setInterval(() => {

  state.updates++;

  renderDashboard();

}, 10000);


/*
  PWA SERVICE WORKER
*/

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("service-worker.js")
    .catch(error => {

      console.log(
        "Service worker:",
        error
      );

    });

}
