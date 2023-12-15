// Switch between sign in and sign up forms
function toggleForm(formId) {
  // Hide all forms
  document.getElementById("sign-in-form").style.display = "none";
  document.getElementById("sign-up-form").style.display = "none";

  // Show the selected form
  document.getElementById(formId).style.display = "flex";
}

// Log Out

// Get the logout button
const logoutButton = document.getElementById('logout');

// Add a click event listener to the logout button
logoutButton.addEventListener('click', function() {
  // Clear the session
  sessionStorage.clear();

  // Redirect to index.html
  window.location.href = '../index.html';
});
