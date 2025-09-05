document.addEventListener("DOMContentLoaded", () => {
  const btnLord = document.querySelector(".btn-social-lord");
  const modal = document.querySelector(".modal-lord");
  const closeBtn = document.querySelector(".close-modal");

  // Abrir modal
  btnLord.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  });

  // Cerrar con botón
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  // Cerrar al hacer clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });
});