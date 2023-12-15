function submitSignInForm(event) {
  // Prevent default form submission
  event.preventDefault();

  // Get email and password from form
  const email = document.getElementById('sign-in-email').value;
  const password = document.getElementById('sign-in-password').value;

  // Retrieve users from local storage
  let users = localStorage.getItem('users');
  if (users) {
    users = JSON.parse(users);

    // Check if there's a user with the same email and password
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      // If there is, save to session and redirect to home.html
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.href = '../html/home.html';
    } else {
      // If there isn't, display an alert
      alert('Invalid email or password. Please sign up if you do not have an account.');
    }
  } 
}


  