document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");
  let errorMsg = document.getElementById("errorMsg");

  emailError.textContent = "";
  passwordError.textContent = "";
  errorMsg.textContent = "";

  let isValid = true;

  if (!email) {
    emailError.textContent = "Email is required!";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent = "Invalid email format!";
    isValid = false;
  }

  if (!password) {
    passwordError.textContent = "Password is required!";
    isValid = false;
  } else if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    passwordError.textContent =
      "Password must be 8+ chars, include upper, lower, number, and symbol!";
    isValid = false;
  }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "home.html";
  } else {
    errorMsg.textContent = "Invalid email or password!";
  }
});
