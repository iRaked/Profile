// ===== Estado del libro =====
let currentPage = 0;
let book = null;
let globalDelay = 0;
const BASE_FONT_SIZE = 15; // Tamaño base coherente para todas las páginas

// ===== Inicialización =====
$(document).ready(function () {
  $.getJSON("Conny.json", function (json) {
    book = json.book;
    renderPage(currentPage);
  });

  // Navegación
  $("#nav-left").on("click", function () {
    if (currentPage > 0) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  $("#nav-right").on("click", function () {
    if (!book) return;
    if (currentPage < getTotalPages() - 1) {
      currentPage++;
      renderPage(currentPage);
    }
  });
});

// ===== Limpieza =====
function clearPanels() {
  $("#left-panel .zone-ctn-left, #right-panel .zone-ctn-right")
    .empty()
    .css({ transform: "", transformOrigin: "", fontSize: "" });
  $(".page-number").remove();
}

// ===== Render principal =====
function renderPage(index) {
  if (!book || !book.pages) return;
  clearPanels();
  globalDelay = 0;

  const page = book.pages[index];
  if (!page) return;

  renderSide("#left-panel .zone-ctn-left", page.left);
  renderSide("#right-panel .zone-ctn-right", page.right);

  const { leftNum, rightNum } = resolveIndividualPageNumbers(index);
  renderPageNumber(leftNum, rightNum);

  fitContentBoth();
  toggleNavState();
}

// ===== Render lado =====
function renderSide(selector, content) {
  if (!content) return;
  const $side = $(selector);

  if (content.image)
    $side.append(`<img src="${content.image}" class="cover-img" />`);
  if (content.title)
    $side.append(`<h2 class="page-title">${content.title}</h2>`);
  if (content.author)
    $side.append(
      `<div class="author" style="font-family:${content.authorFont};">${content.author}</div>`
    );
  if (content.authorId)
    $side.append(`<div class="author-id">(${content.authorId})</div>`);
  if (content.entries) {
    const html =
      "<ul class='index-list'>" +
      content.entries
        .map((e) => `<li>${e.chapter} — pág. ${e.page}</li>`)
        .join("") +
      "</ul>";
    $side.append(html);
  }
  if (content.photo)
    $side.append(`<img src="${content.photo}" class="chapter-img" />`);

  // ===== Ajuste dinámico de texto =====
  if (content.text) {
    const containerHeight = $(selector).parent().height(); // altura del panel
    const titleHeight = content.title ? 40 : 0; // altura estimada del título
    const textPages = splitTextIntoPages(content.text, BASE_FONT_SIZE, containerHeight, titleHeight);

    // Renderizamos solo la primera subpágina (el resto se puede navegar)
    textPages[0].forEach(line => renderKaraokeLine($side[0], line));
  }
}

// ===== Render línea tipo karaoke =====
function renderKaraokeLine(container, text) {
  const line = document.createElement("p");
  line.classList.add("karaoke-line");

  const words = String(text).trim().split(/\s+/);
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.animationName = "karaokeInvert";
    span.style.animationDuration = "0.4s";
    span.style.animationFillMode = "forwards";
    span.style.animationDelay = `${globalDelay + i * 0.2}s`;
    line.appendChild(span);
  });

  container.appendChild(line);
  globalDelay += words.length * 0.2 + 0.5;
}

// ===== Dividir texto según altura disponible =====
function splitTextIntoPages(textArray, fontSize, containerHeight, titleHeight = 0) {
  const pages = [];
  let currentPage = [];
  let usedHeight = titleHeight;

  const lineHeight = fontSize * 1.2;

  textArray.forEach(paragraph => {
    const linesNeeded = Math.ceil(paragraph.length / 55); // 50 chars aprox.
    const heightNeeded = linesNeeded * lineHeight;

    if (usedHeight + heightNeeded > containerHeight) {
      pages.push([...currentPage]);
      currentPage = [paragraph];
      usedHeight = titleHeight + heightNeeded;
    } else {
      currentPage.push(paragraph);
      usedHeight += heightNeeded;
    }
  });

  if (currentPage.length) pages.push(currentPage);
  return pages;
}

// ===== Numeración =====
function resolveIndividualPageNumbers(index) {
  const page = book.pages[index];
  return {
    leftNum: page?.left?.pageNumberLeft ?? null,
    rightNum: page?.right?.pageNumberRight ?? null,
  };
}

function renderPageNumber(leftNum, rightNum) {
  if (leftNum !== null)
    $("#left-panel .zone-ctn-left").append(
      `<div class="page-number left-num">${leftNum}</div>`
    );
  if (rightNum !== null)
    $("#right-panel .zone-ctn-right").append(
      `<div class="page-number right-num">${rightNum}</div>`
    );
}

// ===== Ajuste dinámico sin desbordes =====
function fitContentBoth() {
  const leftZone  = document.querySelector("#left-panel .content-zone");
  const rightZone = document.querySelector("#right-panel .content-zone");
  const leftCtn   = document.querySelector("#left-panel .zone-ctn-left");
  const rightCtn  = document.querySelector("#right-panel .zone-ctn-right");

  if (!leftZone || !rightZone || !leftCtn || !rightCtn) return;

  [leftCtn, rightCtn].forEach(ctn => {
    ctn.style.fontSize = BASE_FONT_SIZE + "px";
    ctn.style.transform = "none";
    ctn.style.width = "100%";
    ctn.style.height = "auto";
  });

  const leftRect  = leftCtn.getBoundingClientRect();
  const rightRect = rightCtn.getBoundingClientRect();

  const leftScaleX  = leftZone.clientWidth  / leftRect.width;
  const leftScaleY  = leftZone.clientHeight / leftRect.height;
  const rightScaleX = rightZone.clientWidth / rightRect.width;
  const rightScaleY = rightZone.clientHeight / rightRect.height;

  const scale = Math.min(leftScaleX, leftScaleY, rightScaleX, rightScaleY, 1);

  [leftCtn, rightCtn].forEach(ctn => {
    ctn.style.transform = `scale(${scale})`;
    ctn.style.transformOrigin = "top left";
  });
}

// ===== Utilidades =====
function getTotalPages() {
  return book?.pages?.length ?? 0;
}

function toggleNavState() {
  const atStart = currentPage <= 0;
  const atEnd = currentPage >= getTotalPages() - 1;
  $("#nav-left").toggleClass("active", !atStart);
  $("#nav-right").toggleClass("active", !atEnd);
}
