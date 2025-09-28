document.addEventListener('DOMContentLoaded', () => {
  const bookContainer = document.getElementById('jd-book');

  // Cargar JSON
  fetch('Eluney.json')
    .then(res => res.json())
    .then(data => {
      const { portada, indice, paginas } = data.libro;

      // 🟨 Portada
      document.getElementById('portada-titulo').textContent = portada.titulo;
      document.getElementById('portada-imagen').src = portada.imagen;
      document.getElementById('portada-flag').src = portada.flag;
      document.getElementById('portada-usuario').textContent = portada.usuario;
      document.getElementById('portada-bienvenida').textContent = portada.bienvenida;
      document.getElementById('portada-texto').textContent = portada.texto;
      document.getElementById('portada-firma').textContent = portada.firma;
      document.getElementById('portada-usuario').innerHTML = `${portada.usuario} <img class="jd-flag-inline" src="${portada.flag}" />`;
      document.getElementById('titulo-capitulo-1').textContent = "Capítulo 1: Regalo del cielo";


      // 🟩 Índice
      const indiceLista = document.getElementById('indice-lista');
      indice.forEach((titulo, i) => {
        const li = document.createElement('li');
        li.textContent = titulo;
        indiceLista.appendChild(li);
      });

// 🔁 Páginas dinámicas
paginas.forEach(p => {
  const existing = document.getElementById(`page-${p.numero}`);
  if (existing) return; // ⛔ Evita duplicar páginas que ya existen en el HTML

  const div = document.createElement('div');
  div.className = `jd-page flip inactive ${p.tipo === 'capitulo' ? 'jd-chapter' : 'jd-content'}`;
  div.id = `page-${p.numero}`;
  div.dataset.page = p.numero;

  if (p.tipo === 'capitulo') {
    div.innerHTML = `
      <div class="jd-block">
        <div class="jd-infor">
          <h2 class="jd-title-chapter">${p.titulo}</h2>
        </div>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div class="jd-number-top">Página ${p.numero}</div>
      <div class="jd-block">
        <div class="jd-infor">
          <h3 class="jd-title-page">✦ Página ${p.numero} ✦</h3>
          <p class="jd-libro">${p.contenido.replace(/\n/g, '<br>')}</p>
          ${p.imagen ? `<img class="img-book" src="${p.imagen}" />` : ''}
        </div>
      </div>
    `;
  }

  bookContainer.appendChild(div);
});

          
// 📄 Página 4: Regalo del cielo
const pagina4 = paginas.find(p => p.numero === 4 && p.tipo === "pagina");

if (pagina4) {
  // 🖋️ Insertar contenido en el párrafo principal
  const contenido4 = document.getElementById("contenido-4");
  if (contenido4) {
    contenido4.innerHTML = pagina4.contenido.replace(/\n/g, "<br>");
  }

  // 🔢 Actualizar numeración visible
  const numero4 = document.getElementById("numero-4");
  if (numero4) {
    numero4.textContent = `Página ${pagina4.numero}`;
  }

  // 🖼️ Si hubiera imagen, insertarla (aunque en este caso es null)
  const imagen4 = document.getElementById("imagen-4");
  if (imagen4 && pagina4.imagen) {
    imagen4.src = pagina4.imagen;
  }
}

// 📄 Página 5: Regalo del cielo (segunda parte)
const pagina5 = paginas.find(p => p.numero === 5 && p.tipo === "pagina");

if (pagina5) {
  // 🖋️ Insertar contenido en el párrafo principal
  const contenido5 = document.getElementById("contenido-5");
  if (contenido5) {
    contenido5.innerHTML = pagina5.contenido.replace(/\n/g, "<br>");
  }

  // 🔢 Actualizar numeración visible
  const numero5 = document.getElementById("numero-5");
  if (numero5) {
    numero5.textContent = `Página ${pagina5.numero}`;
  }

  // 🖼️ Si hubiera imagen, insertarla (aunque en este caso es null)
  const imagen5 = document.getElementById("imagen-5");
  if (imagen5 && pagina5.imagen) {
    imagen5.src = pagina5.imagen;
  }
}

// 📄 Página 6: Capítulo 2
const capitulo2 = paginas.find(p => p.numero === 6 && p.tipo === "pagina");

if (capitulo2) {
  // 🖋️ Insertar título del capítulo
  const tituloCap2 = document.getElementById("titulo-capitulo-2");
  if (tituloCap2) {
    tituloCap2.textContent = capitulo2.titulo;
  }

  // 🔢 Actualizar numeración visible
  const numeroCap2 = document.getElementById("numero-6");
  if (numeroCap2) {
    numeroCap2.textContent = `Página ${capitulo2.numero}`;
  }
}

// 📄 Página 7: A través de nosotros (primera parte)
const pagina7 = paginas.find(p => p.numero === 7 && p.tipo === "pagina");

if (pagina7) {
  // 🖋️ Insertar contenido en el párrafo principal
  const contenido7 = document.getElementById("contenido-7");
  if (contenido7) {
    contenido7.innerHTML = pagina7.contenido.replace(/\n/g, "<br>");
  }

  // 🔢 Actualizar numeración visible
  const numero7 = document.getElementById("numero-7");
  if (numero7) {
    numero7.textContent = `Página ${pagina7.numero}`;
  }

  // 🖼️ Si hubiera imagen, insertarla (aunque en este caso es null)
  const imagen7 = document.getElementById("imagen-7");
  if (imagen7 && pagina7.imagen) {
    imagen7.src = pagina7.imagen;
  }
}

// 📄 Página 8: A través de nosotros (segunda parte)
const pagina8 = paginas.find(p => p.numero === 8 && p.tipo === "pagina");

if (pagina8) {
  // 🖋️ Insertar contenido en el párrafo principal
  const contenido8 = document.getElementById("contenido-8");
  if (contenido8) {
    contenido8.innerHTML = pagina8.contenido.replace(/\n/g, "<br>");
  }

  // 🔢 Actualizar numeración visible
  const numero8 = document.getElementById("numero-8");
  if (numero8) {
    numero8.textContent = `Página ${pagina8.numero}`;
  }

  // 🖼️ Si hubiera imagen, insertarla (aunque en este caso es null)
  const imagen8 = document.getElementById("imagen-8");
  if (imagen8 && pagina8.imagen) {
    imagen8.src = pagina8.imagen;
  }
}

// 📄 Página 9: A través de nosotros (continuación)
const pagina9 = paginas.find(p => p.numero === 9 && p.tipo === "pagina");

if (pagina9) {
  const contenido9 = document.getElementById("contenido-9");
  if (contenido9) {
    contenido9.innerHTML = pagina9.contenido.replace(/\n/g, "<br>");
  }

  const numero9 = document.getElementById("numero-9");
  if (numero9) {
    numero9.textContent = `Página ${pagina9.numero}`;
  }

  const imagen9 = document.getElementById("imagen-9");
  if (imagen9 && pagina9.imagen) {
    imagen9.src = pagina9.imagen;
  }
}

// 📄 Página 10: A través de nosotros (final)
const pagina10 = paginas.find(p => p.numero === 10 && p.tipo === "pagina");

if (pagina10) {
  const contenido10 = document.getElementById("contenido-10");
  if (contenido10) {
    contenido10.innerHTML = pagina10.contenido.replace(/\n/g, "<br>");
  }

  const numero10 = document.getElementById("numero-10");
  if (numero10) {
    numero10.textContent = `Página ${pagina10.numero}`;
  }

  const imagen10 = document.getElementById("imagen-10");
  if (imagen10 && pagina10.imagen) {
    imagen10.src = pagina10.imagen;
  }
}

// 📄 Página 11: Capítulo 3
const capitulo3 = paginas.find(p => p.numero === 11 && p.tipo === "capitulo");

if (capitulo3) {
  const tituloCap3 = document.getElementById("titulo-capitulo-3");
  if (tituloCap3) {
    tituloCap3.textContent = capitulo3.titulo;
  }

  const numeroCap3 = document.getElementById("numero-11");
  if (numeroCap3) {
    numeroCap3.textContent = `Página ${capitulo3.numero}`;
  }
}

// 📄 Página 12: El calor de tus besos (inicio del capítulo)
const pagina12 = paginas.find(p => p.numero === 12 && p.tipo === "pagina");

if (pagina12) {
  const contenido12 = document.getElementById("contenido-12");
  if (contenido12) {
    contenido12.innerHTML = pagina12.contenido.replace(/\n/g, "<br>");
  }

  const numero12 = document.getElementById("numero-12");
  if (numero12) {
    numero12.textContent = `Página ${pagina12.numero}`;
  }

  const imagen12 = document.getElementById("imagen-12");
  if (imagen12 && pagina12.imagen) {
    imagen12.src = pagina12.imagen;
  }
}

// 📄 Página 13: El calor de tus besos (final del capítulo)
const pagina13 = paginas.find(p => p.numero === 13 && p.tipo === "pagina");

if (pagina13) {
  const contenido13 = document.getElementById("contenido-13");
  if (contenido13) {
    contenido13.innerHTML = pagina13.contenido.replace(/\n/g, "<br>");
  }

  const numero13 = document.getElementById("numero-13");
  if (numero13) {
    numero13.textContent = `Página ${pagina13.numero}`;
  }

  const imagen13 = document.getElementById("imagen-13");
  if (imagen13 && pagina13.imagen) {
    imagen13.src = pagina13.imagen;
  }
}


      // 🔄 Navegación
      const pages = Array.from(document.querySelectorAll('.jd-page'));
      let currentIndex = pages.findIndex(p => p.classList.contains('active'));

      function updatePages() {
        pages.forEach((page, i) => {
          if (i === currentIndex) {
            page.classList.add('active');
            page.classList.remove('inactive');
          } else {
            page.classList.remove('active');
            page.classList.add('inactive');
          }
        });
      }

      window.nextPage = function () {
        if (currentIndex < pages.length - 1) {
          currentIndex++;
          updatePages();
        }
      };

      window.prevPage = function () {
        if (currentIndex > 0) {
          currentIndex--;
          updatePages();
        }
      };

      updatePages(); // Inicializa la página activa
    });
});
