const Handlebars = require('handlebars');

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const dia = String(d.getUTCDate()).padStart(2, '0');
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const ano = d.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatDateForInput(date) {
  if (!date) return '';
  const d = new Date(date);
  const ano = d.getUTCFullYear();
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dia = String(d.getUTCDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function formatTime(hour) {
  if (!hour) return '';
  return hour.slice(0, 5);
}

// Registra os helpers no Handlebars
Handlebars.registerHelper('formatDate', formatDate);
Handlebars.registerHelper('formatDateForInput', formatDateForInput);
Handlebars.registerHelper('formatTime', formatTime);

module.exports = Handlebars;
