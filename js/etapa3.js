const params = new URLSearchParams(window.location.search);
const appointment = params.get('appointment');

if (!appointment) {
  alert('Algo deu errado! Por favor, tente novamente.');
}

const detailAppointmentEndpoint =
  'https://fcagenda.herokuapp.com/appointment/detail';

const loaderContainer = document.getElementById('loading');
const boxContainer = document.getElementById('box-container');

//Verificar se existe token
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/frontend/auth/login';
}

fetch(detailAppointmentEndpoint, {
  method: 'POST',
  body: JSON.stringify({ appointment }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    authorization: 'Bearer ' + token,
  },
})
  .then((data) => data.json())
  .then((data) => {
    const weekDay = new Date(data.at.split('-')).toLocaleDateString('pt-br', {
      weekday: 'long',
    });
    const parsedDate = data.at.split('-').reverse().join('/');

    let box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = `
      <h5>Onde?</h5>
      <p class="box-p">${data.office.name}</p>
      <p>Cidade: ${data.office.city}</p>
      <p>Estado: ${data.office.state}</p>

      <h5>Quando?</h5>
      <p><span>Dia ${parsedDate},</span><br />${weekDay}</p>
    `;

    boxContainer.appendChild(box);

    loaderContainer.style.display = 'none';
  });
