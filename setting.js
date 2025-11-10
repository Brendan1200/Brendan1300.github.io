// Global settings, theme, and session control
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    alert("Please login first!");
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");
  window.location.href = "index.html";
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

// Apply theme on load
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light");
});