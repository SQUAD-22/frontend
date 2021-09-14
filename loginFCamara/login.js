const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const togglePassword = document.getElementById('toggle-password');
const form = document.getElementById('form');
const button = document.getElementById('button');
const errorText = document.getElementById('error');

const loginEndpoint = 'https://fcagenda.herokuapp.com/auth/login';

// Adicionar lógica de clicar no botão para ver senha
function handleToggle() {
  if (passwordInput.type == 'text') {
    passwordInput.type = 'password';
    togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    passwordInput.type = 'text';
    togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

togglePassword.addEventListener('click', handleToggle);

//Adicionar lógica de login
function handleLogin(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  button.className = 'disabled';
  errorText.innerText = '';

  fetch(loginEndpoint, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.errorId) {
        errorText.innerText = data.message;
        button.className = 'enabled';
      } else {
        localStorage.setItem('token', data.token);
        window.location.href = '/home';
      }
    });
}

form.addEventListener('submit', handleLogin);
