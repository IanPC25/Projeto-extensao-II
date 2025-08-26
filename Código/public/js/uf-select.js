document.addEventListener("DOMContentLoaded", () => {
  const ufs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];
  const select = document.getElementById("uf");

  if (!select) return; // evita erro se select não existir na página

  ufs.forEach((uf) => {
    const option = document.createElement("option");
    option.value = uf;
    option.textContent = uf;
    select.appendChild(option);
  });
});
