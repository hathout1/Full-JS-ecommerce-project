document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const closeBtn = document.querySelector(".close-btn");

  // helper functions
  const showError = (id, msg) => {
    document.getElementById(id).textContent = msg;
  };

  const clearErrors = () => {
    ["name-error", "email-error", "message-error"].forEach((id) => {
      document.getElementById(id).textContent = "";
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    let valid = true;

    if (name.length < 8) {
      showError("name-error", "Full name must be at least 8 characters.");
      valid = false;
    }

    if (!validateEmail(email)) {
      showError("email-error", "Enter a valid email address.");
      valid = false;
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const emailExists = users.some((u) => u.email === email);
      if (!emailExists) {
        showError("email-error", "This email is not registered.");
        valid = false;
      }
    }

    const wordCount = message.split(/\s+/).filter((w) => w.length > 0).length;
    if (wordCount < 3) {
      showError("message-error", "Message must be at least 3 words.");
      valid = false;
    }

    if (!valid) return;

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem("messages", JSON.stringify(messages));

    showPopup(`Thank you, ${name}! Your message has been sent.`);
    form.reset();
  });

  function showPopup(msg) {
    popupMessage.textContent = msg;
    popup.style.display = "flex";
  }

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
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
