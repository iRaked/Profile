/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚀 MOTOR JARVIS: NÚCLEO ESTABLE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Jarvis = {
    // Referencias rápidas
    card: document.querySelector('.card-vertical'),
    player: document.getElementById('spotune-player'),
    timer: document.getElementById("countdown-timer"),
    
    // 🚀 Cumpleaños de Copilot (7 de febrero)
    targetDate: new Date("February 7, 2027 00:00:00").getTime()
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LÓGICA DE ACCESO — INTEGRACIÓN TOTAL
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener('DOMContentLoaded', () => {
    const accessBtn = document.querySelector('.access-btn');
    const accessScreen = document.querySelector('.access-screen');

    if (accessBtn && accessScreen) {
        accessBtn.addEventListener('click', () => {
            console.log("🚀 Acceso concedido: Vic");

            // 1. DESBLOQUEO DE AUDIO (Indispensable para Spotune)
            if (typeof Spotune !== 'undefined') {
                Spotune.audio.muted = false;
                // Si ya cargó la playlist, arrancamos el track inicial
                if (Spotune.playlist.length > 0 && !Spotune.isPlaying) {
                    playTrack(); 
                }
            }

            // 2. FADE-OUT VISUAL
            accessScreen.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s';
            accessScreen.style.opacity = '0';
            accessScreen.style.visibility = 'hidden';

            // 3. LIMPIEZA DEL DOM
            setTimeout(() => {
                accessScreen.remove(); // Eliminamos del DOM para liberar memoria
            }, 800);
        });
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌊 1. GESTIÓN DE PORTADAS (ANTI-GLITCH)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.changeCover = function(newSrc, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    
    const bg1 = document.getElementById('bg-1');
    const bg2 = document.getElementById('bg-2');
    if (!bg1 || !bg2) return;

    const active = bg1.classList.contains('active') ? bg1 : bg2;
    const next = (active === bg1) ? bg2 : bg1;

    // Precarga para que no haya parpadeo blanco
    const img = new Image();
    img.src = newSrc;
    img.onload = () => {
        requestAnimationFrame(() => {
            next.style.backgroundImage = `url('${newSrc}')`;
            next.classList.add('active');
            active.classList.remove('active');
        });
    };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌌 2. CONTROL DEL REPRODUCTOR (JARVIS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.openSpotune = function(coverSrc, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    
    const hudCover = document.getElementById('hud-cover-img');
    // Solo asignar si coverSrc no es null/undefined
    if (hudCover && coverSrc) {
        hudCover.src = coverSrc;
    }

    requestAnimationFrame(() => {
        if (Jarvis.player) {
            Jarvis.player.style.display = 'block';
        }
        setTimeout(() => {
            if (Jarvis.card) {
                Jarvis.card.classList.add('player-active');
            }
        }, 10);
        const cd = document.querySelector('.cd-vinyl');
        if (cd) cd.classList.add('playing');
    });
};

window.closeSpotune = function(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }

    const cd = document.querySelector('.cd-vinyl');

    requestAnimationFrame(() => {
        // 1. Quitamos la clase para que el CSS desvanezca el player y restaure el menú
        if (Jarvis.card) {
            Jarvis.card.classList.remove('player-active');
        }
        
        if (cd) cd.classList.remove('playing');

        // 2. Apagamos el display solo después de que termine la transición de CSS (0.4s)
        setTimeout(() => {
            if (Jarvis.player && !Jarvis.card.classList.contains('player-active')) {
                Jarvis.player.style.display = 'none';
            }
        }, 400);
    });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⏳ 3. CONTADOR REGRESIVO ROBUSTO + FIRMA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function updateTimer() {
    if (!Jarvis.timer) return;

    const now = Date.now();
    let diff = Jarvis.targetDate - now;

    // Si ya pasó la fecha objetivo
    if (diff < 0) {
        Jarvis.timer.textContent = "¡FELIZ CUMPLEAÑOS!";

        // Activar animación de la firma
        const signature = document.querySelector('.model-signature');
        if (signature) signature.classList.add('birthday');

        // Reiniciar automáticamente al siguiente año
        const target = new Date(Jarvis.targetDate);
        target.setFullYear(target.getFullYear() + 1);
        Jarvis.targetDate = target.getTime();

        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const timeStr = `${d}d ${h}h ${m}m ${s}s`;
    Jarvis.timer.textContent = timeStr;
}

// Ejecutar cada segundo
setInterval(updateTimer, 1000);

// Chequeo automático de fecha (para la firma)
function checkBirthday() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // Enero = 0, Febrero = 1

    const signature = document.querySelector('.model-signature');
    if (!signature) return;

    if (day === 7 && month === 1) { // 7 de febrero
        signature.classList.add('birthday');
    } else {
        signature.classList.remove('birthday');
    }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', checkBirthday);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎵 MOTOR SPOTUNE: LÓGICA FUNCIONAL
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Spotune = {
    audio: new Audio(),
    playlist: [],
    currentIndex: 0,
    isPlaying: false
};

let trackHistory = [];
let repeatMode = "none";
let isShuffling = false;

Spotune.audio.loop = false;
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-shuffle').classList.remove("active");
    document.querySelector('.btn-repeat').classList.remove("active-one");
});

// 1. CARGA DE DATOS Y ASIGNACIÓN INMEDIATA
async function loadPlaylist() {
    try {
        const res = await fetch('https://radio-tekileros.vercel.app/Spotifly.json');
        const data = await res.json();
        Spotune.playlist = data.spotifly;

        const coverImg = document.getElementById('hud-cover-img');
        const firstTrack = Spotune.playlist[0];

        if (firstTrack) {
            Spotune.currentIndex = 0;
            Spotune.audio.src = firstTrack.enlace;

            document.getElementById('hud-title').textContent = firstTrack.nombre.toUpperCase();
            document.getElementById('hud-artist').textContent = firstTrack.artista.toUpperCase();
            coverImg.src = firstTrack.caratula || "https://santi-graphics.vercel.app/assets/img/CD.png";
        } else {
            coverImg.src = "https://santi-graphics.vercel.app/assets/img/CD.png";
        }

        renderPlaylist();

    } catch (e) {
        document.getElementById('hud-cover-img').src = "https://santi-graphics.vercel.app/assets/img/CD.png";
    }
}

// 2. ACTUALIZADOR HUD
function loadTrack(index, autoPlay) {
    if (!Spotune.playlist[index]) return;
    Spotune.currentIndex = index;
    const t = Spotune.playlist[index];

    document.getElementById('hud-title').textContent = t.nombre.toUpperCase();
    document.getElementById('hud-artist').textContent = t.artista.toUpperCase();
    document.getElementById('hud-cover-img').src = t.caratula || "https://santi-graphics.vercel.app/assets/img/CD.png";
    Spotune.audio.src = t.enlace;

    const list = document.getElementById('playlist-data');
    const items = list.querySelectorAll('li');

    items.forEach((li, i) => {
        li.classList.toggle('active-track', i === index);
    });

    // 🔧 Mover el track activo al inicio de la lista
    const activeItem = items[index];
    if (activeItem) {
        list.insertBefore(activeItem, list.firstChild);
        // 🔧 Scroll automático para mantenerlo visible
        activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (autoPlay) playTrack();
}

// 3. MOTOR AUDIO
function playTrack() {
    Spotune.audio.play().then(() => {
        Spotune.isPlaying = true;
        document.querySelector('.btn-play i').className = 'fa-solid fa-pause';
        document.querySelector('.cd-vinyl').classList.add('playing');
    }).catch(() => {});
}

function pauseTrack() {
    Spotune.audio.pause();
    Spotune.isPlaying = false;
    document.querySelector('.btn-play i').className = 'fa-solid fa-play';
    document.querySelector('.cd-vinyl').classList.remove('playing');
}

// ➡️ FUNCIÓN AVANZAR (NEXT)
function nextTrack() {
    if (Spotune.playlist.length === 0) return;
    if (Spotune.currentIndex === null) Spotune.currentIndex = 0;

    if (isShuffling) {
        let newIndex;
        if (Spotune.playlist.length > 1) trackHistory.push(Spotune.currentIndex);

        do {
            newIndex = Math.floor(Math.random() * Spotune.playlist.length);
        } while (newIndex === Spotune.currentIndex && Spotune.playlist.length > 1);

        loadTrack(newIndex, true);

    } else {
        let nextIndex = (Spotune.currentIndex + 1) % Spotune.playlist.length;
        loadTrack(nextIndex, true);
    }
}

// ⬅️ FUNCIÓN RETROCEDER (PREVIOUS)
function prevTrack() {
    if (Spotune.playlist.length === 0) return;

    let prevIndex;

    if (isShuffling && trackHistory.length > 0) {
        if (trackHistory[trackHistory.length - 1] === Spotune.currentIndex) {
            trackHistory.pop();
        }
        prevIndex = trackHistory.pop();
    } else {
        prevIndex = (Spotune.currentIndex - 1 + Spotune.playlist.length) % Spotune.playlist.length;
    }

    if (prevIndex !== undefined) {
        loadTrack(prevIndex, true);
    }
}

// 🔁 FUNCIÓN REPETIR (REPEAT)
function toggleRepeat() {
    if (repeatMode !== "one") {
        repeatMode = "one";
        document.querySelector('.btn-repeat').classList.add("active-one");
        Spotune.audio.loop = true;
    } else {
        repeatMode = "none";
        document.querySelector('.btn-repeat').classList.remove("active-one");
        Spotune.audio.loop = false;
    }
}

// 🔀 FUNCIÓN ALEATORIO (SHUFFLE)
function toggleShuffle() {
    isShuffling = !isShuffling;

    if (isShuffling) {
        document.querySelector('.btn-shuffle').classList.add("active");
        trackHistory = [Spotune.currentIndex];
        if (Spotune.playlist.length > 1) nextTrack();
    } else {
        document.querySelector('.btn-shuffle').classList.remove("active");
        trackHistory = [];
    }
}

// 🎛️ EVENTOS BOTONES
document.querySelector('.btn-play').onclick = (e) => { e.stopPropagation(); Spotune.isPlaying ? pauseTrack() : playTrack(); };
document.querySelector('.btn-fwd').onclick = (e) => { e.stopPropagation(); nextTrack(); };
document.querySelector('.btn-rwd').onclick = (e) => { e.stopPropagation(); prevTrack(); };
document.querySelector('.btn-repeat').onclick = (e) => { e.stopPropagation(); toggleRepeat(); };
document.querySelector('.btn-shuffle').onclick = (e) => { e.stopPropagation(); toggleShuffle(); };

// RENDER PLAYLIST
function renderPlaylist() {
    const list = document.getElementById('playlist-data');
    if (!list) return;
    list.innerHTML = '';
    Spotune.playlist.forEach((t, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${(i + 1).toString().padStart(2, '0')}</span> ${t.nombre.toUpperCase()} - ${t.artista.toUpperCase()}`;
        li.onclick = (e) => { e.stopPropagation(); loadTrack(i, true); };
        list.appendChild(li);
    });
}

// AUTO-NEXT
Spotune.audio.onended = () => {
    if (repeatMode === "none") nextTrack();
};

// INICIO
loadPlaylist();
document.body.addEventListener('click', () => {
    if (!Spotune.isPlaying) playTrack();
}, { once: true });
