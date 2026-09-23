/* MyService Extreme Security Alert UI
   Frontend alert surface only. Cross-device delivery must come from the secure backend/push layer.
*/
(function () {
  "use strict";

  const KEY = "myservice_extreme_security_alert_v1";
  const DISPLAY_MODE = new URLSearchParams(location.search).get("securityDisplay") === "1";

  function readAlert() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; }
  }

  function writeAlert(value) {
    try {
      if (value) localStorage.setItem(KEY, JSON.stringify(value));
      else localStorage.removeItem(KEY);
    } catch (_) {}
  }

  function ensureStyles() {
    if (document.getElementById("myservice-extreme-security-styles")) return;
    const style = document.createElement("style");
    style.id = "myservice-extreme-security-styles";
    style.textContent = `
      @keyframes myserviceExtremeFlash {
        0%,49% { background:#b00020; }
        50%,100% { background:#ff1f1f; }
      }
      #myservice-extreme-security-display {
        position:fixed; inset:0; z-index:2147483646; color:#fff;
        display:flex; align-items:center; justify-content:center; text-align:center;
        padding:32px; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
        background:#b00020;
      }
      #myservice-extreme-security-display.flashing {
        animation:myserviceExtremeFlash 1s steps(1,end) infinite;
      }
      #myservice-extreme-security-display .box { max-width:760px; }
      #myservice-extreme-security-display h1 { font-size:clamp(32px,7vw,72px); margin:0 0 14px; }
      #myservice-extreme-security-display p { font-size:clamp(16px,2.4vw,24px); margin:8px 0; }
      #myservice-extreme-security-display button {
        margin-top:22px; min-height:48px; padding:12px 20px; border:2px solid #fff;
        border-radius:12px; background:#fff; color:#8b0018; font-weight:900; cursor:pointer;
      }
      #myservice-extreme-security-toast {
        position:fixed; top:14px; left:50%; transform:translateX(-50%);
        z-index:2147483645; width:min(680px,calc(100% - 28px)); padding:16px 18px;
        border-radius:14px; background:#b00020; color:#fff;
        box-shadow:0 12px 36px rgba(0,0,0,.28);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
      }
      #myservice-extreme-security-toast strong { display:block; font-size:18px; }
      #myservice-extreme-security-toast small { display:block; margin-top:6px; opacity:.92; }
      @media (prefers-reduced-motion: reduce) {
        #myservice-extreme-security-display.flashing { animation:none; background:#b00020; }
      }
    `;
    document.head.appendChild(style);
  }

  function browserNotification(alertData) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
      new Notification("EXTREME SECURITY ISSUE", {
        body: "Lockdown site immediately. " + (alertData.reason || ""),
        silent: true,
        requireInteraction: true,
        tag: "myservice-extreme-security"
      });
    } catch (_) {}
  }

  function showDeveloperNotification(alertData) {
    let toast = document.getElementById("myservice-extreme-security-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "myservice-extreme-security-toast";
      toast.setAttribute("role", "alert");
      document.body.appendChild(toast);
    }
    toast.innerHTML =
      "<strong>🚨 EXTREME SECURITY ISSUE — Lockdown site immediately.</strong>" +
      "<small>" + escapeText(alertData.reason || "Verified extreme security event.") + "</small>";
    browserNotification(alertData);
  }

  function showSecurityDisplay(alertData) {
    let screen = document.getElementById("myservice-extreme-security-display");
    if (!screen) {
      screen = document.createElement("div");
      screen.id = "myservice-extreme-security-display";
      screen.innerHTML =
        '<div class="box"><h1>EXTREME SECURITY ISSUE</h1>' +
        '<p id="myservice-extreme-security-reason"></p>' +
        '<p><strong>LOCKDOWN SITE IMMEDIATELY</strong></p>' +
        '<button type="button" id="myservice-extreme-security-ack">ACKNOWLEDGE</button></div>';
      document.body.appendChild(screen);
      screen.querySelector("#myservice-extreme-security-ack").addEventListener("click", acknowledge);
    }
    screen.classList.toggle("flashing", !alertData.acknowledged);
    screen.querySelector("#myservice-extreme-security-reason").textContent =
      alertData.reason || "Verified extreme security event.";
  }

  function render() {
    ensureStyles();
    const alertData = readAlert();
    const screen = document.getElementById("myservice-extreme-security-display");
    const toast = document.getElementById("myservice-extreme-security-toast");

    if (!alertData || !alertData.active) {
      if (screen) screen.remove();
      if (toast) toast.remove();
      return;
    }

    if (DISPLAY_MODE) showSecurityDisplay(alertData);
    else showDeveloperNotification(alertData);
  }

  function acknowledge() {
    const alertData = readAlert();
    if (!alertData) return;
    alertData.acknowledged = true;
    alertData.acknowledgedAt = new Date().toISOString();
    writeAlert(alertData);
    render();
  }

  function trigger(reason, metadata) {
    const alertData = {
      active: true,
      severity: "extreme",
      reason: String(reason || "Verified extreme security event."),
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      acknowledged: false
    };
    writeAlert(alertData);
    render();
    return alertData;
  }

  function resolve() {
    writeAlert(null);
    render();
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[c];
    });
  }

  window.MyServiceExtremeSecurity = Object.freeze({
    trigger: trigger,
    acknowledge: acknowledge,
    resolve: resolve,
    getActive: readAlert,
    isSecurityDisplay: DISPLAY_MODE
  });

  window.addEventListener("myservice:extreme-security", function (event) {
    const detail = event && event.detail ? event.detail : {};
    trigger(detail.reason, detail.metadata);
  });

  window.addEventListener("storage", function (event) {
    if (event.key === KEY) render();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once:true });
  } else {
    render();
  }
})();