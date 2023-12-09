function toggleForm(formId) {
  // Hide all forms
  document.getElementById("sign-in-form").style.display = "none";
  document.getElementById("sign-up-form").style.display = "none";

  // Show the selected form
  document.getElementById(formId).style.display = "flex";
}


