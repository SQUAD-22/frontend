const loaderContainer = document.getElementById('loading');
const welcomeText = document.getElementById('welcome-text');
const appointmentCount = document.getElementById('appointment-count');

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/frontend/auth/login';
}

const summaryEndpoint = 'https://fcagenda.herokuapp.com/auth/summary';

//Função que retorna o texto principal
function generateWelcomeText(username) {
  const date = new Date();
  const timeOfTheDay =
    date.getHours() < 11
      ? 'Bom dia, '
      : date.getHours() < 17
      ? 'Boa tarde, '
      : 'Boa noite, ';

  return timeOfTheDay + username.split(' ')[0] + '!';
}

function generateCount(count) {
  if (count == 0) return '';
  return `Você tem ${count} agendamentos<br/>para os próximos dias.`;
}

fetch(summaryEndpoint, {
  method: 'POST',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    authorization: 'Bearer ' + token,
  },
})
  .then((data) => data.json())
  .then((data) => {
    if (data.status == '401')
      return (window.location.href = '/frontend/auth/login');

    welcomeText.innerText = generateWelcomeText(data.userName);
    appointmentCount.innerHTML = generateCount(data.appointmentCount);
    loaderContainer.style.display = 'none';
  });
