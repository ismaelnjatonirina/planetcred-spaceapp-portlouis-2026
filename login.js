const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const confirmPasswordField = document.getElementById("confirm-password-field");
const submitButton = document.getElementById("login-submit");
const passwordToggle = document.getElementById("password-toggle");
const message = document.getElementById("login-message");
const authModePrompt = document.getElementById("auth-mode-prompt");
const authModeToggle = document.getElementById("auth-mode-toggle");
let visibleMessageKey = null;
let authMode = "login";

function translate(key, values) {
  return window.t ? window.t(key, values) : key;
}

function renderMessage() {
  if (!visibleMessageKey) return;
  message.textContent = translate(visibleMessageKey);
}

function showMessage(key) {
  visibleMessageKey = key;
  message.textContent = translate(key);
  message.classList.remove("hidden");
}

function getRedirectTarget() {
  const candidate = new URLSearchParams(window.location.search).get("next");
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/index.html";
  }
  return candidate === "/login.html" ? "/index.html" : candidate;
}

function updatePasswordToggle() {
  const isVisible = passwordInput.type === "text";
  passwordToggle.textContent = translate(
    isVisible ? "login.hidePassword" : "login.showPassword",
  );
  passwordToggle.setAttribute("aria-pressed", String(isVisible));
}

function renderAuthMode() {
  const isSignup = authMode === "signup";
  document.getElementById("login-heading").textContent = translate(
    isSignup ? "login.signupHeading" : "login.heading",
  );
  authModePrompt.textContent = translate(isSignup ? "login.haveAccount" : "login.noAccount");
  authModeToggle.textContent = translate(isSignup ? "login.signIn" : "login.signUp");
  submitButton.textContent = translate(isSignup ? "login.createAccount" : "login.submit");
  confirmPasswordField.classList.toggle("hidden", !isSignup);
  confirmPasswordInput.required = isSignup;
  passwordInput.autocomplete = isSignup ? "new-password" : "current-password";
}

authModeToggle.addEventListener("click", () => {
  authMode = authMode === "login" ? "signup" : "login";
  message.classList.add("hidden");
  visibleMessageKey = null;
  passwordInput.value = "";
  confirmPasswordInput.value = "";
  renderAuthMode();
});

passwordToggle.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  updatePasswordToggle();
  passwordInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.classList.add("hidden");
  visibleMessageKey = null;
  submitButton.disabled = true;
  submitButton.textContent = translate(authMode === "signup" ? "login.creatingAccount" : "login.signingIn");

  if (authMode === "signup") {
    if (!/^[A-Za-z0-9._-]{3,32}$/.test(usernameInput.value.trim()) || passwordInput.value.length < 12 || passwordInput.value.length > 256) {
      showMessage("login.signupValidation");
      submitButton.disabled = false;
      renderAuthMode();
      return;
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
      showMessage("login.passwordMismatch");
      submitButton.disabled = false;
      confirmPasswordInput.focus();
      renderAuthMode();
      return;
    }
  }

  try {
    const response = await fetch(authMode === "signup" ? "/api/register" : "/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value,
      }),
    });
    if (!response.ok) {
      if (response.status === 401) showMessage("login.invalidCredentials");
      else if (response.status === 429) showMessage("login.tooManyAttempts");
      else if (response.status === 409) showMessage("login.usernameTaken");
      else if (response.status === 400) showMessage("login.signupValidation");
      else showMessage("login.serverUnavailable");
      passwordInput.value = "";
      confirmPasswordInput.value = "";
      passwordInput.focus();
      return;
    }
    window.location.replace(getRedirectTarget());
  } catch {
    showMessage("login.serverUnavailable");
  } finally {
    submitButton.disabled = false;
    renderAuthMode();
  }
});

document.addEventListener("app-language-changed", () => {
  renderMessage();
  updatePasswordToggle();
  if (!submitButton.disabled) renderAuthMode();
});

const sessionCheck = fetch("/api/session", { credentials: "same-origin", cache: "no-store" })
  .then((response) => (response.ok ? response.json() : null))
  .then((session) => {
    if (session?.authenticated) window.location.replace(getRedirectTarget());
  })
  .catch(() => {
    // The form will display the server-unavailable message if submitted from a static server.
  });
if (window.PageLoader) window.PageLoader.track(sessionCheck);

updatePasswordToggle();
renderAuthMode();
