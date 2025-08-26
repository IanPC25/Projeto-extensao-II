function mask(input, pattern) {
  input.addEventListener('input', () => {
    let value = input.value.replace(/\D/g, '');
    let i = 0;
    input.value = pattern.replace(/#/g, (_) => value[i++] || '');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const inputMobile = document.querySelector('[name="celular"]');
  const inputPhone = document.querySelector('[name="telefone"]');
  const inputMobileResponsavel = document.querySelector('[name="celularResponsavel"]');
  const inputPhoneResponsavel = document.querySelector('[name="telefoneResponsavel"]');
  const inputMobilePatrocinador = document.querySelector('[name="celularPatrocinador"]');
  const inputPhonePatrocinador = document.querySelector('[name="telefonePatrocinador"]');
  const inputMobileDoacao = document.querySelector('[name="celularResponsavelPelaDistribuicao"]');
  const inputPhoneDoacao = document.querySelector('[name="telefoneResponsavelPelaDistribuicao"]');
  if (inputMobile) mask(inputMobile, '(##) #####-####');
  if (inputPhone) mask(inputPhone, '(##) ####-####');
  if (inputMobileResponsavel) mask(inputMobileResponsavel, '(##) #####-####');
  if (inputPhoneResponsavel) mask(inputPhoneResponsavel, '(##) ####-####');
  if (inputMobilePatrocinador) mask(inputMobilePatrocinador, '(##) #####-####');
  if (inputPhonePatrocinador) mask(inputPhonePatrocinador, '(##) ####-####');
  if (inputMobileDoacao) mask(inputMobileDoacao, '(##) #####-####');
  if (inputPhoneDoacao) mask(inputPhoneDoacao, '(##) ####-####');
});
