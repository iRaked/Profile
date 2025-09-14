document.addEventListener('DOMContentLoaded', () => {
  const pages = Array.from(document.querySelectorAll('.jd-page'));
  let currentIndex = pages.findIndex(p => p.classList.contains('active'));

  function updatePages() {
    pages.forEach((page, i) => {
      if (i === currentIndex) {
        page.classList.add('active');
        page.classList.remove('inactive');
      } else {
        page.classList.remove('active');
        page.classList.add('inactive');
      }
    });
  }

  window.nextPage = function () {
    if (currentIndex < pages.length - 1) {
      currentIndex++;
      updatePages();
    }
  };

  window.prevPage = function () {
    if (currentIndex > 0) {
      currentIndex--;
      updatePages();
    }
  };

  updatePages(); // Inicializa la página activa
});
