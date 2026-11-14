(() => {
  const MINIMUM_DISPLAY_MS = 450;
  let pendingTasks = 0;
  let domReady = false;
  let hideScheduled = false;
  let hidden = false;
  const startedAt = performance.now();

  const style = document.createElement("style");
  style.textContent = `
    html.page-loading::before { content: ""; position: fixed; inset: 0; z-index: 100000; background: rgba(2, 6, 23, .94); }
    html.page-loading::after { content: ""; position: fixed; z-index: 100002; top: 50%; left: 50%; width: 48px; height: 48px; margin: -24px 0 0 -24px; border: 4px solid rgba(148, 163, 184, .28); border-top-color: #10b981; border-right-color: #34d399; border-radius: 50%; animation: planetcred-spin .8s linear infinite; }
    html.page-loading body > :not(#page-loading-overlay) { visibility: hidden !important; }
    #page-loading-overlay { position: fixed; inset: 0; z-index: 100001; display: flex; align-items: center; justify-content: center; padding-top: 88px; pointer-events: none; color: #cbd5e1; font: 500 14px/1.4 system-ui, sans-serif; }
    @keyframes planetcred-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { html.page-loading::after { animation-duration: 1.8s; } }
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add("page-loading");

  function hideWhenReady() {
    if (!domReady || pendingTasks > 0 || hideScheduled || hidden) return;
    hideScheduled = true;
    const remaining = Math.max(0, MINIMUM_DISPLAY_MS - (performance.now() - startedAt));
    window.setTimeout(() => {
      hideScheduled = false;
      if (pendingTasks > 0 || hidden) return;
      hidden = true;
      document.documentElement.classList.remove("page-loading");
      document.getElementById("page-loading-overlay")?.remove();
      style.remove();
    }, remaining);
  }

  function track(task) {
    if (hidden) return Promise.resolve(task);
    pendingTasks += 1;
    hideScheduled = false;
    const trackedTask = Promise.resolve(task);
    trackedTask
      .catch((error) => console.error("Page data could not be loaded:", error))
      .finally(() => {
        pendingTasks = Math.max(0, pendingTasks - 1);
        hideWhenReady();
      });
    return trackedTask;
  }

  window.PageLoader = { track };

  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.id = "page-loading-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    const message = document.createElement("span");
    message.textContent = window.t ? window.t("page.loading") : "Loading page data…";
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    document.addEventListener("app-language-changed", () => {
      message.textContent = window.t ? window.t("page.loading") : "Loading page data…";
    });
    domReady = true;
    hideWhenReady();
  });
})();
