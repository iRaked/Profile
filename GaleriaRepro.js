document.addEventListener('DOMContentLoaded', () => {
  // === Carrusel ===
  const track = document.getElementById('carouselTrack');
  const cards = Array.from(track.querySelectorAll('.card'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const atmosphericLight = document.getElementById('atmosphericLight');
  
  let currentIndex = 0;
  const cardWidth = 350;
  const gap = 30;
  let isAnimating = false;
  
  // === LOOP INFINITO ===
  const firstCard = cards[0].cloneNode(true);
  const lastCard = cards[cards.length - 1].cloneNode(true);
  
  track.appendChild(firstCard);
  track.insertBefore(lastCard, cards[0]);
  
  const allCards = Array.from(track.querySelectorAll('.card'));
  const totalCards = allCards.length;
  currentIndex = 1;
  
  // Función para actualizar la luz
  const updateAtmosphericLight = () => {
    if (atmosphericLight) {
      const activeCard = track.querySelector('.card.active');
      if (activeCard) {
        atmosphericLight.classList.add('active');
      } else {
        atmosphericLight.classList.remove('active');
      }
    }
  };
  
  // Función principal del carrusel
  const updateCarousel = (animate = true) => {
    const containerWidth = track.parentElement.offsetWidth;
    const offset = (containerWidth / 2) - (cardWidth / 2);
    const translateX = -(currentIndex * (cardWidth + gap)) + offset;
    
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    track.style.transform = `translateX(${translateX}px)`;
    
    allCards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    updateAtmosphericLight();
    
    if (!animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
      });
    }
  };
  
  const checkLoop = () => {
    if (currentIndex === 0) {
      currentIndex = totalCards - 2;
      updateCarousel(false);
    } else if (currentIndex === totalCards - 1) {
      currentIndex = 1;
      updateCarousel(false);
    }
  };
  
  const moveNext = () => {
    if (isAnimating) return;
    isAnimating = true;
    playTransitionSound();
    
    if (atmosphericLight) {
      atmosphericLight.classList.add('transitioning');
    }
    
    currentIndex++;
    updateCarousel(true);
    
    setTimeout(() => {
      checkLoop();
      isAnimating = false;
      if (atmosphericLight) {
        atmosphericLight.classList.remove('transitioning');
      }
    }, 600);
  };
  
  const movePrev = () => {
    if (isAnimating) return;
    isAnimating = true;
    playTransitionSound();
    
    if (atmosphericLight) {
      atmosphericLight.classList.add('transitioning');
    }
    
    currentIndex--;
    updateCarousel(true);
    
    setTimeout(() => {
      checkLoop();
      isAnimating = false;
      if (atmosphericLight) {
        atmosphericLight.classList.remove('transitioning');
      }
    }, 600);
  };
  
  nextBtn.addEventListener('click', moveNext);
  prevBtn.addEventListener('click', movePrev);
  
  // === NAVEGACIÓN POR TECLADO (Flechas) ===
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') moveNext();
    else if (e.key === 'ArrowLeft') movePrev();
  });
  
  // === SWIPE TÁCTIL ===
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance < 0) moveNext();
      else movePrev();
    }
  }, { passive: true });
  
  // Inicializar
  updateCarousel(false);
  
  window.addEventListener('resize', () => {
    updateCarousel(false);
  });
  
  // === MODAL ===
  const modal = document.getElementById('playerModal');
  const playerFrame = document.getElementById('playerFrame');
  const closeModalBtn = document.getElementById('closeModal');
  
  allCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-button')) {
        playClickSound();
        return;
      }
      
      const playerUrl = card.getAttribute('data-player');
      if (playerUrl) {
        playerFrame.src = playerUrl;
        modal.classList.add('active');
      }
    });
  });
  
  const closeModal = () => {
    modal.classList.remove('active');
    playerFrame.src = ''; // Detiene el audio/video al cerrar
  };
  
  closeModalBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // 🔑 SALIDA CON TECLA ESCAPE
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});

// === SISTEMA DE SONIDO ===
const transitionSound = new Audio('https://iraked.github.io/ExtasisRadio/assets/sounds/Binary.mp3');
transitionSound.volume = 0.7;

const playTransitionSound = () => {
  transitionSound.currentTime = 0;
  transitionSound.play().catch(error => {
    console.log('Audio en espera de interacción del usuario');
  });
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playClickSound = () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.08);

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.08);
};