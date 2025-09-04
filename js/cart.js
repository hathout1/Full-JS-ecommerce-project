document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let stock = JSON.parse(localStorage.getItem("stock")) || {};
  const container = document.getElementById("cart-container");
  const totalPriceEl = document.getElementById("total-price");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const closeBtn = document.querySelector(".close-btn");

  function renderCart() {
    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>Price: ${item.price} EGP</p>
        <p>Stock: ${stock[item.id]}</p>
      </div>
      <div class="quantity-controls">
        <button class="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="increase">+</button>
        <button class="remove">🗑️</button>
      </div>
    `;
      container.appendChild(div);

      div.querySelector(".increase").addEventListener("click", () => {
        if (stock[item.id] <= 0) {
          showPopup("No more stock available!");
          return;
        }
        item.quantity++;
        stock[item.id]--;
        saveAndRender();
      });

      div.querySelector(".decrease").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
          stock[item.id]++;
          saveAndRender();
        }
      });

      div.querySelector(".remove").addEventListener("click", () => {
        stock[item.id] += item.quantity;
        cart.splice(index, 1);
        saveAndRender();
        showPopup(`${item.name} removed from cart ❌`);
      });
    });

    totalPriceEl.textContent = total;
  }

  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("stock", JSON.stringify(stock));
    renderCart();
  }

  document.getElementById("buy-now").addEventListener("click", () => {
    if (cart.length === 0) {
      showPopup("Your cart is empty!");
      return;
    }
    showPopup("Order successful! ✅ Your items have been shipped.");
    cart = [];
    saveAndRender();
  });

  function showPopup(msg) {
    popupMessage.textContent = msg;
    popup.style.display = "flex";
  }

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });

  renderCart();

  document.querySelectorAll("a[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      if (page === "logout") {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
      } else {
        if (window.location.pathname.includes(`${page}.html`)) return;
        window.location.href = `${page}.html`;
      }
    });
  });
});
