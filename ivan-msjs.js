document.addEventListener("DOMContentLoaded", () => {
  // 📬 Mensajería privada
  const messages = JSON.parse(localStorage.getItem('fanMessages')) || [];
  let unreadCount = parseInt(localStorage.getItem('unreadCount')) || 0;

  const input = document.getElementById('fanMessage');
  const sendBtn = document.getElementById('sendMessage');
  const notifMessenger = document.getElementById('notifCountMessenger');
  const notifBell = document.getElementById('notifCountBell');
  const inbox = document.getElementById('privateInbox');
  const list = document.getElementById('messageList');
  const inboxTrigger = document.getElementById('inboxTrigger');

  const updateNotification = () => {
    const displayStyle = unreadCount > 0 ? 'inline-block' : 'none';
    notifMessenger.textContent = unreadCount;
    notifBell.textContent = unreadCount;
    notifMessenger.style.display = displayStyle;
    notifBell.style.display = displayStyle;
  };

  const saveMessage = (msg) => {
    messages.unshift(msg);
    unreadCount++;
    localStorage.setItem('fanMessages', JSON.stringify(messages));
    localStorage.setItem('unreadCount', unreadCount);
    updateNotification();
  };

  const toggleInbox = () => {
    const isHidden = inbox.style.display === "none";
    inbox.style.display = isHidden ? "block" : "none";

    if (isHidden) {
      list.innerHTML = "";
      messages.forEach(m => {
        const item = document.createElement('div');
        item.className = "message-item";
        item.textContent = m;
        list.appendChild(item);
      });

      unreadCount = 0;
      localStorage.setItem('unreadCount', unreadCount);
      updateNotification();
    }
  };

  inboxTrigger?.addEventListener('click', toggleInbox);

  sendBtn?.addEventListener('click', () => {
    const msg = input.value.trim();
    if (!msg) return;
    saveMessage(msg);
    input.value = "";
  });

  updateNotification();
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//MODAL AMIGOS

const mensajesAmigos = {
  Amor: "Extrañarte es la mejor manera de decir cuanto te quiero, soñarte me dice que el pensarte no es suficiente y escucharte es el cierre de este ciclo de amor. Quisiera... vaya que quisiera hacer tantas cosas en tu compañía sino no te quisiera como te quiero y tú sabes cuanto te quiero.",
  BFF: "Contar contigo me llena de paz el alma, sin tu guía me perdería y por ello no tienes idea de cuando te valoro. A tu lado la distancia se vuelve efímera, un placer coincidir contigo en esta vida, señorita inolvidable.",
  Sister: "Manita shula te llevo como la mejor muestra de fraternidad y complicidad con la que he podido contar desde tiempos inmemoriales, mi respeto y mi cariño siempre hacia a ti.",
  Bebote: "Hermano ilustre y no exagero, vos sabés lo que significa contar con tu amistad, te cuido y te admiro como debe honrarse esta fraternidad, grande y piola che, nunca cambies bro.",
  Cloncita: "Amiga, que digo amiga, más que comadre; mi cloncita, confiable, leal, inteligente y simpática, eso es lo que he descubierto con tu amistad a la que aprecio, honro y respeto ante todo.",
  Compa: "Eres de esas amistades que no sabes qué esperar, lleno de bondad, serenidad y muchas ganas de pelear, perdón la costumbre, nunca te dejes de las personas descerebradas que para ello cuentas conmigo, fierro a la bestia mi compa.",
  Amygocha: "Juegos, risas, consejos, experiencias compartidas y siempre mucha comunicación es lo que hoy me permite honrar tu presencia con total afecto, cariño y respeto por poder llamarte amiga, naaa amygocha sí!.",
  Amix: "Amiga mía, perdida y despistada pero con un corazón generoso de dicha y alegría, literalmente me saque la lotería al conocerte.",
  Cuñis: "Ex cuñada sí pero nunca en desconEXión, porque tu esencia es libre e inocente, tu alma frágil y aventurera llena de energía ante la vida y sus obstáculos.",
  Pexioxa: "Si te leo me sorprendo al encontrar a una persona fuerte y centrada, lo que me hace especial al formar parte de tu círculo cercano, como tú del mío.",
  Pelonchas: "El millonario* más despreciado de este mundo virtual, él cree que el poder está en lo que puede comprar engañándose que la felicidad está en oferta, haciendo de su vida una fantasía. Apareces por relleno, no por gusto ;)"
};

const coloresTitulo = {
  Amor: "#ff4f91",
  BFF: "#00c2cb",
  Sister: "#ff69b4",
  Bebote: "#ffb347",
  Cloncita: "#c71585",
  Compa: "#1e90ff",
  Amygocha: "#ff6347",
  Amix: "#f08080",
  Cuñis: "#9370db",
  Pexioxa: "#00bfff",
  Pelonchas: "#ff4500"
};

document.querySelectorAll(".icon-button").forEach(icon => {
  icon.addEventListener("click", () => {
    const li = icon.closest("li");
    const id = li?.dataset.amigo;
    const mensaje = mensajesAmigos[id];

    if (mensaje) {
      mostrarModalAmigo(id, mensaje);
    } else {
      console.warn("⚠️ No hay mensaje definido para:", id);
    }
  });
});

function mostrarModalAmigo(nombre, mensaje) {
  const modal = document.createElement("div");
  modal.className = "modal-amigo";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2 class="modal-titulo">${nombre}</h2>
      <p class="modal-descripcion">${mensaje}</p>
    </div>
  `;

  document.body.appendChild(modal);

  // 🎨 Color dinámico del título
  const titulo = modal.querySelector(".modal-titulo");
  titulo.style.color = coloresTitulo[nombre] || "#ffffff";

  // 🔁 Cierre por botón
  modal.querySelector(".close-modal").addEventListener("click", closeModal);

  // 🔁 Cierre por clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // 🔁 Cierre por tecla ESC
  const escListener = (e) => {
    if (e.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", escListener);

  function closeModal() {
    modal.remove();
    document.removeEventListener("keydown", escListener);
  }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  //  Confetti FX desde botón .festive-btn
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    const createConfetti = (x, y) => {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x,
          y,
          size: Math.random() * 6 + 4,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          velocityX: (Math.random() - 0.5) * 6,
          velocityY: Math.random() * -8 - 2,
          gravity: 0.3,
          alpha: 1
        });
      }
    };

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.velocityY += p.gravity;
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.alpha -= 0.01;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) particles.splice(i, 1);
      });

      ctx.globalAlpha = 1;
      if (particles.length > 0) requestAnimationFrame(animateConfetti);
    };

    const btn = document.querySelector('.festive-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createConfetti(x, y);
        animateConfetti();
      });
    }
  }

  //  Animación de logo
  document.querySelector('.logoBox')?.addEventListener('click', (e) => {
    const el = e.currentTarget;
    el.classList.add('spin');
    setTimeout(() => el.classList.remove('spin'), 600);
  });
});

//  Desplazamiento Controlado Stories (pendiente de implementación)
  // Multi.js

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector('.stories-wrapper');
  const scrollStep = 140;

  const leftBtn = document.querySelector('.nav-btn.left');
  const rightBtn = document.querySelector('.nav-btn.right');

  leftBtn.addEventListener('click', () => {
    wrapper.scrollLeft -= scrollStep;
  });

  rightBtn.addEventListener('click', () => {
    wrapper.scrollLeft += scrollStep;
  });

  const updateButtons = () => {
    leftBtn.disabled = wrapper.scrollLeft <= 0;
    rightBtn.disabled = wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth;
  };

  wrapper.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
});
  
  // Navegacion MultiTab

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".fb-post1-header ul li");
  const contents = document.querySelectorAll(".fb-post1-content .tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      // Desactivar todos los tabs y contenidos
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      // Activar el tab y contenido correspondiente
      tab.classList.add("active");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
});
  
  //Boton Google Maps
  
  document.getElementById('locateMe').addEventListener('click', (e) => {
  e.preventDefault(); // Evita que el enlace se dispare antes de tener la ubicación

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
      window.open(mapUrl, '_blank'); // Abre Google Maps en una nueva pestaña
    }, () => {
      alert("No se pudo obtener tu ubicación. Verifica los permisos.");
    });
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
});

// Boton Gift

document.getElementById('giftButton').addEventListener('click', (e) => {
  e.preventDefault();
  const btn = e.currentTarget;
  btn.classList.add('opening');

  setTimeout(() => {
    btn.classList.remove('opening');
  }, 2000); // Duración de la sorpresa
});
  
  // Escritura en Search

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn?.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Redirige a búsqueda en xat con el término ingresado
    window.open(`https://xat.com/search?q=${encodeURIComponent(query)}`, "_blank");
  });
});
