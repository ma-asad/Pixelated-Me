// Function to validate date of birth
function calculateAge(dobInput, dobFeedback) {
  const dobDate = new Date(dobInput);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear(); // Change const to let
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  dobFeedback.textContent = age >= 10 ? "" : "Must be at least 10 years old";

  return age;
}

function validateDOB(dobInput, dobFeedback) {
  age = calculateAge(dobInput, dobFeedback);

  // Check if age is less than 11
  if (age <= 10) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Invalid Details";
    errorMessage.style.color = "red"; // Optional: make the error message red
    errorMessage.style.display = "flex";
    errorMessage.style.justifyContent = "center";
    errorMessage.style.fontSize = "10px"; // Corrected property name
    errorMessage.style.textDecoration = "none";

    const orLoginElement = document.getElementById("error-output");
    orLoginElement.parentNode.appendChild(errorMessage);

    return false;
  } else {
    return true;
  }
}

function validateEmail(emailInput, emailFeedback) {
  let email = emailInput.trim();
  let isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email
  );

  // Retrieve the existing users from local storage
  let users = localStorage.getItem("users");

  // If users is not null, parse it into an array
  if (users) {
    users = JSON.parse(users);
    console.log("Parsed users:", users); // Debug line

    // Check if any user has the same email
    for (let user of users) {
      console.log("Comparing with user email:", user.email.trim()); // Debug line
      if (user.email.trim() === email) {
        isEmailValid = false;
        console.log("Exist"); // Debug line
        emailFeedback.textContent =
          "Email already exists. Please log in instead.";
        break;
      } else {
        console.log("Does not exist"); // Debug line
        emailFeedback.textContent = "";
      }
    }
  }
  if (
    !isEmailValid &&
    emailFeedback.textContent !== "Email already exists. Please log in instead."
  ) {
    emailFeedback.textContent = "Invalid email address";
  }

  if (isEmailValid) {
    emailFeedback.textContent = "";
  }

  return isEmailValid;
}

// Function to validate password strength
function validatePasswordStrength(passwordInput, passwordStrengthFeedback) {
  const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numberRegex = /\d/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;

  const hasSymbol = symbolRegex.test(passwordInput);
  const hasNumber = numberRegex.test(passwordInput);
  const hasUppercase = uppercaseRegex.test(passwordInput);
  const hasLowercase = lowercaseRegex.test(passwordInput);
  const isLengthValid = passwordInput.length >= 8;
  const isPasswordValid =
    isLengthValid && hasSymbol && hasNumber && hasUppercase && hasLowercase;

  if (!isLengthValid) {
    passwordStrengthFeedback.textContent =
      "Password must be at least 8 characters long";
  } else if (!hasSymbol) {
    passwordStrengthFeedback.textContent =
      "Password must contain at least one symbol";
  } else if (!hasNumber) {
    passwordStrengthFeedback.textContent =
      "Password must contain at least one number";
  } else if (!hasUppercase) {
    passwordStrengthFeedback.textContent =
      "Password must contain at least one uppercase letter";
  } else if (!hasLowercase) {
    passwordStrengthFeedback.textContent =
      "Password must contain at least one lowercase letter";
  } else {
    passwordStrengthFeedback.textContent = "";
  }
  return isPasswordValid;
}

// Function to validate password match
function validatePasswordMatch(
  passwordInput,
  confirmPasswordInput,
  passwordMatchFeedback
) {
  const passwordsMatch = passwordInput === confirmPasswordInput;
  passwordMatchFeedback.textContent = passwordsMatch
    ? ""
    : "Passwords do not match";
  return passwordsMatch;
}

// Event listener for when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const form = document.getElementById("signup-form");

  // Get the child elements of the form
  const dobInput = form.elements["dob"];
  const dobFeedback = document.getElementById("dob-feedback");
  const emailInput = form.elements["sign-up-email"];
  const emailFeedback = document.getElementById("sign-up-email-feedback");
  const passwordInput = form.elements["sign-up-password"];
  const confirmPasswordInput = form.elements["confirm-password"];
  const passwordMatchFeedback = document.getElementById(
    "password-match-feedback"
  );
  const passwordStrengthFeedback = document.getElementById(
    "password-strength-feedback"
  );

  // Event listeners for input fields
  emailInput.addEventListener("input", function () {
    validateEmail(emailInput.value, emailFeedback);
  });

  dobInput.addEventListener("input", function () {
    validateDOB(dobInput.value, dobFeedback);
  });

  passwordInput.addEventListener("input", function () {
    validatePasswordStrength(passwordInput.value, passwordStrengthFeedback);
  });

  confirmPasswordInput.addEventListener("input", function () {
    validatePasswordMatch(
      passwordInput.value,
      confirmPasswordInput.value,
      passwordMatchFeedback
    );
  });

});

// Function to save form data
function saveFormData(event) {
  event.preventDefault();

  const form = document.getElementById("signup-form");

  // Retrieve form elements value
  const firstName = form.elements["fname"].value;
  const lastName = form.elements["lname"].value;
  const dob = form.elements["dob"].value;
  const gender = form.elements["gender"].value;
  const username = form.elements["username"].value;
  const email = form.elements["sign-up-email"].value;
  const password = form.elements["sign-up-password"].value;

  // Create user data object
  const newUser = {
    firstName,
    lastName,
    dob,
    gender,
    username,
    email,
    password,
  };

  // Retrieving existing users or initializing an empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Adding the new user and updating local storage
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Log to check if data is stored
  console.log("Stored Users:", JSON.parse(localStorage.getItem("users")));
}

// Function to submit the sign-up form
function submitSignUpForm(event) {
  // Always prevent default form submission
  event.preventDefault();

  const form = document.getElementById("signup-form");

  // Get the child elements of the form
  const dobInput = form.elements["dob"].value;
  const dobFeedback = document.getElementById("dob-feedback");
  const emailInput = form.elements["sign-up-email"].value;
  const emailFeedback = document.getElementById("sign-up-email-feedback");
  const passwordInput = form.elements["sign-up-password"].value;
  const confirmPasswordInput = form.elements["confirm-password"].value;
  const passwordMatchFeedback = document.getElementById(
    "password-match-feedback"
  );
  const passwordStrengthFeedback = document.getElementById(
    "password-strength-feedback"
  );

  // Call validation functions and store results
  const isEmailValid = validateEmail(emailInput, emailFeedback);
  const isDobValid = validateDOB(dobInput, dobFeedback);
  const isPasswordStrong = validatePasswordStrength(
    passwordInput,
    passwordStrengthFeedback
  );
  const isPasswordMatch = validatePasswordMatch(
    passwordInput,
    confirmPasswordInput,
    passwordMatchFeedback
  );

  // Check if form is valid
  if (isEmailValid && isDobValid && isPasswordStrong && isPasswordMatch) {
    saveFormData(event); // Only call saveFormData if valid
    window.location.href = "../html/home.html";
  } else {
    alert("Invalid Details");
    console.log("Invalid Details");
  }
}
