const integerInputs = document.querySelectorAll('.valor-inteiro');

integerInputs.forEach((input) => {
  input.addEventListener('input', function (e) {
    const value = e.target.value;

    const intValue = parseInt(value, 10);

    if (isNaN(intValue)) {
      e.target.value = '';
      return;
    }

    e.target.value = intValue;
  });
});
