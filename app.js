/* =========================================================
   MYSERVICE — RESTAURANT MANAGEMENT APPLICATION
   5 Star Restaurant
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "myservice_restaurant_v2";

const defaultState = {
  companyName: "5 Star Restaurant",

  currentUser: null,

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
      totalHours: 0,
      tipEligible: true
    },
    {
      id: "employee-1",
      name: "Employee Demo",
      role: "Employee",
      status: "Off Clock",
      clockIn: null,
      lunchStart: null,
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

      settings: {
        ...clone(defaultState.settings),
        ...(parsed.settings || {})
      },

      users: Array.isArray(parsed.users)
        ? parsed.users
        : clone(defaultState.users),

      employees: Array.isArray(parsed.employees)
        ? parsed.employees.map(employee => ({
            tipEligible: true,
            ...employee
          }))
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
    .replace
