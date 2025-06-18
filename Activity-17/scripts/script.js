document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value.trim();

  const usernameValid = /^[a-zA-Z0-9]{5,}$/.test(username);
  const emailValid = /^[^@]+@\w+(\.\w+)+\w$/.test(email);
  const phoneValid = /^\+?[0-9]{10,15}$/.test(phone); // Accepts + and 10–15 digits
  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);

  document.getElementById('usernameFeedback').textContent = usernameValid ? '' : 'Username should be at least 5 characters and alphanumeric.';
  document.getElementById('emailFeedback').textContent = emailValid ? '' : 'Please enter a valid email address.';
  document.getElementById('phoneFeedback').textContent = phoneValid ? '' : 'Enter a valid phone number (10-15 digits, optional +).';
  document.getElementById('passwordFeedback').textContent = passwordValid ? '' : 'Password must be at least 8 characters with upper, lower case and a number.';

  document.getElementById('usernameFeedback').style.display = usernameValid ? 'none' : 'block';
  document.getElementById('emailFeedback').style.display = emailValid ? 'none' : 'block';
  document.getElementById('phoneFeedback').style.display = phoneValid ? 'none' : 'block';
  document.getElementById('passwordFeedback').style.display = passwordValid ? 'none' : 'block';

  const formValid = usernameValid && emailValid && phoneValid && passwordValid;

  if (formValid) {
    document.getElementById('registrationFeedback').textContent = 'Your user registration was accepted!';
    document.getElementById('registrationFeedback').style.display = 'block';
  } else {
    document.getElementById('registrationFeedback').textContent = '';
    document.getElementById('registrationFeedback').style.display = 'none';
  }
});
