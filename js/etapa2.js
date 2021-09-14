const loaderContainer = document.getElementById('loading');
loaderContainer.style.display = 'none';

const optionList = document.getElementById('select_desk');

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

optionList.style.gridTemplateColumns = `repeat(${Math.ceil(237 / 5)}, 1fr)`;

for (let i = 1; i <= 237; i++) {
  const el = document.createElement('div');
  el.className = 'option';
  el.innerHTML = i;
  el.className += i % 2 ? ' unavailable' : ' available';
  el.dataset.deskid = i;
  if (!(i % 2)) el.addEventListener('click', handleDesk);

  optionList.appendChild(el);
}
