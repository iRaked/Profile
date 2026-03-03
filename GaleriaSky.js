$(document).ready(function() {
    // 1. VARIABLES GLOBALES Y ELEMENTOS
    const sideMenu = $('#sideMenu');
    const audio = new Audio("https://radio-tekileros.vercel.app/assets/audio/Ha-Ash-Melendi-Destino-o-casualidad.MP3");
    let audioUnlocked = false;
    let currentCardIndex = 0;
    let isTransitioning = false;

    // Configuración inicial audio
    audio.loop = false;
    audio.volume = 0.5;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* --- FUNCIONES MAESTRAS DE NAVEGACIÓN Y CIERRE --- */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    // El "Triple Cierre" Maestro
    window.closeAllModals = function() {
        $('.modal-overlay').fadeOut(300, function() {
            $(this).css('display', 'none');
            isTransitioning = false;
        });
        $('body').removeClass('overflow-hidden').css('overflow', 'auto');
        // También cerramos el menú lateral por si acaso
        sideMenu.addClass('-translate-x-full');
    };

    window.openHome = function() {
        closeAllModals();
        setTimeout(() => {
            $('#profile-modal').css('display', 'flex').hide().fadeIn(350);
            $('body').css('overflow', 'hidden');
        }, 100);
    };

    window.openFriends = function() {
        closeAllModals();
        setTimeout(() => {
            $('#friends-modal').css('display', 'flex').hide().fadeIn(350);
            $('body').css('overflow', 'hidden');
        }, 100);
    };

    window.openMusic = function() {
        closeAllModals();
        setTimeout(() => {
            $('#music-modal').css('display', 'flex').hide().fadeIn(350);
            $('body').css('overflow', 'hidden');
        }, 100);
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* --- LÓGICA DEL MENÚ LATERAL --- */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    $('#open-menu').click(function() {
        sideMenu.removeClass('-translate-x-full');
    });

    $('#close-menu').click(function() {
        sideMenu.addClass('-translate-x-full');
    });

    // Cierre del menú al hacer clic fuera
    $(document).mouseup(function(e) {
        if (!sideMenu.is(e.target) && sideMenu.has(e.target).length === 0) {
            sideMenu.addClass('-translate-x-full');
        }
    });

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* --- LÓGICA ATMOSPHERIC PEEK (GALERÍA + NAVEGACIÓN MÓVIL) --- */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function updateGalleryModal(index, isFirstOpen = false) {
    const allCards = $('.catalog-card'); 
    const totalCards = allCards.length;
    
    currentCardIndex = (index + totalCards) % totalCards;
    const prevIndex = (currentCardIndex - 1 + totalCards) % totalCards;
    const nextIndex = (currentCardIndex + 1) % totalCards;

    const mainSrc = allCards.eq(currentCardIndex).find('.card-image').attr('src');
    const mainTitle = allCards.eq(currentCardIndex).find('.card-title').text();
    const prevSrc = allCards.eq(prevIndex).find('.card-image').attr('src');
    const nextSrc = allCards.eq(nextIndex).find('.card-image').attr('src');

    $('#peek-prev-img').attr('src', prevSrc);
    $('#peek-next-img').attr('src', nextSrc);

    if (isFirstOpen) {
        $('.modal-img').attr('src', mainSrc).show();
        $('.modal-caption').text(mainTitle);
        isTransitioning = false;
    } else {
        isTransitioning = true;
        $('.modal-img').stop().fadeOut(200, function() {
            $(this).attr('src', mainSrc).fadeIn(200);
            $('.modal-caption').text(mainTitle);
            isTransitioning = false;
        });
    }
}

// 1. ABRIR MODAL
$(document).on('click', '.catalog-card', function(e) {
    // Si se hace clic en botones de navegación de la card (carrusel), no abrir modal
    if ($(e.target).closest('.mobile-nav-btn, .mobile-card-nav').length) {
        return; 
    }

    e.preventDefault();
    const allCards = $('.catalog-card');
    const index = allCards.index(this);
    $('#image-modal').css('display', 'flex').hide().fadeIn(300);
    updateGalleryModal(index, true);
    $('body').addClass('overflow-hidden').css('overflow', 'hidden');
});

// 2. NAVEGACIÓN DENTRO DEL MODAL (UNIFICADA DESKTOP + MÓVIL)
// Escuchamos tanto a los botones de las columnas como a los flotantes móviles
$(document).on('click', '#next-card, #mobile-next', function(e) {
    e.stopPropagation();
    updateGalleryModal(currentCardIndex + 1);
});

$(document).on('click', '#prev-card, #mobile-prev', function(e) {
    e.stopPropagation();
    updateGalleryModal(currentCardIndex - 1);
});

// 3. NAVEGACIÓN MÓVIL (SCROLL FÍSICO DEL CARRUSEL EN LA HOME)
$(document).on('click', '.mobile-nav-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const isNext = $(this).hasClass('next-mobile');
    const carousel = $(this).closest('.gallery-carousel');
    const scrollAmount = carousel.find('.catalog-card').outerWidth() + 40;

    carousel.stop().animate({
        scrollLeft: carousel.scrollLeft() + (isNext ? scrollAmount : -scrollAmount)
    }, 400);
});

// 4. CLIC EN LAS "ORILLAS" DE LA SECCIÓN (OPCIONAL/CSS PSEUDOS)
$(document).on('click', '.gallery-section', function(e) {
    // Evitamos disparar esto si se hizo clic directamente en una card o botón
    if ($(e.target).closest('.catalog-card, .mobile-nav-btn').length) return;

    const section = $(this);
    const carousel = section.find('.gallery-carousel');
    const scrollAmount = carousel.find('.catalog-card').outerWidth() + 20;
    
    if (e.offsetX < 60) {
        carousel.animate({ scrollLeft: carousel.scrollLeft() - scrollAmount }, 400);
    } 
    else if (e.offsetX > (section.width() - 60)) {
        carousel.animate({ scrollLeft: carousel.scrollLeft() + scrollAmount }, 400);
    }
});
    
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* --- NAVEGACIÓN MÓVIL (BOTONES INTERNOS) --- */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// Botón SIGUIENTE dentro de la card
$(document).on('click', '.next-mobile', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Evita que se abra el modal al tocar la flecha
    
    // Buscamos el carrusel padre de esta card y lo movemos
    const carousel = $(this).closest('.gallery-carousel');
    const scrollAmount = carousel.find('.catalog-card').outerWidth() + 40; // card + gap
    carousel.animate({ scrollLeft: carousel.scrollLeft() + scrollAmount }, 400);
});

// Botón ANTERIOR dentro de la card
$(document).on('click', '.prev-mobile', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const carousel = $(this).closest('.gallery-carousel');
    const scrollAmount = carousel.find('.catalog-card').outerWidth() + 40;
    carousel.animate({ scrollLeft: carousel.scrollLeft() - scrollAmount }, 400);
});

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* --- REPRODUCTOR DE AUDIO --- */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    function updatePlayPauseUI(playing) {
        const btn = $('#play-pause-btn i');
        if (playing) {
            btn.removeClass('fa-play').addClass('fa-pause');
            $('.visualizer span').css('animation-play-state', 'running');
        } else {
            btn.removeClass('fa-pause').addClass('fa-play');
            $('.visualizer span').css('animation-play-state', 'paused');
        }
    }

    $('#play-pause-btn').click(function(e) {
        e.stopPropagation();
        if (audio.paused) {
            audio.play();
            updatePlayPauseUI(true);
        } else {
            audio.pause();
            updatePlayPauseUI(false);
        }
    });

    audio.ontimeupdate = function() {
        const progress = (audio.currentTime / audio.duration) * 100;
        $('#progress').css('width', progress + '%');
    };

    // Desbloqueo inicial
    $(document).one('click', function() {
        if (!audioUnlocked) {
            audio.play().then(() => {
                updatePlayPauseUI(true);
                audioUnlocked = true;
            }).catch(e => console.log("Interacción necesaria para audio"));
        }
    });

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* --- EVENTOS DE CIERRE GLOBAL Y TECLADO --- */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    // Cierre por Botones X
    $(document).on('click', '.close-modal, .close-profile, .close-friends, .close-music, .close-modal-container', function(e) {
        e.stopPropagation();
        closeAllModals();
    });

    // Cierre por clic fuera (Overlay)
    $('.modal-overlay').click(function(e) {
        if ($(e.target).hasClass('modal-overlay') || $(e.target).hasClass('modal-carousel-wrapper') || $(e.target).hasClass('profile-modal-overlay')) {
            closeAllModals();
        }
    });

    // Control por Teclado
    $(window).on('keydown', function(e) {
        if ($('.modal-overlay').is(':visible')) {
            if (e.key === "Escape" || e.keyCode === 27) closeAllModals();
            
            // Solo si el modal de galería está visible activamos flechas
            if ($('#image-modal').is(':visible')) {
                if (e.key === "ArrowRight" || e.keyCode === 39) $('#next-card').click();
                if (e.key === "ArrowLeft" || e.keyCode === 37) $('#prev-card').click();
            }
        }
    });

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* --- VINCULACIÓN MENÚ LATERAL --- */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    
    $('.menu-item[title="Home"]').on('click', function(e) { e.preventDefault(); openHome(); });
    $('.menu-item[title="Friends"]').on('click', function(e) { e.preventDefault(); openFriends(); });
    $('.menu-item[title="Music"]').on('click', function(e) { e.preventDefault(); openMusic(); });

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* --- EFECTOS VISUALES (LLUVIA Y CORAZONES) --- */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    // Lluvia Neón
    const rainContainer = $('.neon-rain-container');
    const dropCount = 40;
    for (let i = 0; i < dropCount; i++) {
        const drop = $('<div class="drop"></div>');
        drop.css({
            'left': Math.random() * 100 + 'vw',
            'animation-duration': (Math.random() * 4 + 4) + 's',
            'animation-delay': Math.random() * 5 + 's'
        });
        rainContainer.append(drop);
    }

    // Corazones
    $('.menu-item[title="Favoritos"]').click(function(e) {
        e.preventDefault();
        const colors = ['heart-aqua', 'heart-lila', 'heart-rosa'];
        for (let i = 0; i < 30; i++) {
            createHeart(colors[Math.floor(Math.random() * colors.length)]);
        }
    });

    function createHeart(colorClass) {
        const heart = $(`<i class="fa-solid fa-heart heart-particle ${colorClass}"></i>`);
        heart.css({
            '--tx': (Math.random() - 0.5) * 600 + 'px',
            '--ty': (Math.random() - 0.5) * 600 + 'px',
            '--tr': (Math.random() * 360) + 'deg'
        });
        $('body').append(heart);
        setTimeout(() => heart.remove(), 1500);
    }
});