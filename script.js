function toggleMobileMenu() {
  const nav = document.getElementById("mobile-nav");
  const icon = document.getElementById("menu-icon");
  if (nav && icon) {
    nav.classList.toggle("active");
    icon.className = nav.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
    icon.classList.add("animated");
    setTimeout(() => icon.classList.remove("animated"), 300);
  }
}

function closeMobileMenu() {
  document.getElementById("mobile-nav").classList.remove("active");
  document.getElementById("menu-icon").className = "fas fa-bars";
}

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        const offset = document.querySelector(".header").offsetHeight;
        window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
      }
    });
  });

  animateOnScroll();

  // Carrusel
  const slides = document.querySelectorAll('.carrusel .slide');
  const carouselInner = document.getElementById('carousel-inner');
  let slideIndex = 0;
  function showSlide(index) {
    const total = slides.length;
    slideIndex = (index + total) % total;
    carouselInner.style.transform = 'translateX(' + (-slideIndex * 100) + '%)';
  }
  window.moveSlide = function (step) {
    showSlide(slideIndex + step);
  };
  showSlide(0);
  if (slides.length > 1) {
    setInterval(() => window.moveSlide(1), 6000);
  }

  // Lightbox simple
  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      document.getElementById("lightbox-img").src = img.src;
      document.getElementById("lightbox").style.display = "flex";
    });
  });
  document.getElementById("lightbox").addEventListener('click', () => {
    document.getElementById("lightbox").style.display = "none";
  });

  // Lightbox con animación y zoom
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const galleryImgs = Array.from(document.querySelectorAll('.galeria-carrusel .lightbox-trigger'));
  let currentImgIndex = 0;

  function showLightbox(index, direction = null) {
    if (!galleryImgs[index]) return;
    currentImgIndex = index;

    // Animación de desplazamiento
    if (direction === 'left') {
      lightboxImg.classList.remove('slide-right');
      lightboxImg.classList.add('slide-left');
    } else if (direction === 'right') {
      lightboxImg.classList.remove('slide-left');
      lightboxImg.classList.add('slide-right');
    } else {
      lightboxImg.classList.remove('slide-left', 'slide-right');
    }

    // Cambia la imagen después de la animación
    setTimeout(() => {
      lightboxImg.src = galleryImgs[index].src;
      lightboxImg.classList.remove('slide-left', 'slide-right', 'zoomed');
    }, direction ? 200 : 0);

    lightbox.style.display = "flex";
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImg.classList.remove('zoomed');
  }

  function showPrevImg(e) {
    e && e.stopPropagation();
    let newIndex = (currentImgIndex - 1 + galleryImgs.length) % galleryImgs.length;
    showLightbox(newIndex, 'left');
  }

  function showNextImg(e) {
    e && e.stopPropagation();
    let newIndex = (currentImgIndex + 1) % galleryImgs.length;
    showLightbox(newIndex, 'right');
  }

  if (lightbox && lightboxImg && galleryImgs.length) {
    galleryImgs.forEach((img, idx) => {
      img.addEventListener('click', e => {
        e.stopPropagation();
        showLightbox(idx);
      });
    });
    lightbox.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImg);
    lightboxNext.addEventListener('click', showNextImg);

    // Navegación con teclado
    document.addEventListener('keydown', e => {
      if (lightbox.style.display === "flex") {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrevImg();
        if (e.key === "ArrowRight") showNextImg();
      }
    });

    // Evita cerrar el lightbox al hacer click en los controles o imagen
    [lightboxImg, lightboxPrev, lightboxNext].forEach(el => {
      el.addEventListener('click', e => e.stopPropagation());
    });

    // Zoom al hacer click en la imagen
    lightboxImg.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('zoomed');
    });
  }

  // --- Calendario dinámico e interactivo ---
  const eventosLiturgicos = [
    { fecha: '2025-06-29', titulo: 'Solemnidad de San Pedro y San Pablo', descripcion: 'Misa especial a las 19:00 hs.' },
    { fecha: '2025-07-16', titulo: 'Fiesta de la Virgen del Carmen', descripcion: 'Procesión y misa a las 18:00 hs.' },
    { fecha: '2025-08-15', titulo: 'Asunción de la Virgen María', descripcion: 'Misa solemne a las 10:00 hs.' },
    // Eventos de prueba
    { fecha: '2025-06-25', titulo: 'Ensayo del coro', descripcion: 'Ensayo general del coro parroquial a las 17:00 hs.' },
    { fecha: '2025-06-27', titulo: 'Reunión de catequesis', descripcion: 'Reunión informativa para padres y catequistas a las 18:30 hs.' },
    { fecha: '2025-07-01', titulo: 'Adoración Eucarística', descripcion: 'Hora Santa y adoración a las 20:00 hs.' },
    { fecha: '2025-07-05', titulo: 'Jornada de limpieza', descripcion: 'Voluntariado para limpieza del templo a las 08:00 hs.' },
    { fecha: '2025-07-10', titulo: 'Taller de Biblia', descripcion: 'Taller introductorio a la Biblia a las 19:00 hs.' },
  ];

  function renderCalendar(year, month) {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    container.innerHTML = '';
    const date = new Date(year, month, 1);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    let html = `<div class="calendar-header">
      <button id="prev-month">&lt;</button>
      <span>${monthNames[month]} ${year}</span>
      <button id="next-month">&gt;</button>
    </div>
    <table class="calendar-table"><thead><tr>`;
    days.forEach(d => html += `<th>${d}</th>`);
    html += '</tr></thead><tbody><tr>';
    let firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) html += '<td></td>';
    let day = 1;
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = firstDay; day <= lastDay; i++) {
      const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const evento = eventosLiturgicos.find(e => e.fecha === fechaStr);
      html += `<td class="calendar-day${evento ? ' has-event' : ''}" data-fecha="${fechaStr}">${day}${evento ? ' <span class="event-dot"></span>' : ''}</td>`;
      if ((i + 1) % 7 === 0 && day !== lastDay) html += '</tr><tr>';
      day++;
    }
    html += '</tr></tbody></table>';
    container.innerHTML = html;

    document.getElementById('prev-month').onclick = () => renderCalendar(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
    document.getElementById('next-month').onclick = () => renderCalendar(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

    document.querySelectorAll('.calendar-day.has-event').forEach(td => {
      td.onclick = () => {
        const fecha = td.getAttribute('data-fecha');
        const evento = eventosLiturgicos.find(e => e.fecha === fecha);
        if (evento) showEventModal(evento);
      };
    });
  }

  function showEventModal(evento) {
    const modal = document.getElementById('event-modal');
    const content = document.getElementById('event-content');
    if (modal && content) {
      content.innerHTML = `<h3>${evento.titulo}</h3><p>${evento.descripcion}</p><p><strong>Fecha:</strong> ${evento.fecha}</p>`;
      modal.style.display = 'flex';
    }
  }
  window.closeEventModal = function () {
    const modal = document.getElementById('event-modal');
    if (modal) modal.style.display = 'none';
  };

  // Inicializa el calendario al cargar la página
  const hoy = new Date();
  renderCalendar(hoy.getFullYear(), hoy.getMonth());

  // Evangelio del día (usando API de evangelizo.org)
  function cargarEvangelio() {
    const cont = document.getElementById('evangelio-dia');
    if (!cont) return;
    fetch('https://api.labibliadigital.com/api/verses/day?language=SPA')
      .then(res => res.json())
      .then(data => {
        if (data && data.text) {
          cont.innerHTML = `
            <div class="evangelio-cita">${data.reference || ''}</div>
            <div class="evangelio-texto">${data.text}</div>
          `;
        } else {
          cont.innerHTML = '<div class="evangelio-error">No disponible por el momento.</div>';
        }
      })
      .catch(() => {
        cont.innerHTML = '<div class="evangelio-error">No disponible por el momento.</div>';
      });
  }
  document.addEventListener('DOMContentLoaded', cargarEvangelio);
});

function animateOnScroll() {
  document.querySelectorAll(".fade-in, .animated-fadein").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);
