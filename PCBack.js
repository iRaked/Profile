document.addEventListener("DOMContentLoaded", () => {
  const modal = document.createElement("div");
  modal.classList.add("modal-img");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content-wrapper");

  const modalImg = document.createElement("img");
  modalImg.classList.add("modal-img-content");

  const caption = document.createElement("p");
  caption.classList.add("modal-caption");

  modalContent.appendChild(modalImg);
  modalContent.appendChild(caption);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Hover zoom en todas las destacadas
  document.querySelectorAll(".gif-highlight-img").forEach(img => {
    img.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.05)";
    });
    img.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });

    // Clic para abrir modal también en Pstyle
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      caption.textContent = img.alt;
      modal.style.display = "flex";
    });
  });

  // También aplica clic en la galería base si existe
  document.querySelectorAll(".gif-item img").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      caption.textContent = img.alt;
      modal.style.display = "flex";
    });
  });

  // Cerrar modal
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Acción "Más Modelos"
  const botonModelos = document.getElementById('mas-modelos');
  if (botonModelos) {
    botonModelos.addEventListener('click', () => {
      window.open('https://enlace-a-modelos.com', '_blank');
    });
  }
});