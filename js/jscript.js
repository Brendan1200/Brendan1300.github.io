// ============================================
// script.js — Inventory Management System
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const welcome = document.getElementById("welcome");

  // Redirect to login if not logged in (except on index/register)
  if (!currentUser && !path.includes("index.html") && !path.includes("register.html")) {
    window.location.href = "index.html";
    return;
  }

  // Show welcome text if logged in
  if (welcome && currentUser) {
    welcome.textContent = `Hi, ${currentUser.username}!`;
  }

  // ========== Dashboard Functions ==========
  // NOTE: This uses 'qty' for quantity, while the final dashboard.html uses 'quantity' for consistency.
  // The logic in dashboard.html is the one to follow.
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  const tableBody = document.getElementById("inventoryBody");
  const showBtn = document.getElementById("showAdd");
  const hideBtn = document.getElementById("hideAdd");
  const formSection = document.getElementById("addForm");
  const addForm = document.getElementById("addItem");

  // Show/Hide Add Item Form
  if (showBtn && hideBtn && formSection) {
    showBtn.onclick = () => formSection.classList.remove("hidden");
    hideBtn.onclick = () => formSection.classList.add("hidden");
  }

  // Render Inventory Table
  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (inventory.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No items yet.</td></tr>`;
      return;
    }

    inventory.forEach((item, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${(item.qty * item.price).toFixed(2)}</td>
        <td>
          <a href="edit_item.html?id=${i}" class="btn small">Edit</a>
          <a href="delete_item.html?id=${i}" class="btn small danger">Delete</a>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  if (tableBody) renderTable();

  // Add Item Function
  if (addForm) {
    addForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("itemName").value.trim();
      const qty = parseInt(document.getElementById("itemQty").value);
      const price = parseFloat(document.getElementById("itemPrice").value);

      if (!name || isNaN(qty) || isNaN(price)) {
        alert("Please fill all fields correctly.");
        return;
      }

      inventory.push({ name, qty, price });
      localStorage.setItem("inventory", JSON.stringify(inventory));
      renderTable();

      addForm.reset();
      formSection.classList.add("hidden");
      alert("Item added successfully!");
    };
  }
});

// ========== Global Functions ==========
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
