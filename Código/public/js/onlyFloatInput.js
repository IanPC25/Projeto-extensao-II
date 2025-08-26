const priceInputs = document.querySelectorAll('.valor');

priceInputs.forEach((priceInput) => {
  priceInput.addEventListener('input', function (e) {
    let value = e.target.value;

    value = value.replace(/\D/g, '');

    if (!value) {
      e.target.value = '';
      return;
    }

    const formatted = (parseInt(value, 10) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    e.target.value = formatted;
  });
});
