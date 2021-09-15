const loaderContainer = document.getElementById('loading');
const appointmentList = document.getElementById('appointment-list');
const cancelButton = document.getElementById('cancel-button');
const nothingContainer = document.getElementById('nothing');

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/frontend/auth/login';
}

const listEndpoint = 'https://fcagenda.herokuapp.com/appointment/list';

fetch(listEndpoint, {
  method: 'GET',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    authorization: 'Bearer ' + token,
  },
})
  .then((data) => data.json())
  .then((data) => {
    if (data.status == '401')
      return (window.location.href = '/frontend/auth/login');
    if (data.length > 0) {
      nothingContainer.style.display = 'none';
    }

    data.forEach((appointment) => {
      const formattedDate = appointment.at.split('-').reverse().join('/');

      let el = document.createElement('div');
      el.className = 'appointment';
      el.innerHTML = `
        <h2>Dia ${formattedDate}</h2>
        <h3>${appointment.office.name}</h3>
        <br />
        <span>Cidade/Estado</span>
        <p>${appointment.office.city}/${appointment.office.state}</p>
        <br />
        <span>N° da estação</span>
        <p>${appointment.desk}</p>
        <br />
      `;

      const cancelButton = document.createElement('button');
      cancelButton.id = 'cancel-button';
      cancelButton.dataset.appointment = appointment._id;
      cancelButton.addEventListener('click', handleCancel);
      cancelButton.innerHTML = `
        <span>CANCELAR</span>
      `;
      el.appendChild(cancelButton);

      appointmentList.appendChild(el);
    });
    loaderContainer.style.display = 'none';
  });

let selectedCancel = '';
const cancelEndpoint = 'https://fcagenda.herokuapp.com/appointment/cancel';

function handleCancel(e) {
  const appointment = e.currentTarget.dataset.appointment;

  console.log('eaeee');

  if (selectedCancel !== appointment) {
    //Resetar estilo do selecionado anterior
    const previousSelected = document.querySelector(
      `[data-appointment='${selectedCancel}']`
    );
    if (previousSelected) {
      previousSelected.classList.toggle('confirm');
      previousSelected.innerHTML = 'CANCELAR';
    }

    selectedCancel = appointment;
    e.currentTarget.classList.toggle('confirm');
    e.currentTarget.innerText = 'TOQUE PARA CONFIRMAR';
  } else {
    e.currentTarget.classList.toggle('confirm');
    e.currentTarget.classList.toggle('disabled');
    e.currentTarget.innerHTML = `<i class="fas fa-circle-notch fa-spin fa-1x"></i>`;
    e.currentTarget.disabled = true;

    fetch(cancelEndpoint, {
      method: 'DELETE',
      body: JSON.stringify({
        appointment: selectedCancel,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: 'Bearer ' + token,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data.errorId) {
          window.location.reload();
        }
      });
  }
}
