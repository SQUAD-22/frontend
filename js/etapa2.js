const params = new URLSearchParams(window.location.search);
const office = params.get('office');
const date = params.get('date');

//Verificar se os parametros existem
if (!office || !date) {
  alert('Algo deu errado! Por favor, tente novamente.');
  window.location.href = '/frontend/homepage';
}

const loaderContainer = document.getElementById('loading');
const optionList = document.getElementById('select_desk');
const button = document.getElementById('button');
const listDesksEndpoint = 'https://fcagenda.herokuapp.com/desk/listdesks';

//Carregar salas
//Chamar o backend para a lista de escritórios.
fetch(listDesksEndpoint, {
  method: 'POST',
  body: JSON.stringify({ date, office }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((res) => {
    return res.json();
  })
  //Adicionar opções na lista
  .then((data) => {
    const keys = Object.keys(data);
    optionList.style.gridTemplateColumns = `repeat(${Math.ceil(
      keys.length / 5
    )}, 1fr)`;

    Object.keys(data).forEach((deskId) => {
      const el = document.createElement('div');
      el.className = 'option ';
      el.innerHTML = deskId;
      el.className += data[deskId].available
        ? data[deskId].isOccupied
          ? 'occupied'
          : 'available'
        : 'unavailable';
      el.dataset.deskid = deskId;
      if (data[deskId].available && !data[deskId].isOccupied) {
        el.addEventListener('click', handleDesk);
      }

      optionList.appendChild(el);
    });

    loaderContainer.style.display = 'none';
  })
  .catch((err) => {
    alert(err);
  });

let selectedDesk = '';

function handleDesk(e) {
  const deskid = e.currentTarget.dataset.deskid;
  if (selectedDesk == deskid) return;
  if (e.currentTarget.classList.contains('unavailable')) return;
  if (e.currentTarget.classList.contains('occupied')) return;

  if (selectedDesk == '') {
    e.currentTarget.classList.toggle('selected');
  } else {
    const alreadySelectedEl = document.querySelector(
      `[data-deskid="${selectedDesk}"]`
    );
    alreadySelectedEl.classList.toggle('selected');
    e.currentTarget.classList.toggle('selected');
  }
  selectedDesk = deskid;
}

const createAppointmentEndpoint =
  'https://fcagenda.herokuapp.com/appointment/create';

//Criar novo agendamento
function handleContinue(e) {
  if (!selectedDesk) return;

  button.className = 'disabled';
  button.disabled = true;

  fetch(createAppointmentEndpoint, {
    method: 'POST',
    body: JSON.stringify({ date, office, desk: parseInt(selectedDesk) }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.errorId) {
        alert('Algo deu errado! Tente novamente.');
        window.location.reload();
      } else {
        window.location.href =
          '/frontend/agendar/etapa3?appointment=' + data._id;
      }
    });
}

button.addEventListener('click', handleContinue);
