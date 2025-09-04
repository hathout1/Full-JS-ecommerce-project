document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    let isValid = true;

    if (!firstName || firstName.length < 3 || /[^a-zA-Z]/.test(firstName)) {
      document.getElementById("firstNameError").textContent =
        "First name must be at least 3 letters without symbols!";
      isValid = false;
    }

    if (!lastName || lastName.length < 3 || /[^a-zA-Z]/.test(lastName)) {
      document.getElementById("lastNameError").textContent =
        "Last name must be at least 3 letters without symbols!";
      isValid = false;
    }

    if (!email) {
      document.getElementById("emailError").textContent = "Email is required!";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("emailError").textContent =
        "Invalid email format!";
      isValid = false;
    }

    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      document.getElementById("passwordError").textContent =
        "Password must be 8+ chars, include upper, lower, number, and symbol!";
      isValid = false;
    }

    if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").textContent =
        "Passwords do not match!";
      isValid = false;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) {
      document.getElementById("emailError").textContent =
        "Email already exists!";
      isValid = false;
    }
    if (
      users.find((u) => u.firstName === firstName && u.lastName === lastName)
    ) {
      document.getElementById("lastNameError").textContent =
        "User already exists!";
      isValid = false;
    }

    if (!isValid) return;

    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("successPopup").style.display = "flex";

    document.getElementById("closePopup").onclick = function () {
      document.getElementById("successPopup").style.display = "none";
    };

    document.getElementById("goToLogin").onclick = function () {
      window.location.href = "login.html";
    };
  });
