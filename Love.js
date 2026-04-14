/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
// --- VARIABLES GLOBALES ---
/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
let inputPin = "";
const correctPin = "0000"; 

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
// --- FUNCIONES DE APOYO ---
/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function updateDots() {
    $(".pin-dot").removeClass("filled");
    for (let i = 0; i < inputPin.length; i++) { 
        $(".pin-dot").eq(i).addClass("filled"); 
    }
}

function validatePin() {
    if (inputPin === correctPin) {
        $("#lock-screen").fadeOut(800, function() {
            $(this).css({"visibility": "hidden"});
            console.log("Acceso concedido a Love 2026");
        });
    } else {
        $(".lock-card").addClass("error-shake");
        setTimeout(() => { 
            $(".lock-card").removeClass("error-shake"); 
            inputPin = ""; 
            updateDots(); 
        }, 500);
    }
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
// --- INICIO DEL DOCUMENTO ---
/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
$(document).ready(function() {

    // 1. EVENTO ÚNICO PARA BOTONES (Numpad)
    $(".num-btn").on("click", function() {
        const val = $(this).attr("data-val");
        const isClear = $(this).hasClass("btn-clear");

        // Animación de pulsación
        $(this).css("transform", "scale(0.85)");
        setTimeout(() => $(this).css("transform", "scale(1)"), 100);

        // Lógica para el botón CLEAR (Borrar último o todo)
        if (isClear) {
            inputPin = inputPin.slice(0, -1); // Borra de uno en uno
            updateDots();
            return;
        }

        // Lógica para números
        if (val !== undefined && val !== "*" && inputPin.length < 4) {
            inputPin += val;
            updateDots();

            if (inputPin.length === 4) {
                setTimeout(validatePin, 300);
            }
        }
    });
    
    // 2. SOPORTE TECLADO FÍSICO
    $(document).on("keydown", function(e) {
        if ($("#lock-screen").is(":visible")) {
            // Números del 0 al 9
            if (e.key >= 0 && e.key <= 9 && inputPin.length < 4) {
                inputPin += e.key;
                updateDots();
                if (inputPin.length === 4) setTimeout(validatePin, 300);
            }
            // Borrar con Backspace
            if (e.key === "Backspace") {
                inputPin = inputPin.slice(0, -1);
                updateDots();
            }
        }
    });

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- 3. LÓGICA DEL MENU (SWITCH SECCIONES) ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    $('.switch-btn').on('click', function() {
        // 1. Obtener datos del botón clickeado
        const target = $(this).data('section'); // "home", "gallery", "profile", etc.
        const index = $(this).index('.switch-btn'); // Posición para el slider

        // 2. Mover el slider (80px es el ancho de tu botón + gap)
        // Ajustamos a 80px * index + el offset inicial de 5px
        $('.switch-slider').css({
            'left': (index * 80) + 5 + 'px',
            'width': $(this).outerWidth() - 10 // Se ajusta al ancho real del botón
        });

        // 3. Actualizar estado visual de los botones
        $('.switch-btn').removeClass('active');
        $(this).addClass('active');

        // 4. Cruce de contenidos (SPA)
        // Ocultamos la sección actual y mostramos la nueva con un fade suave
        $('.spa-section').stop(true, true).fadeOut(300, function() {
            $(`#sec-${target}`).fadeIn(400);
        });

        console.log("Navegando a: " + target);
    });

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // 4. EFECTO PARALLAX 3D
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    $(document).on('mousemove', '.magazine-body', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    this.style.setProperty('--mouse-x-offset', `${x}px`);
});

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // 5. MOVIMIENTO DEL CRISTAL ESMERILADO
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    const magBody = document.querySelector('.magazine-body');
    if(magBody) {
        magBody.addEventListener('mousemove', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const width = rect.width;
            const moveX = Math.max(0, x - (width / 2)); 
            e.currentTarget.style.setProperty('--mouse-x-offset', `${moveX}px`);
        });
    }
});

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- LÓGICA PARALLAX MANUAL GALERÍA ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // Usamos delegación de eventos para que funcione al cambiar de sección
    $(document).on('mousemove', '.p-gallery-container', function(e) {
        const rect = this.getBoundingClientRect();

        // 1. Calculamos la posición del mouse de 0 a 1 (normalizada)
        const mouseX = (e.clientX - rect.left) / rect.width;
        const mouseY = (e.clientY - rect.top) / rect.height;

        // 2. Mapeo de Parallax Inverso (Técnica de Palanca)
        // Cuando el mouse está en el centro (0.5), el valor es 50%.
        // Rango de movimiento de 35% a 65%.
        const paraX = 35 + (mouseX * 30); 
        const paraY = 35 + (mouseY * 30);

        // 3. Aplicamos las variables CSS solo a las columnas de este contenedor
        // $(this) se refiere a .p-gallery-container clickeado
        $(this).find('.p-slide-column').css({
            '--para-x': paraX + '%',
            '--para-y': paraY + '%'
        });
    });

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- MOTOR DE PARTÍCULAS GLOBAL (FONDO DINÁMICO) --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    let w, h;
    let particles = [];
    const depth = 1000;
    const friction = 0.85; // Un poco más fluido para el body
    let mouse = { x: 0, y: 0 };
    let mouseDelta = { x: 0, y: 0 };

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    // Reutilizamos tu lógica de Point3D y Particle
    function Point3D(x, y, z) {
        this.x = x || 0; this.y = y || 0; this.z = z || 0;
    }
    Point3D.prototype.rotX = function(ang) {
        let y = this.y, z = this.z;
        this.y = y * Math.cos(ang) - z * Math.sin(ang);
        this.z = z * Math.cos(ang) + y * Math.sin(ang);
    };
    Point3D.prototype.rotY = function(ang) {
        let x = this.x, z = this.z;
        this.x = x * Math.cos(ang) - z * Math.sin(ang);
        this.z = z * Math.cos(ang) + x * Math.sin(ang);
    };

    function Particle(x, y, z) {
        this.pos = new Point3D(x, y, z);
        this.renderPos = new Point3D(x, y, z);
        this.rotation = new Point3D();
        this.velocity = new Point3D();
        this.color = `hsla(260, 100%, 75%, ${Math.random() * 0.4 + 0.2})`;
    }

    function init() {
        resize();
        particles = [];
        // 5,000 partículas para llenar bien el viewport global
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

        // Dibujamos el LOVE fantasma en el centro del viewport
        const loveText = "L O V E".split(" ").join(String.fromCharCode(0x2004));
        ctx.font = "bold 15vw 'Poiret One'";
        ctx.fillStyle = "rgba(160, 121, 255, 0.03)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(loveText, w / 2, h / 2);

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

        mouseDelta.x = 0.0003; // Rotación constante mínima
        mouseDelta.y = 0.0003;
        requestAnimationFrame(run);
    }

    window.addEventListener("mousemove", (e) => {
        mouseDelta.x = (e.clientY - mouse.y) / w;
        mouseDelta.y = (e.clientX - mouse.x) / h;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("resize", resize);

    init();
    run();

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- SWITCH MODO ROSADO --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    document.addEventListener("DOMContentLoaded", () => {
    const paletteSwitch = document.getElementById("revista-switch-palette");
    const body = document.body;

    // 1. Verificar si ya existe una preferencia guardada
    if (localStorage.getItem("theme-palette") === "pink") {
        body.classList.add("palette-pink");
    }

    // 2. Evento de Click
    paletteSwitch.addEventListener("click", () => {
        // Alternar la clase en el body
        body.classList.toggle("palette-pink");

        // 3. Guardar la elección
        if (body.classList.contains("palette-pink")) {
            localStorage.setItem("theme-palette", "pink");
            console.log("Paleta: Love Pink Activa");
        } else {
            localStorage.setItem("theme-palette", "lila");
            console.log("Paleta: Nocturnal Lila Activa");
        }

        // Opcional: Feedback visual o sonido
        playSwitchSound(); // Si tienes una función de audio
    });
});

function playSwitchSound() {
    // Aquí podrías disparar un pequeño clic de audio para darle peso a la acción
}

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- MOTOR DE AUDIO: DESBLOQUEO UNIVERSAL & GESTIÓN DE JSON --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const audio = document.getElementById('main-audio');
    const playBtn = document.querySelector('.btn-play-hub');
    const vinyl = document.querySelector('.vinyl-mega-img');
    let musicData = [];
    let isSystemStarted = false;
    let currentIndex = 0;
    let isRepeat = false;
    let isShuffle = false;

    // 1. FUNCIÓN DE ACTUALIZACIÓN DE INTERFAZ
    function updateUI(track) {
        if (!track) return;
        document.querySelector('.meta-thumb-lg').src = track.caratula;
        document.querySelector('.artist-txt').innerText = track.artista;
        document.querySelector('.title-txt').innerText = track.nombre;
        document.querySelector('.bar-anchor-txt').innerText = track.duracion;
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // 2. FUNCIÓN MAESTRA DE INICIO (Cualquier parte de la pantalla)
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    async function startAudioSystem() {
        if (isSystemStarted) return;

        try {
            // Fetch del JSON
            const response = await fetch('https://radio-tekileros.vercel.app/LaRevancha.json');
            const data = await response.json();
            musicData = data["la revancha"];

            if (musicData.length > 0) {
                const firstTrack = musicData[0];
                audio.src = firstTrack.enlace;

                // Intentar reproducción inmediata tras el gesto
                await audio.play();

                // Si tiene éxito, actualizamos todo
                isSystemStarted = true;
                updateUI(firstTrack);

                // Ajustar iconos y animaciones
                playBtn.querySelector('i').className = 'fa-solid fa-pause';
                if (vinyl) vinyl.classList.add('spinning');

                console.log("Sistema desbloqueado: Reproduciendo " + firstTrack.nombre);

                // Limpiar listeners para no repetir la carga
                window.removeEventListener('click', startAudioSystem);
                window.removeEventListener('touchstart', startAudioSystem);
            }
        } catch (error) {
            console.error("Error al iniciar el sistema de audio:", error);
        }
    }

    // 3. LISTENERS GLOBALES PARA EL PRIMER GESTO
    window.addEventListener('click', startAudioSystem);
    window.addEventListener('touchstart', startAudioSystem);

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // BOTONERA
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // 4. LÓGICA DEL BOTÓN PLAY (Control posterior)
    playBtn.addEventListener('click', (e) => {
        // Importante: evitamos que el clic en el botón se propague al window 
        // mientras el sistema se está desbloqueando.
        e.stopPropagation();

        if (!isSystemStarted) {
            startAudioSystem();
            return;
        }

        if (audio.paused) {
            audio.play();
            playBtn.querySelector('i').className = 'fa-solid fa-pause';
            if (vinyl) vinyl.classList.add('spinning');
        } else {
            audio.pause();
            playBtn.querySelector('i').className = 'fa-solid fa-play';
            if (vinyl) vinyl.classList.remove('spinning');
        }
    });

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- REPRODUCTOR PRO: SISTEMA DE CONTROL UNIFICADO --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const PlayerControl = {
        // 1. ESTADOS
        currentIndex: 0,
        isRepeat: false,
        isShuffle: false,

        // 2. INICIALIZAR BOTONES
        init() {
            const btnRepeat  = document.querySelector('.fa-repeat').parentElement;
            const btnShuffle = document.querySelector('.fa-shuffle').parentElement;
            const btnPrev    = document.querySelector('.fa-backward-step').parentElement;
            const btnNext    = document.querySelector('.fa-forward-step').parentElement;

            // Limpiar y asignar eventos (onclick sobreescribe cualquier basura previa)
            btnRepeat.onclick = (e) => {
                e.stopPropagation();
                this.isRepeat = !this.isRepeat;
                audio.loop = this.isRepeat;
                btnRepeat.style.color = this.isRepeat ? 'var(--neon-lila)' : 'white';
                btnRepeat.style.filter = this.isRepeat ? 'drop-shadow(0 0 8px var(--neon-lila))' : 'none';
            };

            btnShuffle.onclick = (e) => {
                e.stopPropagation();
                this.isShuffle = !this.isShuffle;
                btnShuffle.style.color = this.isShuffle ? 'var(--neon-lila)' : 'white';
                btnShuffle.style.filter = this.isShuffle ? 'drop-shadow(0 0 8px var(--neon-lila))' : 'none';
                if (this.isShuffle) this.playRandom();
            };

            btnNext.onclick = (e) => {
                e.stopPropagation();
                this.isShuffle ? this.playRandom() : this.changeTrack(this.currentIndex + 1);
            };

            btnPrev.onclick = (e) => {
                e.stopPropagation();
                this.changeTrack(this.currentIndex - 1);
            };

            // El cerebro del fin de canción
            audio.onended = () => {
                if (this.isRepeat) {
                    audio.currentTime = 0;
                    audio.play();
                } else if (this.isShuffle) {
                    this.playRandom();
                } else {
                    this.changeTrack(this.currentIndex + 1);
                }
            };
        },

        // 3. LOGICA DE REPRODUCCIÓN
        changeTrack(index) {
            if (!musicData || musicData.length === 0) return;

            // Final de lista (Modo Lineal)
            if (index >= musicData.length) {
                this.stopPlayer();
                return;
            }

            // Loop RWD
            if (index < 0) index = musicData.length - 1;

            this.currentIndex = index;
            const track = musicData[this.currentIndex];

            audio.src = track.enlace;
            audio.load();
            updateUI(track);

            if (isSystemStarted) {
                audio.play().then(() => {
                    playBtn.querySelector('i').className = 'fa-solid fa-pause';
                    if (vinyl) vinyl.classList.add('spinning');
                }).catch(e => console.log("Gesto requerido"));
            }
        },

        playRandom() {
            let rand;
            do { rand = Math.floor(Math.random() * musicData.length); } 
            while (rand === this.currentIndex && musicData.length > 1);
            this.changeTrack(rand);
        },

        stopPlayer() {
            console.log("Playlist terminada.");
            audio.pause();
            audio.currentTime = 0;
            playBtn.querySelector('i').className = 'fa-solid fa-play';
            if (vinyl) vinyl.classList.remove('spinning');
        }
    };

    // Arrancar el controlador
    PlayerControl.init();

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- LÓGICA DE VOLUMEN (CONTROL Y FEEDBACK VISUAL) --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // Buscamos la barra lateral que NO sea la del tiempo (o la que decidas usar para vol)
    // Si solo tienes una, asegúrate de que la clase coincida
    const volContainer = document.querySelector('.side-bar-fixed.volume-bar') || document.querySelector('.side-bar-fixed:not(.time-bar)');
    const volFill = volContainer.querySelector('.bar-fill');
    const volIcon = volContainer.querySelector('.bar-anchor-icon');

    const updateVol = (e) => {
        const rect = volContainer.getBoundingClientRect();
        const totalHeight = rect.height;

        // Calculamos desde el fondo hacia arriba
        let pos = rect.bottom - e.clientY;
        let percentage = (pos / totalHeight) * 100;

        // Clamp entre 0 y 100
        percentage = Math.max(0, Math.min(100, percentage));

        // Aplicar al motor
        const finalVolume = percentage / 100;
        audio.volume = finalVolume;

        // Actualizar visual (CSS inline para el fill)
        volFill.style.height = `${percentage}%`;

        // Cambio de icono si existe
        if (volIcon) {
            if (finalVolume === 0) volIcon.className = 'fa-solid fa-volume-xmark bar-anchor-icon';
            else if (finalVolume < 0.5) volIcon.className = 'fa-solid fa-volume-low bar-anchor-icon';
            else volIcon.className = 'fa-solid fa-volume-high bar-anchor-icon';
        }
    };

    // Listeners para arrastre suave
    volContainer.onmousedown = (e) => {
        updateVol(e);
        const move = (ev) => updateVol(ev);
        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    };

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- LÓGICA DE BARRA DE TIEMPO (PROGRESS BAR) --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const timeBarFill = document.querySelector('.time-bar .bar-fill');
    const timeBarTxt  = document.querySelector('.time-bar .bar-anchor-txt');

    // 1. ACTUALIZACIÓN AUTOMÁTICA MIENTRAS REPRODUCE
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            // Cálculo de porcentaje
            const percentage = (audio.currentTime / audio.duration) * 100;

            // Actualizar el fill (sube de 0% a 100%)
            timeBarFill.style.height = `${percentage}%`;

            // Actualizar el texto del tiempo (Formato MM:SS)
            timeBarTxt.innerText = formatTime(audio.currentTime);
        }
    });

    // 2. LIMPIEZA AL CAMBIAR O TERMINAR TRACK
    // Esta función debe llamarse dentro de tu changeTrack() o al iniciar nuevo audio
    function resetProgressBar() {
        timeBarFill.style.height = '0%';
        timeBarTxt.innerText = '0:00';
    }

    // 3. FUNCIÓN AUXILIAR: FORMATEAR SEGUNDOS A MINUTOS
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    /* --- SCRUBBING (OPCIONAL): CLIC EN BARRA PARA ADELANTAR --- */
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const timeBarContainer = document.querySelector('.time-bar');

    timeBarContainer.onclick = (e) => {
        e.stopPropagation();
        const rect = timeBarContainer.getBoundingClientRect();
        const totalHeight = rect.height;

        // Calculamos posición desde el fondo (al igual que el volumen)
        let pos = rect.bottom - e.clientY;
        let percentage = pos / totalHeight;

        if (audio.duration) {
            audio.currentTime = audio.duration * percentage;
        }
    };