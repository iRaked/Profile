// 1. CONFIGURACIÓN DE CLASES Y ESTADOS
const pcbackClasses = ['p1', 'p2', 'p3', 'central', 'p5', 'p6', 'p7'];
const pstyleClasses = ['p1', 'p2', 'central', 'p3', 'p5'];
let autoplayInterval = null;

// 2. REFERENCIAS DOM
const allImages = Array.from(document.querySelectorAll('#section-carousel .img-h'));
const pstyleItems = Array.from(document.querySelectorAll('#pstyle-vortex .img-h'));
const pcbackArc = document.querySelector('#section-carousel .arc-container');
const pstyleArc = document.querySelector('#pstyle-vortex .arc-container');

// UI Elementos
const currentIndexEl = document.getElementById('current-index');
const totalItemsEl = document.getElementById('total-items');
const currentIndexPstyleEl = document.getElementById('current-pstyle-index');
const totalPstyleItemsEl = document.getElementById('total-pstyle-items');

// Modal
const modal = document.getElementById('modal-pcback');
const modalImg = document.getElementById('modal-img-real');
const orderPanel = document.getElementById('order-panel');
const btnAutoplay = document.getElementById('btn-autoplay');

// 3. FUNCIONES MAESTRAS DE ACTUALIZACIÓN
function updatePCBack() {
    allImages.forEach((img, index) => {
        img.classList.remove(...pcbackClasses);
        if (index < pcbackClasses.length) {
            img.classList.add(pcbackClasses[index]);
            img.style.display = "block";
            if (pcbackClasses[index] === 'central') {
                if(currentIndexEl) currentIndexEl.textContent = img.dataset.originIndex;
                if (modal.classList.contains('active') && modal.dataset.currentMode === 'pcback') {
                    modalImg.src = img.src;
                }
            }
        } else {
            img.style.display = "none";
        }
    });
}

function updatePStyle() {
    pstyleItems.forEach((img, i) => {
        img.classList.remove(...pstyleClasses);
        if (i < pstyleClasses.length) {
            img.classList.add(pstyleClasses[i]);
            img.style.display = "block";
            if (pstyleClasses[i] === 'central') {
                if(currentIndexPstyleEl) currentIndexPstyleEl.textContent = img.dataset.originIndex;
                if (modal.classList.contains('active') && modal.dataset.currentMode === 'pstyle') {
                    modalImg.src = img.src;
                }
            }
        } else {
            img.style.display = "none";
        }
    });
}

// 4. LÓGICA DE MOVIMIENTO
const moveNext = () => { allImages.push(allImages.shift()); updatePCBack(); };
const movePrev = () => { allImages.unshift(allImages.pop()); updatePCBack(); };

function rotatePStyle(reverse = false) {
    if (reverse) pstyleItems.unshift(pstyleItems.pop());
    else pstyleItems.push(pstyleItems.shift());
    updatePStyle();
}

// 5. LÓGICA DE MODAL
function openModal(imageSrc, mode) {
    modalImg.src = imageSrc;
    modal.classList.add('active');
    modal.dataset.currentMode = mode;
    pcbackArc.style.opacity = "1";
    pstyleArc.style.opacity = "1";

    if(mode === 'pstyle') {
        pstyleArc.style.opacity = "0.1";
        modal.classList.add('pstyle-mode');
    } else {
        pcbackArc.style.opacity = "0.1";
        modal.classList.remove('pstyle-mode');
    }
}

function closeModalFunction() {
    modal.classList.remove('active', 'pstyle-mode');
    orderPanel.classList.remove('active');
    modalImg.style.opacity = "1";
    pcbackArc.style.opacity = "1";
    pstyleArc.style.opacity = "1";
    stopAutoplay();
}

// 6. EVENTOS Y LISTENERS (Mapeados al HTML real)

// PCBACK Principal
document.getElementById('next')?.addEventListener('click', () => { stopAutoplay(); moveNext(); });
document.getElementById('prev')?.addEventListener('click', () => { stopAutoplay(); movePrev(); });

// PSTYLE Vortex
document.getElementById('next-pstyle')?.addEventListener('click', () => { stopAutoplay(); rotatePStyle(false); });
document.getElementById('prev-pstyle')?.addEventListener('click', () => { stopAutoplay(); rotatePStyle(true); });

// Modal Navegación
document.getElementById('next-modal')?.addEventListener('click', () => {
    stopAutoplay();
    modal.dataset.currentMode === 'pstyle' ? rotatePStyle(false) : moveNext();
});

document.getElementById('prev-modal')?.addEventListener('click', () => {
    stopAutoplay();
    modal.dataset.currentMode === 'pstyle' ? rotatePStyle(true) : movePrev();
});

// Clicks en imágenes centrales
pcbackArc?.addEventListener('click', (e) => { if (e.target.classList.contains('central')) openModal(e.target.src, 'pcback'); });
pstyleArc?.addEventListener('click', (e) => { if (e.target.classList.contains('central')) openModal(e.target.src, 'pstyle'); });

// Botones de Ordenar
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.profile-card');
        const cardImg = card.querySelector('.main-img').src;
        const isPstyle = card.closest('#damas-pstyle, #caballeros-pstyle, #temporadas-pstyle');
        openModal(cardImg, isPstyle ? 'pstyle' : 'pcback');
    });
});

// Controles Internos Modal
document.getElementById('btn-ordenar-modal')?.addEventListener('click', () => {
    orderPanel.classList.toggle('active');
    modalImg.style.opacity = orderPanel.classList.contains('active') ? "0.4" : "1";
});

document.getElementById('btn-cancel-order')?.addEventListener('click', () => {
    orderPanel.classList.remove('active');
    modalImg.style.opacity = "1";
});

document.getElementById('close-modal')?.addEventListener('click', closeModalFunction);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModalFunction(); });

// 7. UTILIDADES
function stopAutoplay() {
    if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; }
    btnAutoplay.classList.remove('is-playing');
    btnAutoplay.innerHTML = '<i class="fas fa-play"></i> Autoplay';
}

btnAutoplay?.addEventListener('click', () => {
    if (autoplayInterval) { stopAutoplay(); } 
    else {
        btnAutoplay.classList.add('is-playing');
        btnAutoplay.innerHTML = '<i class="fas fa-pause"></i> Detener';
        autoplayInterval = setInterval(() => {
            if (modal.classList.contains('active')) {
                modal.dataset.currentMode === 'pstyle' ? rotatePStyle(false) : moveNext();
            } else { moveNext(); }
        }, 3000);
    }
});

document.getElementById('btn-screenshot')?.addEventListener('click', () => {
    const captureArea = document.getElementById('capture-area');
    const flash = document.getElementById('flash-overlay');
    if (flash) flash.style.display = 'none';

    html2canvas(captureArea, { backgroundColor: null, useCORS: true, scale: 2 }).then(canvas => {
        if (flash) {
            flash.style.display = 'block';
            flash.classList.add('flash-effect');
            setTimeout(() => flash.classList.remove('flash-effect'), 400);
        }
        const link = document.createElement('a');
        link.download = `RickProject_${modal.dataset.currentMode || 'pedido'}_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

// 8. INICIALIZACIÓN COMPLETA
if(totalItemsEl) totalItemsEl.textContent = allImages.length;
if(totalPstyleItemsEl) totalPstyleItemsEl.textContent = pstyleItems.length;

allImages.forEach((img, i) => img.dataset.originIndex = i + 1);
pstyleItems.forEach((img, i) => img.dataset.originIndex = i + 1);

updatePCBack();
updatePStyle();