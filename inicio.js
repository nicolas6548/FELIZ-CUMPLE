const loadText = document.querySelector(".loading-text");
const bg = document.querySelector(".bg");
const postLoadContent = document.querySelector(".post-load-content"); // Contenedor del botón + texto
const ingresarBtn = document.getElementById("ingresarBtn");

let load = 0;
let int = setInterval(blurring, 30);

function blurring() {
  load++;

  if (load > 99) {
    clearInterval(int);
    // Ocultar el contador
    loadText.style.display = "none";
    // Mostrar el contenedor del botón + texto
    postLoadContent.classList.add("visible");
  }

  loadText.innerText = `${load}%`;
  loadText.style.opacity = scale(load, 0, 100, 1, 0);
  bg.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
}

// Función para escalar valores (para el blur y opacidad)
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

// Redirección al hacer clic en el botón (configúralo luego)
//ingresarBtn.addEventListener("click", () => {
 // window.open("cumpleaños.html", "_blank");
//});


ingresarBtn.addEventListener("click", () => {
  window.open("cumpleaños.html", "_blank");
}); //antes de finalizar descomentar el codigo de arriba que va a ser el final, y eliminar este