// Scroll Reveal Animation

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach((element) => {
    const top = element.getBoundingClientRect().top;
    const visiblePoint = 100;

    if (top < windowHeight - visiblePoint) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
