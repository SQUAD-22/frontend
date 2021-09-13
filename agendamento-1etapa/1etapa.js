const loaderContainer = document.getElementById('loading');
const officeSelect = document.getElementById('office_select');
const continueButton = document.getElementById('continue_button');
const dateInput = document.getElementById('date_input');

//Setar a data mínima para o agendamento
dateInput.min = new Date().toISOString().split('T')[0];

let selectedOffice = '';
const listOfficesEndpoint = 'http://localhost:3333/office/list';

/**
 *  Esta função implementa a funcionalidade
 * de escolher o escritório.
 */
function handleOfficeSelect(e) {
  const officeId = e.currentTarget.dataset.officeid;

  if (selectedOffice == officeId) return;

  if (selectedOffice == '') {
    //Caso ainda não tenha escolhido nenhum escritório,
    //Inicializar a escolha.
    e.currentTarget.classList.toggle('option_selected');
  } else {
    //Se não, muda o escritório selecionado e suas classes
    const alreadySelectedEl = document.querySelector(
      `[data-officeid="${selectedOffice}"]`
    );
    alreadySelectedEl.classList.toggle('option_selected');
    e.currentTarget.classList.toggle('option_selected');
  }

  selectedOffice = officeId;
}

//Chamar o backend para a lista de escritórios.
fetch(listOfficesEndpoint, {
  method: 'GET',
})
  .then((res) => {
    return res.json();
  })
  //Adicionar opções na lista
  .then((data) => {
    data.forEach((office) => {
      let option = document.createElement('div');
      let availableCount = Math.floor(
        office.deskCount * (office.occupationLimitPercent / 100)
      );

      option.addEventListener('click', handleOfficeSelect, false);
      option.dataset.officeid = office._id;
      option.className = 'office_option';

      option.innerHTML = `
        <div>
          <b>${office.name}</b>
          <p>${office.city} - ${office.state}</p>
        </div>
        <p>${availableCount} vagas</p>
      `;

      officeSelect.appendChild(option);
    });

    loaderContainer.style.display = 'none';
  })
  .catch((err) => {
    alert(err);
  });

function handleContinue() {
  const params = new URLSearchParams();
  params.append('date', dateInput.value);
  params.append('office', selectedOffice);
  window.location.href = '/agendamento/estacao?' + params.toString();
}

continueButton.addEventListener('click', handleContinue);
