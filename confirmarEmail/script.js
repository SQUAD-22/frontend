//Retirar atributos da URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const email = params.get('email');

//Inicializar alguns elementos numa variável
const emailInput = document.getElementById('email-input');
const nameInput = document.getElementById('name-input');
const passwordInput = document.getElementById('password-input');
const passwordIcon = document.getElementById('password-icon');
const confirmButton = document.getElementById('confirm-button');

//Seta o email do usuário no input
emailInput.value = email;

//Inicializar alguns estados úteis
let showPassword = false;

//Adicionar lógica do ícone de senha, para mostrar e esconder esta
passwordIcon.addEventListener('click', () => {
  if (showPassword) {
    passwordIcon.innerHTML = feather.icons['eye'].toSvg();
    passwordInput.setAttribute('type', 'password');
  } else {
    passwordIcon.innerHTML = feather.icons['eye-off'].toSvg();
    passwordInput.setAttribute('type', 'text');
  }
  showPassword = !showPassword;
});

//Checar se senha está válida e nome não está em branco
function validateInputs() {
  let isValid = true;
  if (nameInput.value.trim().length < 1) isValid = false;
  if (passwordInput.value.trim().length < 6) isValid = false;
  if (isValid) return (confirmButton.className = '');
  confirmButton.className = 'disabled';
}

nameInput.addEventListener('input', validateInputs);
passwordInput.addEventListener('input', validateInputs);

//Lógica de confirmação de email!
function confirmEmail(e) {
  console.log('eae');

  e.preventDefault();
  if (confirmButton.className == 'disabled') return;

  fetch('http://localhost:3333/auth/verifyemail', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      name: nameInput.value,
      password: passwordInput.value,
    }),
  })
    .then((stream) => {
      return stream.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

confirmButton.addEventListener('click', confirmEmail);
