/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
/* --- CONTROL DE SEGURIDAD (LOCK SCREEN) --- */
/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
$(function () {   // = $(document).ready → asegura DOM listo

  // --- Variables ---
  let inputPin   = "";
  const correctPin = "2019";   // PIN de Nanys
  const masterPin  = "####";   // PIN maestro

  const $lock     = $("#lock-screen");
  const $card     = $(".lock-card");
  const $status   = $(".lock-status");
  const $dots     = $(".pin-dot");

  // --- 1. Numpad (clic) ---
  $(".num-btn").on("click", function () {
    const val     = $(this).data("val");
    const isClear = $(this).hasClass("btn-clear");

    // Feedback visual
    const $btn = $(this);
    $btn.css("transform", "scale(0.85)");
    setTimeout(() => $btn.css("transform", "scale(1)"), 100);

    if (isClear) {
      inputPin = inputPin.slice(0, -1);
      updateDots();
      return;
    }

    if (val !== undefined && String(val) !== "*" && inputPin.length < 4) {
      inputPin += String(val);
      updateDots();
      if (inputPin.length === 4) setTimeout(validatePin, 300);
    }
  });

  // --- 2. Teclado físico ---
  $(document).on("keydown", function (e) {
    if ($lock.hasClass("hidden")) return; // ya desbloqueado

    const k = e.key;
    if ((/^[0-9#]$/.test(k)) && inputPin.length < 4) {
      inputPin += k;
      updateDots();
      if (inputPin.length === 4) setTimeout(validatePin, 300);
    } else if (k === "Backspace") {
      inputPin = inputPin.slice(0, -1);
      updateDots();
    }
  });

  // --- 3. Actualizar puntos ---
  function updateDots() {
    $dots.each(function (i) {
      $(this).toggleClass("filled", i < inputPin.length);
    });
  }

  // --- 4. Validar ---
  function validatePin() {
    if (inputPin === correctPin || inputPin === masterPin) {
      unlock();
    } else {
      errorShake();
    }
  }

  // --- 5. Desbloqueo ---
  function unlock() {
    $card.addClass("unlocked");
    $status.text("Acceso Concedido");

    setTimeout(function () {
      $lock.addClass("hidden");
      $(".cyber-overlay").fadeOut(400);

      // Ondas sobre la app (si el plugin está disponible)
      try {
        $(".app-container").ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04
        });
      } catch (err) {
        console.warn("Ripples no disponible:", err);
      }
    }, 650);
  }

  // --- 6. Error ---
  function errorShake() {
    $card.addClass("error-shake");
    $status.text("PIN Incorrecto");

    setTimeout(function () {
      $card.removeClass("error-shake");
      $status.text("Acceso Restringido");
      inputPin = "";
      updateDots();
    }, 550);
  }

});

/* ──────────────────────────────────────────────────────────────────────────
   🎬 MOTOR DE SPRITES (avatar animado)
   ────────────────────────────────────────────────────────────────────────── */
window.SpriteAnimator = class {
  constructor(container, config) {
    this.el = container;
    this.url = config.url;
    this.fps = config.fps || 12;
    this.size = config.size || 64;

    this.currentFrame = 0;
    this.isPlaying = false;
    this.lastTime = 0;
    this.frameDuration = 1000 / this.fps;
    this.rafId = null;

    this.frameWidth = 0;
    this.frameHeight = 0;
    this.totalFrames = 0;
    this.scaledFrameWidth = 0;
    this.scaledFrameHeight = 0;
    this.scaledTotalWidth = 0;
    this.imageLoaded = false;

    this.el.style.backgroundImage = `url('${this.url}')`;
    this.el.style.backgroundRepeat = 'no-repeat';

    this._loadImage();
  }

  _loadImage() {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      this.frameHeight = img.height;
      this.frameWidth = img.height;                 // frames cuadrados
      this.totalFrames = Math.round(img.width / img.height);

      const scale = this.size / this.frameHeight;
      this.scaledFrameWidth = this.frameWidth * scale;
      this.scaledFrameHeight = this.frameHeight * scale;
      this.scaledTotalWidth = img.width * scale;

      this.el.style.width = `${this.size}px`;
      this.el.style.height = `${this.size}px`;
      this.el.style.backgroundSize = `${this.scaledTotalWidth}px ${this.scaledFrameHeight}px`;

      this.imageLoaded = true;
      this.updatePosition();
      this.play();
    };

    img.onerror = () => console.error(`❌ Error cargando sprite: ${this.url}`);
    img.src = this.url;
  }

  play() {
    if (this.isPlaying || !this.imageLoaded || this.totalFrames <= 1) return;
    this.isPlaying = true;
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  _loop(now) {
    if (!this.isPlaying) return;
    this.rafId = requestAnimationFrame((t) => this._loop(t));
    const delta = now - this.lastTime;
    if (delta >= this.frameDuration) {
      this.lastTime = now - (delta % this.frameDuration);
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.updatePosition();
    }
  }

  updatePosition() {
    if (!this.imageLoaded) return;
    const x = -(this.currentFrame * this.scaledFrameWidth);
    this.el.style.backgroundPosition = `${x}px 0px`;
  }

  pause()   { this.isPlaying = false; }
  stop()    { this.pause(); this.currentFrame = 0; this.updatePosition(); }
  destroy() {
    this.pause();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.el.style.backgroundImage = '';
    this.el.style.backgroundPosition = '';
    this.el.style.backgroundSize = '';
  }
  setFps(fps) { this.fps = fps; this.frameDuration = 1000 / fps; }
};

/* ──────────────────────────────────────────────────────────────────────────
   🖼️ HELPER: renderizar avatar (Sprite o Imagen estática)
   ────────────────────────────────────────────────────────────────────────── */
window.renderAvatar = function (container, avatarUrl, opts = {}) {
  const $c = $(container);
  const size = opts.size || $c.outerWidth() || 64;
  const fps  = opts.fps  || 12;

  // ¿Es sprite? (por config explícita o por nombre del archivo)
  const esSprite = opts.sprite === true || (typeof avatarUrl === 'string' && (
    /sprite|sheet|anim|fx|2d/i.test(avatarUrl)
  ));

  // Blindaje: contenedor cuadrado exacto
  $c.css({
    width: size, height: size,
    'min-width': size, 'min-height': size,
    'border-radius': '50%',
    overflow: 'hidden',
    display: 'block',
    'flex-shrink': 0
  });

  // Limpiar animator previo si existe
  const $prev = $c.find('.sprite-layer');
  if ($prev.data('animator')) $prev.data('animator').destroy();

  if (esSprite) {
    $c.empty().append('<div class="sprite-layer"></div>');
    const $layer = $c.find('.sprite-layer');
    const animator = new window.SpriteAnimator($layer[0], { url: avatarUrl, fps, size });
    $layer.data('animator', animator);
    return $layer;
  } else {
    $c.empty();
    const $img = $('<img class="avatar-static" alt="avatar">')
      .attr('src', avatarUrl)
      .css({ width: '100%', height: '100%', 'object-fit': 'cover', 'border-radius': '50%', display: 'block' });
    $c.append($img);
    return $img;
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   ▶️ INICIALIZAR EL AVATAR DE NANYS
   ────────────────────────────────────────────────────────────────────────── */
$(function () {
  // 👇 URL de tu sprite sheet horizontal (frames cuadrados en fila)
  const NANYS_AVATAR = 'https://i.ibb.co/9m0ZTHGM/Nanys-Pink-Motion-FX.png';

  window.renderAvatar('#avatar-circle', NANYS_AVATAR, {
    fps: 12,           // cuadros por segundo
    sprite: true       // fuerza modo sprite (o déjalo en auto por nombre)
    // size: se toma solo del ancho de #avatar-circle
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   🖼️ GALERÍA DEL PANEL CUADRADO (navegada desde la cápsula social)
   ────────────────────────────────────────────────────────────────────────── */
$(function () {

  const GALLERY_IMAGES = [
    'https://i.ibb.co/nMSdpTWb/Nanys.jpg',
    'https://i.ibb.co/99xp4R1H/Xat-Private-Nanys-Motion-GFX.gif'
  ];

  const $gallery = $('#gallery');
  let current = 0;

  // 1. Inyectar las imágenes (la primera activa)
  GALLERY_IMAGES.forEach(function (url, i) {
    const $img = $('<img class="slide">')
      .attr({ src: url, alt: 'Foto ' + (i + 1) })
      .toggleClass('active', i === 0);
    $gallery.append($img);
  });

  const $slides = $gallery.find('.slide');

  // 2. Función para mostrar un índice (con wrap circular)
  function show(index) {
    current = (index + $slides.length) % $slides.length; // siempre positivo
    $slides.removeClass('active').eq(current).addClass('active');
  }

  // 3. Botones < >
  $('#gal-prev').on('click', function () { show(current - 1); });
  $('#gal-next').on('click', function () { show(current + 1); });

  // 4. (Opcional) Teclado: flechas izq/der cuando el lock esté desbloqueado
  $(document).on('keydown', function (e) {
    if ($('#lock-screen').hasClass('hidden')) {
      if (e.key === 'ArrowLeft')  show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    }
  });

});

  /* ──────────────────────────────────────────────────────────────────────────
   🎵 REPRODUCTOR LOCAL (JSON)
   ────────────────────────────────────────────────────────────────────────── */
$(function () {

  // 👇👇👇 URL DE TU JSON 👇👇👇
  const PLAYLIST_URL = 'https://radio-tekileros.vercel.app/Nanys.json';
  const DEFAULT_COVER = 'https://santi-graphics.vercel.app/assets/covers/Cover1.png';

  // --- Estado ---
  const audio = document.getElementById('audio');
    audio.muted = false;        // ✂️ nunca arranca muteado
    audio.volume = 0.7;
  let playlist = [];
  let currentTrack = 0;
  let isPlaying = false;
  let shuffleMode = false;
  let repeatTrack = false;

  // --- Elementos de la UI (los tuyos reales) ---
  const $title   = $('.track-title');
  const $artist  = $('.track-artist');
  const $cover   = $('.track-cover');
  const $fill    = $('#track-progress-fill');
  const $playBtn = $('#play-btn');
  const $playIco = $playBtn.find('i');

  audio.volume = 0.7;
    
    /* ────────────────────────────────────────────────────────────────
     💓 AVATAR REACCIONA AL TRACK (pulsa mientras suena)
     ──────────────────────────────────────────────────────────────── */
  const $avatar = $('#avatar-circle');

  // --- ¿El lock está abierto? ---
  function isUnlocked() {
    return $('#lock-screen').hasClass('hidden');
  }

  // --- Sincronizar icono play/pause + PULSO DEL AVATAR ---
  function setPlaying(state) {
    isPlaying = state;
    if (state) $playIco.removeClass('fa-play').addClass('fa-pause');
    else       $playIco.removeClass('fa-pause').addClass('fa-play');
    $avatar.toggleClass('pulsing', state);   // 💓 late / deja de latir
  }

  // --- Cargar un track por índice ---
  function loadTrack(index) {
    if (!playlist.length) return;
    currentTrack = (index + playlist.length) % playlist.length;
    const t = playlist[currentTrack];

    $title.text(t.nombre || 'Sin título');
    $artist.text(t.artista || 'Artista desconocido');
    $cover.css('background-image', `url('${t.caratula || DEFAULT_COVER}')`);

    audio.src = t.enlace;
    audio.load();

    if (isUnlocked()) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      setPlaying(false);
    }
  }

  // --- Siguiente / Anterior ---
  function nextTrack() {
    const idx = shuffleMode
      ? Math.floor(Math.random() * playlist.length)
      : currentTrack + 1;
    loadTrack(idx);
  }
  function prevTrack() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadTrack(currentTrack - 1);
  }

  // ───── EVENTOS ─────

  // Play / Pause
  $playBtn.on('click', function () {
    if (!playlist.length) return;
    if (audio.paused) {
      if (!audio.src) loadTrack(currentTrack);
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  $('#prev-btn').on('click', prevTrack);
  $('#next-btn').on('click', nextTrack);

  $('#shuffle-btn').on('click', function () {
    shuffleMode = !shuffleMode;
    $(this).toggleClass('active-glow', shuffleMode);
  });

  $('#repeat-btn').on('click', function () {
    repeatTrack = !repeatTrack;
    $(this).toggleClass('active-glow', repeatTrack);
  });

  // Barra de progreso
  audio.addEventListener('timeupdate', function () {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    $fill.css('width', pct + '%');
  });

  // Al terminar → repeat o siguiente
  audio.addEventListener('ended', function () {
    if (repeatTrack) {
      audio.currentTime = 0;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      nextTrack();
    }
  });

  // Feedback visual botones
  $('.ctrl-btn').on('click', function () {
    const $b = $(this);
    $b.css('transform', 'scale(0.9)');
    setTimeout(() => $b.css('transform', ''), 150);
  });

  // ───── INICIALIZACIÓN: traer el JSON ─────
  fetch(PLAYLIST_URL)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(data => {
      playlist = data.varios || data.hits || [];
      if (playlist.length) {
        currentTrack = 0;
        const t = playlist[0];
        $title.text(t.nombre || 'Sin título');
        $artist.text(t.artista || 'Artista desconocido');
        $cover.css('background-image', `url('${t.caratula || DEFAULT_COVER}')`);
        audio.src = t.enlace;
        audio.load();
      }
    })
    .catch(err => console.error('❌ Error cargando playlist:', err));

  // Hook LOCK: al desbloquear, si estaba playing, suena
  const observer = new MutationObserver(function () {
    if (isUnlocked() && isPlaying && audio.paused) {
      audio.play().catch(() => {});
    }
  });
  const lockEl = document.getElementById('lock-screen');
  if (lockEl) observer.observe(lockEl, { attributes: true, attributeFilter: ['class'] });

});

/* ──────────────────────────────────────────────────────────────────────────
   DESBLOQUEO DE AUDIO y VOLUMEN
   ────────────────────────────────────────────────────────────────────────── */
function unlockAudio() {
  // Quitar mute forzado
  audio.muted = false;
  audio.volume = 0.7;

  // "Despertar" el contexto de audio con un play/pause silencioso
  const tryPlay = audio.play();
  if (tryPlay !== undefined) {
    tryPlay
      .then(() => {
        // Si estaba reproduciéndose, lo dejamos; si no, lo pausamos para no arrancar de golpe
        if (!isPlaying) audio.pause();
        console.log('🔊 Audio desbloqueado por interacción');
      })
      .catch(() => {
        // Algunos navegadores igual exigen gesto sobre el propio control; lo reintentamos mute→unmute
        audio.muted = true;
        audio.play().then(() => { audio.muted = false; if (!isPlaying) audio.pause(); }).catch(()=>{});
      });
  }
}

// Una sola vez, en el primer clic/tap/toque en cualquier parte
['click', 'touchstart', 'keydown'].forEach(function (evt) {
  window.addEventListener(evt, function handler() {
    unlockAudio();
    window.removeEventListener(evt, handler);   // se auto-desvincula → corre 1 vez
  }, { once: true, passive: true });
});

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
/* --- MOTOR DE PARTÍCULAS GLOBAL (FONDO DINÁMICO) --- */
/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];
const depth = 1000;
const friction = 0.85;
let mouse = { x: 0, y: 0 };
let mouseDelta = { x: 0, y: 0 };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function Point3D(x, y, z) {
  this.x = x || 0; this.y = y || 0; this.z = z || 0;
}
Point3D.prototype.rotX = function (ang) {
  let y = this.y, z = this.z;
  this.y = y * Math.cos(ang) - z * Math.sin(ang);
  this.z = z * Math.cos(ang) + y * Math.sin(ang);
};
Point3D.prototype.rotY = function (ang) {
  let x = this.x, z = this.z;
  this.x = x * Math.cos(ang) - z * Math.sin(ang);
  this.z = z * Math.cos(ang) + x * Math.sin(ang);
};

function Particle(x, y, z) {
  this.pos = new Point3D(x, y, z);
  this.renderPos = new Point3D(x, y, z);
  this.rotation = new Point3D();
  this.velocity = new Point3D();
  // ✂️ Paleta violeta de Nanys (matiz ~270) en lugar del azul original
  this.color = `hsla(270, 100%, 75%, ${Math.random() * 0.4 + 0.2})`;
}

function init() {
  resize();
  particles = [];
  for (let i = 0; i < 5000; i++) {
    particles.push(new Particle(
      (Math.random() - 0.5) * w * 2.5,
      (Math.random() - 0.5) * h * 2.5,
      (Math.random() - 0.5) * depth
    ));
  }
}

function run() {
  ctx.clearRect(0, 0, w, h);

  // ✂️ Se eliminó el bloque que dibujaba "L O V E" → solo quedan las partículas

  ctx.globalCompositeOperation = "lighter";

  particles.forEach(p => {
    p.velocity.x += mouseDelta.x * 0.2;
    p.velocity.y += mouseDelta.y * 0.2;

    p.renderPos.x = p.pos.x;
    p.renderPos.y = p.pos.y;
    p.renderPos.z = p.pos.z;

    p.rotation.x += p.velocity.x;
    p.rotation.y += p.velocity.y;

    p.renderPos.rotY(p.rotation.y);
    p.renderPos.rotX(p.rotation.x);

    p.velocity.x *= friction;
    p.velocity.y *= friction;

    let s = p.renderPos.z / depth + 1.2;
    ctx.fillStyle = p.color;
    ctx.fillRect(w / 2 + p.renderPos.x, h / 2 + p.renderPos.y, s, s);
  });

  // Rotación constante mínima (movimiento "vivo" aunque no muevas el mouse)
  mouseDelta.x = 0.0003;
  mouseDelta.y = 0.0003;

  requestAnimationFrame(run);
}

window.addEventListener("mousemove", (e) => {
  mouseDelta.x = (e.clientY - mouse.y) / w;
  mouseDelta.y = (e.clientX - mouse.x) / h;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  resize();
  init(); // reinicia para redistribuir según el nuevo tamaño
});

init();
run();

/* ────────────────────────────────────────────────────────────────
   PULSO DEL AVATAR
   ──────────────────────────────────────────────────────────────── */
(function () {
  function bind() {
    const audio = document.getElementById('audio');
    const avatar = document.getElementById('avatar-circle');
    if (!audio || !avatar) return;            // si aún no existen, reintenta
    const $av = $(avatar);

    audio.addEventListener('play',  function () { $av.addClass('pulsing'); });
    audio.addEventListener('pause', function () { $av.removeClass('pulsing'); });
    audio.addEventListener('ended', function () { $av.removeClass('pulsing'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
