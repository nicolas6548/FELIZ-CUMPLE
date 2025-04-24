document.addEventListener("DOMContentLoaded", function () {
  // Crear confeti
  function createConfetti() {
    const colors = ["#4a6fa5", "#ff6b6b", "#ffd166", "#06d6a0", "#118ab2"];
    const container = document.querySelector("body");

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
      confetti.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(confetti);
    }
  }

  // Efecto al hacer clic en el botón
  const button = document.querySelector(".start-button");
  if (button) {
    button.addEventListener("click", function () {
      this.classList.add("clicked");
      createConfetti();
      setTimeout(() => {
        this.classList.remove("clicked");
      }, 300);
    });
  }

  // Efecto de aparición para los elementos
  const elements = document.querySelectorAll(
    ".message-box, .memory-box, .photo-container"
  );
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300 * (index + 1));
  });
});
