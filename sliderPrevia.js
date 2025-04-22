// Variables globales
const body = document.body;
const slides = document.querySelectorAll(".slide");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const thumbnailsContainer = document.querySelector(".thumbnails-container");
const toggleAutoplayBtn = document.getElementById("toggleAutoplay");
const toggleTransitionBtn = document.getElementById("toggleTransition");

let activeSlide = 0;
let autoplayInterval = null;
let autoplayEnabled = false;
const autoplayDelay = 5000; // 5 segundos
let currentTransition = "fade"; // Tipos: fade, slide-left, slide-right, zoom
let youtubeAPIReady = false;

// Inicialización
function init() {
  setBgToBody();
  setActiveSlide();
  createThumbnails();
  setupEventListeners();
  updateControlsUI();
  loadYouTubeAPI();
}

// Cargar YouTube API
function loadYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Configura los event listeners
function setupEventListeners() {
  leftBtn.addEventListener("click", () => {
    changeSlide(-1);
    resetAutoplay();
  });

  rightBtn.addEventListener("click", () => {
    changeSlide(1);
    resetAutoplay();
  });

  toggleAutoplayBtn.addEventListener("click", toggleAutoplay);
  toggleTransitionBtn.addEventListener("click", changeTransition);

  // Soporte para touch
  const slider = document.querySelector(".slider-container");
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );
}

// Maneja el deslizamiento táctil
function handleSwipe() {
  const threshold = 50;
  if (touchEndX < touchStartX - threshold) {
    changeSlide(1);
    resetAutoplay();
  } else if (touchEndX > touchStartX + threshold) {
    changeSlide(-1);
    resetAutoplay();
  }
}

// Cambia el slide según la dirección
function changeSlide(direction) {
  pauseCurrentMedia();
  activeSlide += direction;

  if (activeSlide > slides.length - 1) {
    activeSlide = 0;
  } else if (activeSlide < 0) {
    activeSlide = slides.length - 1;
  }

  setBgToBody();
  setActiveSlide();
  updateThumbnails();
}

// Establece el fondo del body según el slide activo (solo para imágenes)
function setBgToBody() {
  const imageSlide = slides[activeSlide].querySelector(".image-slide");
  if (imageSlide) {
    body.style.backgroundImage = imageSlide.style.backgroundImage;
  } else {
    body.style.backgroundImage = "none";
    body.style.backgroundColor = "#000";
  }
}

// Establece el slide activo con la transición seleccionada
function setActiveSlide() {
  slides.forEach((slide) => {
    slide.classList.remove("active");
    slide.classList.remove("fade", "slide-left", "slide-right", "zoom");
    slide.classList.add(currentTransition);
  });

  slides[activeSlide].classList.add("active");
  playCurrentMedia();
}

// Crea miniaturas para navegación rápida
function createThumbnails() {
  thumbnailsContainer.innerHTML = "";

  slides.forEach((slide, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");
    if (index === activeSlide) {
      thumbnail.classList.add("active");
    }

    const imageSlide = slide.querySelector(".image-slide");
    const videoSlide = slide.querySelector(".video-slide");

    if (imageSlide) {
      thumbnail.style.backgroundImage = imageSlide.style.backgroundImage;
    } else if (videoSlide) {
      const videoId = slide
        .querySelector("iframe")
        .src.split("/embed/")[1]
        .split("?")[0];
      thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/mqdefault.jpg)`;
    }

    thumbnail.addEventListener("click", () => {
      pauseCurrentMedia();
      activeSlide = index;
      setBgToBody();
      setActiveSlide();
      updateThumbnails();
      resetAutoplay();
    });

    thumbnailsContainer.appendChild(thumbnail);
  });
}

// Actualiza las miniaturas activas
function updateThumbnails() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle("active", index === activeSlide);
  });
}

// Control de autoplay
function toggleAutoplay() {
  autoplayEnabled = !autoplayEnabled;
  updateControlsUI();

  if (autoplayEnabled) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
}

function startAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    changeSlide(1);
  }, autoplayDelay);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function resetAutoplay() {
  if (autoplayEnabled) {
    stopAutoplay();
    startAutoplay();
  }
}

// Cambiar efecto de transición
function changeTransition() {
  const transitions = ["fade", "slide-left", "slide-right", "zoom"];
  const currentIndex = transitions.indexOf(currentTransition);
  const nextIndex = (currentIndex + 1) % transitions.length;
  currentTransition = transitions[nextIndex];

  slides.forEach((slide) => {
    slide.classList.remove("fade", "slide-left", "slide-right", "zoom");
    slide.classList.add(currentTransition);
  });

  updateControlsUI();
}

// Actualiza la UI de los controles
function updateControlsUI() {
  toggleAutoplayBtn.textContent = `Autoplay: ${autoplayEnabled ? "ON" : "OFF"}`;
  toggleTransitionBtn.textContent = `Transición: ${currentTransition}`;
}

// Control de medios (videos e imágenes)
function pauseCurrentMedia() {
  const activeVideo = slides[activeSlide].querySelector("iframe");
  if (activeVideo) {
    const videoId = activeVideo.src.split("/embed/")[1].split("?")[0];
    activeVideo.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  }
}

function playCurrentMedia() {
  const activeVideo = slides[activeSlide].querySelector("iframe");
  if (activeVideo && autoplayEnabled) {
    const videoId = activeVideo.src.split("/embed/")[1].split("?")[0];
    activeVideo.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
  }
}

// Carga diferida de imágenes
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('.image-slide[loading="lazy"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const imgSlide = entry.target;
          if (imgSlide.style.backgroundImage) {
            imgSlide.style.backgroundImage = imgSlide.style.backgroundImage;
          }
          observer.unobserve(imgSlide);
        }
      });
    },
    {
      rootMargin: "200px 0px",
    }
  );

  lazyImages.forEach((img) => observer.observe(img));
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  init();
  setupLazyLoading();
});

// Limpieza de memoria al salir
window.addEventListener("beforeunload", () => {
  stopAutoplay();
  slides.forEach((slide) => {
    const video = slide.querySelector("iframe");
    if (video) {
      video.src = "";
    }
  });
});

// YouTube API callback
function onYouTubeIframeAPIReady() {
  youtubeAPIReady = true;
}
