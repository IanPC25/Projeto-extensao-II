const yesRadio = document.getElementById('yes');
const noRadio = document.getElementById('no');
const inputField = document.getElementById('amountReceivedId');

window.addEventListener('DOMContentLoaded', () => {
  if (yesRadio.checked) {
    textAreaField.style.display = 'block';
  } else {
    textAreaField.style.display = 'none';
  }
});

yesRadio.addEventListener('change', () => {
  if (yesRadio.checked) {
    textAreaField.style.display = 'block';
  }
});

noRadio.addEventListener('change', () => {
  if (noRadio.checked) {
    textAreaField.style.display = 'none';
  }
});
