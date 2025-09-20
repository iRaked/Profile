document.addEventListener('DOMContentLoaded', () => {
  // 🔵 Activación Bluetooth
  document.getElementById('bluetooth-icono').classList.add('activo');

  // 🕒 Referencias únicas
  const reloj = document.getElementById('reloj');
  const botonClock = document.getElementById('boton-1');
  const modalReloj = document.getElementById('modal-reloj');
  const canvas = document.getElementById('canvas-reloj');
  const ctx = canvas.getContext('2d');
  const radio = canvas.width / 2;
  ctx.translate(radio, radio);

  const botonCalculadora = document.getElementById("boton-calculadora");
  const modalCalculadora = document.getElementById("modal-calculadora");

  const botonBrujula = document.getElementById('btn-brujula');
  const modalBrujula = document.getElementById("modal-brujula");
  const flecha = document.getElementById("flecha-direccion");
  const direccionTexto = document.getElementById("direccion");
  const ubicacionTexto = document.getElementById("ubicacion");
  const fechaTexto = document.getElementById("fecha");

  const botonWeather = document.getElementById("btn-weather");
  const modalWeather = document.getElementById("modal-weather");

  const btnJuego = document.getElementById("btn-juego");
  const modalJuego = document.getElementById("modal-juego");
  const iframeJuego = document.getElementById("iframe-juego");
    
  const btnVideo = document.getElementById("btn-video");
  const modalVideo = document.getElementById("modal-video");
  const videoFondo = document.getElementById("video-fondo");

  const btnNotas = document.getElementById("btn-notas");
  const modalNotas = document.getElementById("modal-notas");
  const areaNotas = document.getElementById("area-notas");
  const guardarNotas = document.getElementById("guardar-notas");

  const btnFotos = document.getElementById("btn-fotos");
  const modalSliderFotos = document.getElementById("modal-slider-fotos");
  const fotoExpandida = document.getElementById("foto-expandida");
  const imagenGrande = document.getElementById("imagen-grande");

  const botonItunes = document.getElementById("boton-itunes");
  const modalPlayer = document.getElementById("modal-player");
  const cerrarModal = document.querySelector(".close-modal");
  const modalContent = document.getElementById("modal-content");

  const bloqueIMusic = document.getElementById("bloque-iMusic");

  const btnPower = document.getElementById("btn-power");
  const powerOverlay = document.getElementById("power-overlay");
  const powerImg = powerOverlay.querySelector("img");
    
  const btnContacts = document.getElementById("btn-contacts");
  const modalContacts = document.getElementById("modal-contacts");
  const closeContacts = document.getElementById("close-contacts");
  const contactsContainer = modalContacts.querySelector(".contacts-container");

  
// Llamdo a JSON music
fetch("iTunes.json")
  .then(res => res.json())
  .then(data => {
    const playlistHits = data.hits;
    if (!Array.isArray(playlistHits)) {
      console.warn("⚠️ El JSON no contiene un array válido en 'hits'");
      return;
    }

    // Activar el reproductor desde el botón iTunes
    botonItunes.addEventListener("click", () => {
      initModalPlayer("bloque-iMusic", playlistHits);
    });
  })
  .catch(err => {
    console.error("⚠️ Error al cargar el JSON:", err);
  });

  // 🕒 Reloj digital ritualizado
  function actualizarReloj() {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    reloj.textContent = `${horas}:${minutos}`;
  }

  setInterval(actualizarReloj, 30000);
  actualizarReloj();

  // 🔋 Batería energética compacta
  let nivel = 100;
  let descargando = true;

  function actualizarBateria() {
    const barra = document.getElementById('nivel-bateria');
    const anchoMaximo = 29;
    const anchoActual = (nivel / 100) * anchoMaximo;

    barra.setAttribute('width', anchoActual.toFixed(1));

    if (nivel > 50) {
      barra.setAttribute('fill', '#00ff00');
    } else if (nivel > 20) {
      barra.setAttribute('fill', '#ffff00');
    } else {
      barra.setAttribute('fill', '#ff0000');
    }

    if (descargando) {
      nivel -= 10;
      if (nivel <= 0) {
        nivel = 0;
        descargando = false;
      }
    } else {
      nivel += 10;
      if (nivel >= 100) {
        nivel = 100;
        descargando = true;
      }
    }
  }

  setInterval(actualizarBateria, 120000);
  actualizarBateria();

  // 🕰️ Modal del reloj análogo
  botonClock.addEventListener('click', () => {
    modalReloj.classList.toggle('oculto');
    dibujarRelojAnalogico(); // Invoca al abrir
  });

  // 🧭 Reloj análogo en canvas
  function dibujarRelojAnalogico() {
    function dibujar() {
      const ahora = new Date();
      const horas = ahora.getHours() % 12;
      const minutos = ahora.getMinutes();
      const segundos = ahora.getSeconds();

      ctx.clearRect(-radio, -radio, canvas.width, canvas.height);

      // Fondo
      ctx.beginPath();
      ctx.arc(0, 0, radio - 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Números
      ctx.font = '12px Courier New';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let num = 1; num <= 12; num++) {
        const ang = (num * Math.PI) / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radio + 18);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radio - 18);
        ctx.rotate(-ang);
      }

      // Manecillas
      dibujarManecilla(((horas + minutos / 60) * Math.PI) / 6, radio * 0.5, 4);
      dibujarManecilla(((minutos + segundos / 60) * Math.PI) / 30, radio * 0.75, 3);
      dibujarManecilla((segundos * Math.PI) / 30, radio * 0.85, 1, '#ff0000');
    }

    function dibujarManecilla(angulo, largo, grosor, color = '#ffffff') {
      ctx.beginPath();
      ctx.lineWidth = grosor;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(0, 0);
      ctx.rotate(angulo);
      ctx.lineTo(0, -largo);
      ctx.stroke();
      ctx.rotate(-angulo);
    }

    setInterval(dibujar, 1000);
    dibujar(); // Inicial
  }
    
    // 🕰️ Cierre al hacer clic fuera del modal Reloj
document.addEventListener("click", (e) => {
  const dentroDelModal = modalReloj.contains(e.target);
  const esBoton = botonClock.contains(e.target);

  if (!modalReloj.classList.contains("oculto") && !dentroDelModal && !esBoton) {
    modalReloj.classList.add("oculto");
  }
});
    
// Calculadora
    botonCalculadora.addEventListener("click", (e) => {
  e.stopPropagation();
  modalCalculadora.classList.toggle("oculto");
});

document.addEventListener("click", (e) => {
  const dentroDelModal = modalCalculadora.contains(e.target);
  const esBoton = botonCalculadora.contains(e.target);

  if (!modalCalculadora.classList.contains("oculto") && !dentroDelModal && !esBoton) {
    modalCalculadora.classList.add("oculto");
  }
});


// Camara
document.getElementById("btn-camera").addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.style.position = "absolute";
      video.style.top = "140px";
      video.style.left = "196px";
      video.style.width = "140px";
      video.style.height = "140px";
      video.style.borderRadius = "12px";
      video.style.zIndex = "29";
      document.body.appendChild(video);
    })
    .catch(err => {
      console.error("No se pudo acceder a la cámara:", err);
    });
});
// Brújula
  // 🧭 Estado de brújula
  let brujulaActiva = false;

  // 🧭 Listener único de orientación
  window.addEventListener("deviceorientation", (event) => {
    if (!brujulaActiva) return; // Solo actualiza si el modal está activo

    const alpha = Math.round(event.alpha);
    direccionTexto.textContent = `Dirección: ${alpha}°`;

    if (!isNaN(alpha)) {
      flecha.style.transform = `rotate(${alpha}deg)`;
    }
  });

  // 🧭 Abrir modal brújula
  botonBrujula.addEventListener("click", () => {
  const estaVisible = !modalBrujula.classList.contains("oculto");

  if (estaVisible) {
    // Si ya está visible, lo ocultamos
    modalBrujula.classList.add("oculto");
    brujulaActiva = false;
  } else {
    // Si está oculto, lo mostramos
    modalBrujula.classList.remove("oculto");
    brujulaActiva = true;

    if (!("DeviceOrientationEvent" in window)) {
      direccionTexto.textContent = "Brújula no disponible";
    }
  }
});

  // 🧭 Cierre al hacer clic fuera
  document.addEventListener("click", (e) => {
    const dentroDelModal = modalBrujula.contains(e.target);
    const esBoton = botonBrujula.contains(e.target);

    if (!modalBrujula.classList.contains("oculto") && !dentroDelModal && !esBoton) {
      modalBrujula.classList.add("oculto");
      brujulaActiva = false;
    }
  });

  // 🧭 Cierre universal con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modales = document.querySelectorAll(".modal-brujula, .modal-reloj, .modal-calculadora");
      modales.forEach(modal => modal.classList.add("oculto"));
      brujulaActiva = false;
    }
  });
    
// Panel de Tiempo
// 📍 Ubicación automática
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      ubicacionTexto.textContent = `Ubicación: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    },
    () => {
      ubicacionTexto.textContent = "Ubicación no disponible";
    }
  );
} else {
  ubicacionTexto.textContent = "Geolocalización no soportada";
}

// 📅 Fecha automática
const hoy = new Date();
const dia = hoy.getDate();
const mes = hoy.toLocaleString("es-MX", { month: "long" });
const año = hoy.getFullYear();
fechaTexto.textContent = `Fecha: ${dia} de ${mes} de ${año}`;

  // El Clima
  // Detectar ubicación del visitante
navigator.geolocation.getCurrentPosition(function(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const apiKey = "19a7455345ccb80b006323b0d4123bd6";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        console.error("Error de API:", data.message);
        return;
      }

      // Icono en el botón
      const iconCode = data.weather[0].icon;
      const iconUrl = "assets/img/Weather.png"; // Ícono personalizado de Ivanovich
      const descripcion = data.weather[0].description;
      const temperatura = data.main.temp.toFixed(1);
      const humedad = data.main.humidity;

      const weatherBtn = document.getElementById("btn-weather");
      if (weatherBtn && weatherBtn.querySelector("img")) {
        weatherBtn.querySelector("img").src = iconUrl;
        weatherBtn.title = `${descripcion}, ${temperatura}°C`;
      }

      // Actualizar contenido del modal
      document.getElementById("estado-clima").textContent = `Clima actual: ${descripcion}`;
      document.getElementById("temp-clima").textContent = `Temperatura: ${temperatura}°C`;
      document.getElementById("humedad-clima").textContent = `Humedad: ${humedad}%`;

      // Estación (estimada por mes)
      const mes = new Date().getMonth(); // 0 = enero
      const estaciones = ["Invierno", "Primavera", "Verano", "Otoño"];
      let estacion = "";

      if ([11, 0, 1].includes(mes)) estacion = estaciones[0];
      else if ([2, 3, 4].includes(mes)) estacion = estaciones[1];
      else if ([5, 6, 7].includes(mes)) estacion = estaciones[2];
      else estacion = estaciones[3];

      document.getElementById("estacion-clima").textContent = `Estación: ${estacion}`;
    })
    .catch(error => console.error("Error al obtener clima:", error));
});
    
// Modal Del Clima
// Activación del modal
botonWeather.addEventListener("click", () => {
  modalWeather.classList.toggle("oculto");
});

// Cierre por clic fuera
document.addEventListener("click", (e) => {
  const dentroDelModal = modalWeather.contains(e.target);
  const esBoton = botonWeather.contains(e.target);

  if (!modalWeather.classList.contains("oculto") && !dentroDelModal && !esBoton) {
    modalWeather.classList.add("oculto");
  }
});

// Cierre con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalWeather.classList.contains("oculto")) {
    modalWeather.classList.add("oculto");
  }
});
    
// YouTube
const botonYT = document.getElementById("btn-youtube");
const modalYT = document.getElementById("modal-youtube");
const ytFrame = document.getElementById("yt-frame");

botonYT.addEventListener("click", () => {
  const estaVisible = !modalYT.classList.contains("oculto");

  if (estaVisible) {
    modalYT.classList.add("oculto");
    ytFrame.src = ""; // Detiene el video
  } else {
    ytFrame.src = "https://www.youtube.com/embed/3UapvTwmxV8?autoplay=1";
    modalYT.classList.remove("oculto");
  }
});

document.addEventListener("click", (e) => {
  const dentroDelModal = modalYT.contains(e.target);
  const esBoton = botonYT.contains(e.target);

  if (!modalYT.classList.contains("oculto") && !dentroDelModal && !esBoton) {
    modalYT.classList.add("oculto");
    ytFrame.src = ""; // Detiene el video
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalYT.classList.contains("oculto")) {
    modalYT.classList.add("oculto");
    ytFrame.src = ""; // Detiene el video
  }
});
// Video Out
// Mostrar modal al presionar botón
btnVideo.addEventListener("click", () => {
  modalVideo.classList.remove("oculto");
});

// Cerrar modal al hacer clic fuera del video
modalVideo.addEventListener("click", (e) => {
  if (!videoFondo.contains(e.target)) {
    modalVideo.classList.add("oculto");
  }
});

// Cerrar con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalVideo.classList.add("oculto");
  }
});

    
// Modal Safari Game
    btnJuego.addEventListener("click", (e) => {
  e.stopPropagation();
  const visible = !modalJuego.classList.contains("oculto");

  if (visible) {
    modalJuego.classList.add("oculto");
    iframeJuego.src = "";
  } else {
    iframeJuego.src = "https://iraked.github.io/Games/Rider.html";
    modalJuego.classList.remove("oculto");
  }
});

document.addEventListener("click", (e) => {
  const dentroModal = modalJuego.contains(e.target);
  const esBoton = btnJuego.contains(e.target);

  if (!modalJuego.classList.contains("oculto") && !dentroModal && !esBoton) {
    modalJuego.classList.add("oculto");
    iframeJuego.src = "";
  }
});

// Boton Notas
    // 📝 Alternar apertura/cierre con el botón
btnNotas.addEventListener("click", () => {
  modalNotas.classList.toggle("oculto");
});

// 💾 Guardar Nota en localStorage y cerrar
guardarNotas.addEventListener("click", () => {
  const texto = areaNotas.value.trim();
  if (texto !== "") {
    localStorage.setItem("notaPersonal", texto);
    modalNotas.classList.add("oculto");
  }
});

// ❌ Cierre al hacer clic fuera del modal
document.addEventListener("click", (e) => {
  const dentroDelModal = modalNotas.contains(e.target);
  const esBoton = btnNotas.contains(e.target);

  if (!modalNotas.classList.contains("oculto") && !dentroDelModal && !esBoton) {
    modalNotas.classList.add("oculto");
  }
});

// ⌨️ Cierre con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalNotas.classList.contains("oculto")) {
    modalNotas.classList.add("oculto");
  }
});
    
// Modal Photos Slider
// Mostrar/ocultar slider con botón Fotos
btnFotos.addEventListener("click", () => {
  modalSliderFotos.classList.toggle("oculto");

  // Cierra imagen expandida si está abierta
  if (!fotoExpandida.classList.contains("oculto")) {
    fotoExpandida.classList.add("oculto");
  }
});

// Expandir imagen al hacer clic
document.querySelectorAll(".foto-mini").forEach((foto) => {
  foto.addEventListener("click", () => {
    imagenGrande.src = foto.src;
    fotoExpandida.classList.remove("oculto");
  });
});

// Cerrar imagen expandida al hacer clic fuera
fotoExpandida.addEventListener("click", () => {
  fotoExpandida.classList.add("oculto");
});

// Cierre universal con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalSliderFotos.classList.add("oculto");
    fotoExpandida.classList.add("oculto");
  }
});

// Cierre al hacer clic fuera del botón y del modal
document.addEventListener("click", (e) => {
  const dentroDelModal = modalSliderFotos.contains(e.target);
  const esBotonFotos = btnFotos.contains(e.target);

  if (!modalSliderFotos.classList.contains("oculto") && !dentroDelModal && !esBotonFotos) {
    modalSliderFotos.classList.add("oculto");
  }
});
// Boton Mensajes/Notificaciones
(() => {
  const btnNotificaciones = document.getElementById("btn-notificaciones");
  const contenedor = document.getElementById("notificaciones-container");

  let index = 0;
  let intervalo;
  let activo = false;
  let mensajesJSON = [];

  function crearBurbuja(mensaje) {
    const burbuja = document.createElement("div");
    burbuja.className = `burbuja-notificacion tipo-${mensaje.tipo}`;
    burbuja.textContent = mensaje.texto;
    contenedor.appendChild(burbuja);

    setTimeout(() => {
      burbuja.remove();
    }, 3000);
  }

  function iniciarNotificaciones() {
    contenedor.classList.remove("oculto");
    index = 0;
    activo = true;

    // Primera burbuja al segundo 1
    setTimeout(() => {
      if (index < mensajesJSON.length) {
        crearBurbuja(mensajesJSON[index]);
        index++;
      }

      // Luego cada 3 segundos
      intervalo = setInterval(() => {
        if (index >= mensajesJSON.length) {
          detenerNotificaciones();
          return;
        }
        crearBurbuja(mensajesJSON[index]);
        index++;
      }, 3000);
    }, 1000);
  }

  function detenerNotificaciones() {
    clearInterval(intervalo);
    activo = false;
    contenedor.classList.add("oculto");
    contenedor.innerHTML = "";
  }

  btnNotificaciones.addEventListener("click", () => {
    if (activo) {
      detenerNotificaciones();
    } else {
      fetch("iPhone.json") // Ajusta la ruta si está en /assets/data/
        .then(res => {
          if (!res.ok) throw new Error("No se pudo cargar el JSON");
          return res.json();
        })
        .then(data => {
          mensajesJSON = data;
          iniciarNotificaciones();
        })
        .catch(err => {
          console.error("Error al cargar el JSON:", err);
        });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activo) {
      detenerNotificaciones();
    }
  });
})();
// Boton iTunes
    botonItunes.addEventListener("click", () => {
  modalPlayer.classList.remove("hidden");
});

cerrarModal.addEventListener("click", () => {
  modalPlayer.classList.add("hidden");
});
    // 🔹 Cierre con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalPlayer.classList.add("hidden");
  }
});

// 🔹 Cierre con clic fuera del contenido
modalPlayer.addEventListener("click", (e) => {
  if (!modalContent.contains(e.target)) {
    modalPlayer.classList.add("hidden");
  }
});
// =================================================================================
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎛️ Reproductor Modal Universal con navegación, cola, controles extendidos, progreso visual interactivo y control de colisión

let isModalActive = false;

function initModalPlayer(contenedorId, playlistData) {
  const container = document.getElementById(contenedorId);
  if (!container || !Array.isArray(playlistData)) return;

  const modal = document.getElementById("modal-player");
  const modalAudio = document.getElementById("modal-audio"); // No Tocar
  const modalCover = document.getElementById("modal-cover");
  const modalArtist = document.getElementById("modal-artist");
  const modalTitle = document.getElementById("modal-title");
  const closeBtn = document.querySelector(".close-modal");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const modalQueue = document.getElementById("modal-queue");

  const volumeControl = document.getElementById("volume-control");
  const speedControl = document.getElementById("speed-control");
  const loopToggle = document.getElementById("loop-toggle");
  const muteToggle = document.getElementById("mute-toggle");

  const toggleBtn = document.getElementById("btn-toggle");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.querySelector(".progress-container");

  let currentIndex = -1;
  const localPlaylist = [...playlistData];

  function showModal(track) {
    isModalActive = true;

    modalCover.src = track.caratula;
    modalArtist.textContent = track.artista;
    modalTitle.textContent = track.nombre;

    const bloqueIMusic = document.getElementById("bloque-iMusic");
    if (bloqueIMusic) {
      bloqueIMusic.innerHTML = `
        <div class="track-info" style="display: flex; align-items: center;">
          <img src="${track.caratula}" alt="Carátula" class="caratula-mini" style="width: 32px; height: 32px; border-radius: 6px; margin-right: 8px;" />
          <div class="meta">
            <strong>${track.artista}</strong><br>
            <span>${track.nombre}</span><br>
            <span id="track-time" class="track-time">0:00</span>
          </div>
        </div>
      `;
    }

    modalAudio.pause();
    modalAudio.removeAttribute("src");
    modalAudio.src = track.enlace;
    modalAudio.load();

    modal.classList.remove("hidden");

    modalCover.classList.add("animate");
    setTimeout(() => modalCover.classList.remove("animate"), 400);

    modalAudio.oncanplay = () => {
      modalAudio.play().catch(err => {
        console.warn("⚠️ Error al reproducir:", err.name);
      });

      const icon = toggleBtn?.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      }
    };
  }

  function playTrack(index) {
    if (index < 0 || index >= localPlaylist.length) return;

    currentIndex = index;
    showModal(localPlaylist[index]);

    if (btnNext) {
      btnNext.onclick = () => {
        if (currentIndex < localPlaylist.length - 1) {
          playTrack(currentIndex + 1);
        }
      };
    }

    if (btnPrev) {
      btnPrev.onclick = () => {
        if (currentIndex > 0) {
          playTrack(currentIndex - 1);
        }
      };
    }

    modalAudio.onended = () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < localPlaylist.length) {
        playTrack(nextIndex);
      } else {
        currentIndex = -1;
        const icon = toggleBtn?.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
        }
        if (progressBar) progressBar.style.width = "0%";
      }
    };
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      isModalActive = false;
      closeBtn.click();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      isModalActive = false;
      closeBtn.click();
    }
  });

  closeBtn.addEventListener("click", () => {
    isModalActive = false;
    modal.classList.add("hidden");
    modalAudio.pause();
    modalAudio.removeAttribute("src");
    currentIndex = -1;
    const icon = toggleBtn?.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
    if (progressBar) progressBar.style.width = "0%";

    const bloqueIMusic = document.getElementById("bloque-iMusic");
    if (bloqueIMusic && currentIndex >= 0) {
      const track = localPlaylist[currentIndex];
      bloqueIMusic.innerHTML = `
        <div class="track-info" style="display: flex; align-items: center;">
          <img src="${track.caratula}" alt="Carátula" class="caratula-mini" style="width: 32px; height: 32px; border-radius: 6px; margin-right: 8px;" />
          <div class="meta">
            <strong>${track.artista}</strong><br>
            <span>${track.nombre}</span><br>
            <span id="track-time" class="track-time">0:00</span>
          </div>
        </div>
      `;
    }
  });

  if (volumeControl) {
    volumeControl.addEventListener("input", () => {
      modalAudio.volume = parseFloat(volumeControl.value);
    });
  }

  if (speedControl) {
    speedControl.addEventListener("change", () => {
      modalAudio.playbackRate = parseFloat(speedControl.value);
    });
  }

  if (loopToggle) {
    loopToggle.addEventListener("click", () => {
      modalAudio.loop = !modalAudio.loop;
      loopToggle.textContent = `Loop: ${modalAudio.loop ? "On" : "Off"}`;
    });
  }

  if (muteToggle) {
    muteToggle.addEventListener("click", () => {
      modalAudio.muted = !modalAudio.muted;
      muteToggle.textContent = modalAudio.muted ? "Unmute" : "Mute";
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const icon = toggleBtn.querySelector("i");
      if (!icon) return;

      if (modalAudio.paused) {
        modalAudio.play().catch(err => {
          console.warn("⚠️ Error al reproducir:", err.name);
        });
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      } else {
        modalAudio.pause();
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
    });
  }

  modalAudio.addEventListener("timeupdate", () => {
    if (modalAudio.duration && progressBar) {
      const percent = (modalAudio.currentTime / modalAudio.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }

    const trackTimeDisplay = document.getElementById("track-time");
    if (trackTimeDisplay) {
      const currentTime = Math.floor(modalAudio.currentTime);
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      trackTimeDisplay.textContent = formattedTime;
    }
  });

  if (progressContainer && progressBar) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      modalAudio.currentTime = percent * modalAudio.duration;
      progressBar.style.width = `${percent * 100}%`;
    });
  }

  playTrack(0);
}

// Botón Power *********************************************************************
btnPower.addEventListener("click", () => {
  powerOverlay.style.display = "flex";
  powerOverlay.style.opacity = "1";
  powerOverlay.style.visibility = "visible";
  powerOverlay.querySelector("img").style.animation = "fadePower 6s forwards";
});

powerOverlay.querySelector("img").addEventListener("animationend", () => {
  powerOverlay.style.display = "none";
  powerOverlay.style.opacity = "0";
  powerOverlay.style.visibility = "hidden";
});

// Modal Contactos
// 🧭 Abrir modal Contactos
  btnContacts.addEventListener("click", () => {
    modalContacts.classList.remove("oculto");
    modalContacts.style.display = "flex";
    modalContacts.style.opacity = "1";
    modalContacts.style.visibility = "visible";
  });

  // 🧭 Cierre con botón X
  closeContacts.addEventListener("click", () => {
    cerrarModalContacts();
  });

  // 🧭 Cierre al hacer clic fuera del contenido
  document.addEventListener("click", (e) => {
    const dentroDelModal = contactsContainer.contains(e.target);
    const esBoton = btnContacts.contains(e.target);
    const esCierre = closeContacts.contains(e.target);

    if (!modalContacts.classList.contains("oculto") && !dentroDelModal && !esBoton && !esCierre) {
      cerrarModalContacts();
    }
  });

  // 🧭 Cierre universal con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarModalContacts();
    }
  });

  // 🧭 Función de cierre
  function cerrarModalContacts() {
    modalContacts.classList.add("oculto");
    modalContacts.style.display = "none";
    modalContacts.style.opacity = "0";
    modalContacts.style.visibility = "hidden";
  }


}); // ← este es el verdadero cierre del DOMContentLoaded
