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

function closeMobileMenu(){document.getElementById("mobile-nav").classList.remove("active"),document.getElementById("menu-icon").className="fas fa-bars";}

document.addEventListener("DOMContentLoaded",()=>{

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener("click",e=>{
      e.preventDefault();
      const target=document.querySelector(link.getAttribute("href"));
      if(target){
        const offset=document.querySelector(".header").offsetHeight;
        window.scrollTo({top:target.offsetTop-offset,behavior:"smooth"});
      }
    });
  });

  animateOnScroll();

  // Carrusel
  const slides = document.querySelectorAll('.carrusel .slide');
  const carouselInner = document.getElementById('carousel-inner');
  function showSlide(index) {
    const total = slides.length;
    slideIndex = (index + total) % total;
    carouselInner.style.transform = 'translateX(' + (-slideIndex * 100) + '%)';
  }
  window.moveSlide = function(step) {
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
    lightboxImg.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('zoomed');
    });
  }
});

function animateOnScroll(){
  document.querySelectorAll(".fade-in").forEach(el=>{
    if(el.getBoundingClientRect().top<window.innerHeight-150)
      el.classList.add("visible");
  });
}
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);
