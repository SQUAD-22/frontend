const emailInput = document.getElementById('email-input');
const form = document.getElementById('form');
const button = document.getElementById('button');
const errorText = document.getElementById('error');

const registerEndpoint = 'https://fcagenda.herokuapp.com/auth/register';

//Adicionar lógica de login
function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;

  //Colocar o botão de envio em modo de carregamento
  button.className = 'disabled';
  button.disabled = true;
  //Retira o erro
  errorText.innerText = '';

  //Chama a API
  fetch(registerEndpoint, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((data) => data.json())
    .then((data) => {
      //Caso tenha erro, adiciona erro na página
      if (data.errorId) {
        errorText.innerText = data.message;
        button.className = 'enabled';
        button.disabled = false;
      } else {
        window.location.href = '/frontend/auth/checkemail';
      }
    });
}

form.addEventListener('submit', handleSubmit);
