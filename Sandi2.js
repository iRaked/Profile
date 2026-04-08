$(document).ready(function() {
    // --- 1. VARIABLES GLOBALES ---
    const $centerPanel = $('.content-center');
    const $avatarContainer = $('.profile-avatar-container');
    const avatares = [
        "https://i.ibb.co/Hf40JxkD/Sandi.png", 
        "https://i.ibb.co/W4jFHyKd/Sandi-Flash-GFX.gif",          
        "https://i.postimg.cc/9FW4dSrR/247.gif"          
    ];

    // --- 2. PRE-CARGA ULTRA-RÁPIDA (FIX DE LATENCIA) ---
    const flagCounterURL = "https://s01.flagcounter.com/count2/IHkg/bg_010101/txt_8800FF/border_8800FF/columns_2/maxflags_12/viewers_0/labels_0/pageviews_1/flags_0/percent_0/";
    const ghostImage = new Image();
    ghostImage.src = flagCounterURL;

    // Fix para reintentar si el servidor de Flags parpadea
    $(document).on('error', '.counter-img', function() {
        const $img = $(this);
        if (!$img.data('retried')) {
            $img.data('retried', true);
            setTimeout(() => { $img.attr('src', flagCounterURL + '?retry=' + Date.now()); }, 1000);
        }
    });

    let inputPin = "";
    const correctPin = "0000"; // PIN FINAL 2109

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- 3. FUNCIONES DE APOYO ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    function actualizarOnda() {
        const $btnActivo = $('.nav-btn.active');
        if ($btnActivo.length === 0) return;
        
        let $onda = $('.nav-wave');
        if ($onda.length === 0) {
            $('.footer-nav').append('<div class="nav-wave"></div>');
            $onda = $('.nav-wave');
        }

        const btnWidth = $btnActivo.outerWidth();
        const btnPos = $btnActivo.position().left;
        $onda.css('left', btnPos + (btnWidth / 2) - ($onda.width() / 2));
    }

    function updateDots() {
        $(".pin-dot").removeClass("filled");
        for (let i = 0; i < inputPin.length; i++) { $(".pin-dot").eq(i).addClass("filled"); }
    }

    function validatePin() {
        if (inputPin === correctPin) {
            $("#lock-screen").fadeOut(600, function() {
                $(this).css({"visibility": "hidden"});
                $('.nav-btn').removeClass('active').first().addClass('active');
                actualizarOnda();
                $avatarContainer.fadeIn(400).addClass('show-avatar');
                $('.widget').removeClass('active');
                $('#widget-user').addClass('active'); 
                $centerPanel.css('--scan-pos', '100%');
                setTimeout(() => $centerPanel.css('--scan-pos', '40%'), 800);
                $(".doll-img").addClass("animating");
            });
        } else {
            $(".lock-card").addClass("error-shake");
            setTimeout(() => { $(".lock-card").removeClass("error-shake"); inputPin = ""; updateDots(); }, 500);
        }
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- 4. EVENTOS DE NAVEGACIÓN (UNIFICADO Y FIXEADO) ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    $('.nav-btn').off('click').on('click', function() {
        const $this = $(this);
        const target = $this.data('target');

        if ($this.hasClass('active')) return;

        $('.nav-btn').removeClass('active');
        $this.addClass('active');
        actualizarOnda();

        // Efecto Escaneo
        $centerPanel.css('--scan-pos', '100%');
        setTimeout(() => $centerPanel.css('--scan-pos', '40%'), 800);

        // INTERCAMBIO DE WIDGETS
        // Importante: No usamos .hide() para que el navegador no mate la precarga
        $('.widget').removeClass('active'); 
        $(`#${target}`).addClass('active');

        // Lógica de Avatar
        if (target === 'widget-user') {
            $avatarContainer.stop(true, true).fadeIn(300).addClass('show-avatar');
        } else {
            $avatarContainer.stop(true, true).fadeOut(200).removeClass('show-avatar');
        }
    });

    // --- 5. EVENTOS DE SEGURIDAD ---
    $(".num-btn[data-val]").on("click", function() {
        if (inputPin.length < 4) {
            inputPin += $(this).data("val");
            updateDots();
            if (inputPin.length === 4) validatePin();
        }
    });

    $(".btn-clear").click(() => { inputPin = ""; updateDots(); });

    $(document).on("keydown", function(e) {
        if ($("#lock-screen").is(":visible")) {
            if (e.key >= 0 && e.key <= 9 && inputPin.length < 4) {
                inputPin += e.key;
                updateDots();
                if (inputPin.length === 4) validatePin();
            }
            if (e.key === "Backspace") { inputPin = inputPin.slice(0, -1); updateDots(); }
        }
    });

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- 6. CICLO DE AVATARES Y GALERÍA ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    // Lógica de Avatares (Widget User)
    $('.cycle-btn').on('click', function() {
        const newIndex = $(this).data('index');
        const $dots = $('.cycle-dot');
        if ($dots.eq(newIndex).hasClass('active')) return;

        $dots.removeClass('active');
        $dots.eq(newIndex).addClass('active');

        $('.cycle-img').stop(true, true).fadeOut(200, function() {
            $(this).attr('src', avatares[newIndex]).fadeIn(300);
        });
    });

    // ======================================
    // --- LÓGICA DE GALERÍA (90/10) - FIX ARRASTRE MOUSE/PAD ---
    // ======================================
    let images = ["https://i.ibb.co/PZSndXMH/S1.png",
                  "https://i.ibb.co/MDZ8rWnV/S2.png"
                  
                 ];
    let currentIdx = 0;
    let startX = 0;
    let isDragging = false;
    let hasMoved = false; // Nueva bandera para diferenciar clic de arrastre real
    let isScrolling = false; 
    const $touchZone = $('#gallery-touch-zone');

    function cambiarImagen(direccion) {
    currentIdx = (currentIdx + direccion + images.length) % images.length;
    const $item = $('.carousel-item');
    
    $item.stop(true, true).fadeOut(250, function() {
        $(this).removeClass('revealed'); 
        // Ahora usamos directamente el enlace completo
        $(this).find('.gallery-img').attr('src', images[currentIdx]);
        $(this).fadeIn(300);
    });
}

    // 1. Click para revelar (Solo si NO hubo arrastre)
    $touchZone.on('click', '.carousel-item', function(e) {
        if (!hasMoved) {
            $(this).toggleClass('revealed');
        }
    });

    // 2. Desplazamiento Touch & Mouse Drag (Swipe)
    $touchZone.on('mousedown touchstart', function(e) {
        // Prevenir que el navegador intente "arrastrar" la imagen como objeto
        if (e.type === 'mousedown') e.preventDefault(); 
        
        startX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
        isDragging = true;
        hasMoved = false; 
    });

    $(document).on('mousemove touchmove', function(e) {
        if (!isDragging) return;
        
        let currentX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
        if (Math.abs(startX - currentX) > 10) {
            hasMoved = true; // Confirmamos que el usuario está moviendo, no solo clickeando
        }
    });

    $(document).on('mouseup touchend', function(e) {
        if (!isDragging) return;
        
        let endX = e.pageX || (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : 0);
        let diff = startX - endX;

        // Umbral de 50px para disparar el cambio
        if (Math.abs(diff) > 50 && hasMoved) { 
            cambiarImagen(diff > 0 ? 1 : -1);
        }

        isDragging = false;
        startX = 0;
    });

    // 3. Desplazamiento con Rueda (Wheel) - Ya funcional
    $touchZone.on('wheel', function(e) {
        e.preventDefault();
        if (isScrolling) return;
        isScrolling = true;
        cambiarImagen(e.originalEvent.deltaY > 0 ? 1 : -1);
        setTimeout(() => { isScrolling = false; }, 600);
    });
    
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- LÓGICA DE FRIENDS (Dog Tags) ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    const friendsData = [
    { nick: "Lov3", img: "https://i.postimg.cc/15J8JHqW/246.gif", url: "https://xat.me/Lov3", status: "online", id: "20202", video: "https://www.youtube.com/embed/zZ5mYp7mt9k" },

    { nick: "Rick", img: "https://i.postimg.cc/tTW1kG3P/243.gif", url: "https://xat.me/LuzDeErendil", status: "offline", id: "1548724149", video: "https://www.youtube.com/embed/A_lyYf9Pbr0" },

    { nick: "Eliza", img: "https://i.ibb.co/Xqsk6kS/Eliza.webp", url: "https://xat.me/qu3n", status: "online", id: "133331", video: "https://www.youtube.com/embed/2wLgW3ERUfM" },

    { nick: "Dragon", img: "https://i.ibb.co/mCrPYzkq/Picture.png", url: "https://xat.me/dragoon", status: "online", id: "738987602", video: "https://www.youtube.com/embed/DDCnpC46eBQ" }
    ];

    let friendIdx = 0;
    let friendStartX = 0;

    function updateFriendCard(dir) {
    if ($('.card').is(':animated')) return;
    friendIdx = (friendIdx + dir + friendsData.length) % friendsData.length;
    const friend = friendsData[friendIdx];

    $('.card').fadeOut(250, function() {
        $('#friend-nick').text(friend.nick);
        $('#friend-img').attr('src', friend.img);
        $('#friend-url').attr('href', friend.url);
        $('#friend-id').text(`(${friend.id})`);
        const statusHTML = `<span class="status-dot ${friend.status}"></span> ${friend.status.toUpperCase()}`;
        $('#friend-status').html(statusHTML);

        // Aquí actualizamos el video
        $('.card-video iframe').attr('src', friend.video);

        $(this).fadeIn(300);
    });
}

    // --- NAVEGACIÓN (FIX DEFINITIVO) ---
    $('.nav-btn').off('click').on('click', function() {
        const $this = $(this);
        const target = $this.data('target');

        if ($this.hasClass('active')) return;

        $('.nav-btn').removeClass('active');
        $this.addClass('active');
        actualizarOnda();

        // Escaneo
        $centerPanel.css('--scan-pos', '100%');
        setTimeout(() => $centerPanel.css('--scan-pos', '40%'), 800);

        // Cambiamos visibilidad mediante la clase 'active' únicamente
        $('.widget').removeClass('active'); 
        $(`#${target}`).addClass('active');

        if (target === 'widget-user') {
            $avatarContainer.fadeIn(300).addClass('show-avatar');
        } else {
            $avatarContainer.fadeOut(200).removeClass('show-avatar');
        }
    });

    // Eventos de Touch/Mouse
    $('#friends-touch-zone').on('mousedown touchstart', function(e) {
        friendStartX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
    });

    $(document).on('mouseup touchend', function(e) {
        if (friendStartX === 0 || !$('#widget-friends').hasClass('active')) return;
        let endX = e.pageX || (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : 0);
        let diff = friendStartX - endX;
        if (Math.abs(diff) > 60) updateFriendCard(diff > 0 ? 1 : -1);
        friendStartX = 0;
    });

    $('#friends-touch-zone').on('wheel', function(e) {
        if (isScrolling || !$('#widget-friends').hasClass('active')) return;
        isScrolling = true;
        updateFriendCard(e.originalEvent.deltaY > 0 ? 1 : -1);
        setTimeout(() => isScrolling = false, 600);
    });
    
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- BLOQUE PLAYER RECARGADO (CON SWITCH DE PLAYLIST) ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    const audio = document.getElementById('audio'); 
    let hits = []; 
    let currentIndex = 0;

    // Configuración de Playlists
    const URL_MAIN = "https://radio-tekileros.vercel.app/Repro7.json";
    const URL_RAZTECA = "https://radio-tekileros.vercel.app/Razteca.json";
    let currentSource = URL_MAIN;

    // 1. CARGA DE DATOS (Normalizada para ambos JSON)
    function loadPlaylist(url, autoPlayAfter = false) {
        $.getJSON(url, function(data) {
            // Normalizamos: Razteca usa .razteca, Repro7 usa .hits
            hits = data.hits || data.razteca; 

            if (hits && hits.length > 0) {
                currentIndex = 0; // Reiniciamos al primer track de la nueva lista
                updateUI(currentIndex);

                if (autoPlayAfter) {
                    playTrack();
                }

                // Si el modal está abierto, lo refrescamos
                if ($('#modal-playlist').is(':visible')) {
                    fillPlaylist();
                }
            }
        }).fail(function() { console.error("Error al switchear playlist"); });
    }

    // 2. ACTUALIZAR INTERFAZ Y SOURCE
    function updateUI(index) {
        if (!hits[index]) return;
        const track = hits[index];

        // Aplicamos PascalCase (como corregiste antes) para evitar inconsistencias
        $('#player-artist').text(track.artista);
        $('#player-title').text(track.nombre);
        $('#player-cover').attr('src', track.caratula);

        audio.src = track.enlace;
        audio.load();

        updateModalSelection(index);
    }

    function updateModalSelection(index) {
        $('.track-item').removeClass('active');
        $(`.track-item[data-index="${index}"]`).addClass('active');
    }

    // 3. FUNCIÓN DE REPRODUCCIÓN
    function playTrack() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                $('#btn-play-pause').find('i').removeClass('fa-play').addClass('fa-pause');
            }).catch(e => console.log("Gesto requerido"));
        }
    }
    
    // --- MOTOR DEL TIEMPO (EL QUE FALTABA) ---
    audio.ontimeupdate = function() {
        if (!isNaN(audio.duration)) {
            const min = Math.floor(audio.currentTime / 60);
            const sec = Math.floor(audio.currentTime % 60);
            // Inyectamos el tiempo formateado en tu ID: player-time
            $('#player-time').text(`${min}:${sec < 10 ? '0' + sec : sec}`);
        }
    };

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // --- EL EASTER EGG: SWITCH DE PLAYLIST (CÍRCULO CENTRAL) ---
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    $('.wheel-center-dot').on('click', function(e) {
        e.stopPropagation();

        // Alternamos la URL
        currentSource = (currentSource === URL_MAIN) ? URL_RAZTECA : URL_MAIN;

        // Efecto visual rápido de parpadeo en el core para avisar el cambio
        $(this).css('box-shadow', '0 0 30px var(--neon-aqua)');
        setTimeout(() => {
            $(this).css('box-shadow', '0 0 15px rgba(188, 19, 254, 0.3)');
        }, 300);

        // Cargamos la nueva lista y disparamos el play
        loadPlaylist(currentSource, true);

        console.log("Cambiando a: " + (currentSource === URL_RAZTECA ? "Razteca" : "Principal"));
    });

    // --- CONTROLES DE LA RUEDA ---

    $('#btn-next').on('click', function(e) {
        e.stopPropagation();
        if (hits.length === 0) return;
        currentIndex = (currentIndex + 1) % hits.length;
        updateUI(currentIndex);
        playTrack();
    });

    $('#btn-prev').on('click', function(e) {
        e.stopPropagation();
        if (hits.length === 0) return;
        currentIndex = (currentIndex - 1 + hits.length) % hits.length;
        updateUI(currentIndex);
        playTrack();
    });

    $('#btn-play-pause').on('click', function(e) {
        e.stopPropagation();
        if (audio.paused) { playTrack(); } 
        else { audio.pause(); $(this).find('i').removeClass('fa-pause').addClass('fa-play'); }
    });

    // --- MODAL Y EVENTOS ---

    function fillPlaylist() {
        const list = $('#track-list');
        list.empty();
        hits.forEach((track, index) => {
            const isActive = index === currentIndex ? 'active' : '';
            list.append(`<li class="track-item ${isActive}" data-index="${index}">
                <span class="t-name">${track.nombre}</span>
                <span class="t-artist">${track.artista}</span>
            </li>`);
        });
    }

    $('#btn-menu').on('click', function(e) {
        e.stopPropagation();
        fillPlaylist();
        $('#modal-playlist').css('display', 'flex').hide().fadeIn(300);
    });

    $('#close-menu').on('click', function() { $('#modal-playlist').fadeOut(300); });

    $(document).on('click', '.track-item', function() {
        currentIndex = $(this).data('index');
        updateUI(currentIndex);
        playTrack();
        $('#modal-playlist').fadeOut(300);
    });

    // CONTINUIDAD
    audio.onended = function() {
        currentIndex = (currentIndex + 1) % hits.length;
        updateUI(currentIndex);
        playTrack();
    };

    // DESBLOQUEO GLOBAL
    $(document).one('click touchstart', function() {
        if (audio.paused && hits.length > 0) playTrack();
    });

    $(document).ready(function() {
        loadPlaylist(URL_MAIN); // Arranca con la principal
    });
    
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    // CURSOR PERSONALIZADO ESTILO MARIPOSA (VERSIÓN LIMPIA)
    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
    document.addEventListener("mousemove", (e) => {
        const butterfly = document.getElementById("butterfly-cursor");
        const wrapper = document.getElementById("cursor-wrapper");
        if (!butterfly || !wrapper) return;

        // 1. Posición de la Mariposa Principal
        butterfly.style.left = e.clientX + "px";
        butterfly.style.top = e.clientY + "px";

        // 2. Lógica de Estela (Solo Sparkles y Mini-Mariposas)
        if (Math.random() > 0.4) { 
            const particle = document.createElement("div");

            // Decidimos si es sparkle circular o mini mariposa
            if (Math.random() > 0.8) {
                particle.innerHTML = "ƸӜƷ";
                particle.style.fontSize = "10px";
                particle.style.color = "#f87070";
                particle.style.position = "fixed";
            } else {
                particle.className = "heart-sparkle"; 
                // Nota: Aunque la clase se llame "heart-sparkle", 
                // según tu CSS es un círculo rojo brillante, no un corazón "❤"
            }

            particle.style.position = "fixed"; 
            particle.style.left = e.clientX + "px";
            particle.style.top = e.clientY + "px";
            particle.style.pointerEvents = "none";

            // Inyectamos en el wrapper para NO empujar los paneles
            wrapper.appendChild(particle);

            // Limpieza rápida para no saturar la memoria
            setTimeout(() => particle.remove(), 600);
        }

        // SECCIÓN 3 ELIMINADA: Ya no hay "corazon-xat" (❤) en el cursor.
    });

    // Inicializar posición de onda al cargar
    actualizarOnda();
}); // CIERRE FINAL DE DOCUMENT READY