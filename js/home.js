let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let stock = JSON.parse(localStorage.getItem("stock")) || {};

fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    let id = 1;
    for (let category in data) {
      data[category].forEach((item) => {
        products.push({
          id: id,
          name: `${category}`,
          price: item.price,
          category: category,
          img: item.image,
          size: item.size || null,
        });

        if (!stock[id]) stock[id] = 30;
        id++;
      });
    }

    localStorage.setItem("stock", JSON.stringify(stock));
    displayProducts("all");
  })
  .catch((err) => console.error("Error loading products.json:", err));

function displayProducts(category, filters = {}) {
  let container = document.getElementById("products-container");
  container.innerHTML = "";

  let filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  if (filters.minPrice) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice);
  }
  if (filters.size) {
    filtered = filtered.filter((p) => p.size === filters.size);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p>No products found 🚫</p>`;
    return;
  }

  filtered.forEach((p) => {
    let card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>Product : ${p.name}</h4>
      <p>Price : ${p.price} EGP</p>
      ${p.size ? `<p>Size : ${p.size}</p>` : ""}
      <div class="actions">
        <button onclick="addToCart(${p.id})">+</button>
        <button onclick="viewImage(${p.id})">👁</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById("apply-filters").addEventListener("click", () => {
  const minPrice = parseInt(document.getElementById("min-price").value) || 0;
  const maxPrice =
    parseInt(document.getElementById("max-price").value) || Infinity;
  const size = document.getElementById("size-filter").value;

  const activeCategory =
    document.querySelector(".filter-btn.active").dataset.category || "all";

  displayProducts(activeCategory, { minPrice, maxPrice, size });
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    displayProducts(btn.dataset.category);
  });
});

function addToCart(id) {
  if (stock[id] <= 0) {
    showPopup("Out of stock!");
    return;
  }

  const index = cart.findIndex((item) => item.id === id);
  if (index > -1) {
    cart[index].quantity++;
  } else {
    const product = products.find((p) => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  stock[id]--;
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("stock", JSON.stringify(stock));

  const activeCategory =
    document.querySelector(".filter-btn.active").dataset.category || "all";
  displayProducts(activeCategory);

  showPopup("Product added to cart ✅");
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

function viewImage(id) {
  let product = products.find((p) => p.id === id);

  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalCategory").textContent = product.category;
  document.getElementById("modalPrice").textContent = product.price;
  document.getElementById("modalStock").textContent = stock[product.id];

  const modal = document.getElementById("productModal");
  modal.style.display = "flex";

  document.getElementById("modalAddToCart").onclick = () => {
    addToCart(product.id);
    modal.style.display = "none";
  };

  modal.querySelector(".close-btn").onclick = () => {
    modal.style.display = "none";
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

let slides = document.querySelectorAll(".slides img");
if (slides.length > 0) {
  let current = 0;
  let slideInterval = setInterval(nextSlide, 3000);

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) slide.classList.add("active");
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  document.querySelector(".prev").addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
  }
}

document.getElementById("toTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");

      if (page === "logout") {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
      } else {
        if (window.location.pathname.includes(`${page}.html`)) {
          return;
        }
        window.location.href = `${page}.html`;
      }
    });
  });
});
