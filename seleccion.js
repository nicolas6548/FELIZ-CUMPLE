const sliderContainer = document.querySelector(".slider-container");
const slideRight = document.querySelector(".right-slide");
const slideLeft = document.querySelector(".left-slide");
const upButton = document.querySelector(".up-button");
const downButton = document.querySelector(".down-button");
const slidesLength = slideRight.querySelectorAll("div").length;

let activeSlideIndex = 0;

// Verificar si hay un parámetro de sección en la URL
const urlParams = new URLSearchParams(window.location.search);
const sectionParam = urlParams.get("section");
if (sectionParam !== null && !isNaN(sectionParam)) {
  activeSlideIndex = Math.min(
    Math.max(0, parseInt(sectionParam)),
    slidesLength - 1
  );
}

// Configuración inicial correcta para el left-slide
slideLeft.style.top = `0`;

// Función para actualizar la posición de ambos slides
const updateSlider = () => {
  const sliderHeight = sliderContainer.clientHeight;

  // Mover el slide derecho (imágenes)
  slideRight.style.transform = `translateY(-${
    activeSlideIndex * sliderHeight
  }px)`;

  // Mover el slide izquierdo (contenido)
  slideLeft.style.transform = `translateY(-${
    activeSlideIndex * sliderHeight
  }px)`;
};

// Función para navegar a una sección específica
const scrollToSection = (index) => {
  activeSlideIndex = index;
  updateSlider();
};

// Función para cambiar de slide
const changeSlide = (direction) => {
  if (direction === "up") {
    activeSlideIndex = (activeSlideIndex + 1) % slidesLength;
  } else if (direction === "down") {
    activeSlideIndex = (activeSlideIndex - 1 + slidesLength) % slidesLength;
  }
  updateSlider();
};

// Event listeners
upButton.addEventListener("click", () => changeSlide("up"));
downButton.addEventListener("click", () => changeSlide("down"));

// Inicializar el slider
updateSlider();

// Redimensionar correctamente al cambiar tamaño de ventana
window.addEventListener("resize", updateSlider);
