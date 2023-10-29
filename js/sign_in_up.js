function toggleForm(formId) {
    // Hide all forms
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';

    // Show the selected form
    document.getElementById(formId).style.display = 'block';
};
