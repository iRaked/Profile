document.addEventListener("DOMContentLoaded", function() {
  // Abrir modal
  document.querySelectorAll('.modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      modal.style.display = 'flex';
    });
  });

  // Cerrar con X
  document.querySelectorAll('.modal-close-x').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });

  // Cerrar con clic fuera
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target.classList.contains('modal-overlay')) {
        modal.style.display = 'none';
      }
    });
  });

  // Cerrar con ESC
  document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
});
