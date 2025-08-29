// 🔗 Firebase: conexión al telégrafo emocional
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";

// 🔌 Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // 📬 Elementos del DOM
  const input = document.getElementById("fanMessage");
  const sendBtn = document.getElementById("sendMessage");
  const inbox = document.getElementById("privateInbox");
  const list = document.getElementById("messageList");
  const notifMessenger = document.getElementById("notifCountMessenger");
  const notifBell = document.getElementById("notifCountBell");
  const inboxTrigger = document.getElementById("inboxTrigger");
  const festiveBtn = document.querySelector(".festive-btn");
  const canvas = document.getElementById("confetti-canvas");

  let unreadCount = 0;

  // 🔔 Actualiza notificaciones visuales
  const updateNotification = () => {
    const display = unreadCount > 0 ? "inline-block" : "none";
    notifMessenger.textContent = unreadCount;
    notifBell.textContent = unreadCount;
    notifMessenger.style.display = display;
    notifBell.style.display = display;
  };

  // 📤 Enviar mensaje a Rick
  sendBtn?.addEventListener("click", async () => {
    const msg = input.value.trim();
    if (!msg) return;

    try {
      await addDoc(collection(db, "mensajesRick"), {
        texto: msg,
        fecha: new Date().toISOString()
      });
      input.value = "";
      unreadCount++;
      updateNotification();

      // ✨ Efecto visual de envío exitoso
      const burst = document.createElement("div");
      burst.className = "emoji-burst";
      burst.innerHTML = "📨✨💙";
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 1000);
    } catch (err) {
      console.error("❌ Error al enviar:", err);
      alert("⚠️ No se pudo enviar el mensaje");
    }
  });

  // 📥 Mostrar mensajes en tiempo real en el buzón
  onSnapshot(query(collection(db, "mensajesRick"), orderBy("fecha", "desc")), (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const item = document.createElement("div");
      item.className = "message-item";
      item.textContent = doc.data().texto;
      list.appendChild(item);
    });
  });

  // 🧿 Activar buzón privado
  inboxTrigger?.addEventListener("click", () => {
    const isHidden = inbox.style.display === "none";
    inbox.style.display = isHidden ? "block" : "none";
    if (isHidden) {
      unreadCount = 0;
      updateNotification();
    }
  });

  // 🎉 Confetti ritual desde botón festivo
  if (canvas && festiveBtn) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];

    const createConfetti = (x, y) => {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x, y,
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

    festiveBtn.addEventListener("click", () => {
      const rect = festiveBtn.getBoundingClientRect();
      createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      animateConfetti();
    });
  }

  // ✨ Animación de logo ritual
  document.querySelector(".logoBox")?.addEventListener("click", (e) => {
    const el = e.currentTarget;
    el.classList.add("spin");
    setTimeout(() => el.classList.remove("spin"), 600);
  });

  // 🌍 Botón de ubicación — abre Google Maps
  document.getElementById("locateMe")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
      }, () => {
        alert("No se pudo obtener tu ubicación.");
      });
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  });

  // 🎁 Botón Gift — animación simbólica
  document.getElementById("giftButton")?.addEventListener("click", (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    btn.classList.add("opening");
    setTimeout(() => btn.classList.remove("opening"), 2000);
  });

  // 🔍 Botón de búsqueda en Xat — Ritual de exploración
  document.getElementById("searchBtn")?.addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    window.open(`https://xat.com/search?q=${encodeURIComponent(query)}`, "_blank");
  });

  // 🧭 Navegación MultiTab — cambio de planos
  const tabs = document.querySelectorAll(".fb-post1-header ul li");
  const contents = document.querySelectorAll(".fb-post1-content .tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(targetId)?.classList.add("active");
    });
  });
});
