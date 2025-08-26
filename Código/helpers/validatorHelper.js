function requiredMsg(field) {
  return `O campo '${field}' é obrigatório.`;
}

function minCharsMsg(field, min) {
  return `O campo '${field}' precisa ter no mínimo '${min}' caracteres.`;
}

function uniqueMsg(field) {
  return `O '${field}' informado já está em uso. Por favor, informe outro '${field}'.`;
}

function selectMsg(field) {
  return `Selecione um(a) '${field}'.`;
}

function selectAtLeastOneMsg(field) {
  return `Selecione pelo menos um(a) '${field}'.`;
}

function invalidFieldMsg(field, format) {
  return `O '${field}' deve estar no formato '${format}'.`;
}

function greaterThanMsg(field1, field2) {
  return `'${field1}' deve ser maior que '${field2}'.`;
}

function notGreaterThanMsg(field1, field2) {
  return `A quantidade de ${field1} não pode ser maior que a quantidade de ${field2}.`;
}

module.exports = {
  requiredMsg,
  minCharsMsg,
  uniqueMsg,
  selectMsg,
  selectAtLeastOneMsg,
  invalidFieldMsg,
  greaterThanMsg,
  notGreaterThanMsg,
};
