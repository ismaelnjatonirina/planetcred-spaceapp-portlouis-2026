(() => {
  const style = document.createElement("style");
  style.textContent = "html.auth-pending body{visibility:hidden!important}";
  document.head.appendChild(style);
  document.documentElement.classList.add("auth-pending");

  const destination = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const loginUrl = `/login.html?next=${encodeURIComponent(destination)}`;

  const sessionCheck = fetch("/api/session", { credentials: "same-origin", cache: "no-store" })
    .then((response) => (response.ok ? response.json() : null))
    .then((session) => {
      if (!session?.authenticated) {
        window.location.replace(loginUrl);
        return;
      }
      document.documentElement.classList.remove("auth-pending");
    })
    .catch(() => window.location.replace(loginUrl));
  if (window.PageLoader) window.PageLoader.track(sessionCheck);
})();
