//Códigos pertinentes à sidebar da dashboard

//Código sidebar parte 01
document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function() {
    // Remove 'active' de todos
    document.querySelectorAll('.sidebar .nav-link').forEach(el => {
      el.classList.remove('active');
    });

    // Adiciona 'active' ao clicado
    this.classList.add('active');

  });
});

 document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;
      submenu.classList.toggle('show');
      toggle.classList.toggle('open');
    });
  });

//Código atualizado - Ativa automaticamente o menu correspondente à URL atual
window.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    // Remove 'active' de todos
    link.classList.remove('active');

    // Marca como 'active' o link que corresponde à URL atual
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

