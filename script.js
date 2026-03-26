
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

// =========================
// Scaling viewer
// =========================
const cycleData = [
  {
    label: "0 cycles",
    src: "images/cycle0.jpg",
    description: "Initial surface condition before freeze-thaw exposure."
  },
  {
    label: "4 cycles",
    src: "images/cycle4.jpg",
    description: "Very early stage with minimal visible change."
  },
  {
    label: "8 cycles",
    src: "images/cycle8.jpg",
    description: "Early exposure stage; surface still mostly intact."
  },
  {
    label: "14 cycles",
    src: "images/cycle14.jpg",
    description: "Initial signs of surface distress may begin."
  },
  {
    label: "28 cycles",
    src: "images/cycle28.jpg",
    description: "Scaling becomes more noticeable."
  },
  {
    label: "40 cycles",
    src: "images/cycle40.jpg",
    description: "Progressive surface damage develops."
  },
  {
    label: "56 cycles",
    src: "images/cycle56.jpg",
    description: "Clear scaling with visible material loss."
  },
  {
    label: "70 cycles",
    src: "images/cycle70.jpg",
    description: "Advanced deterioration of the surface."
  },
  {
    label: "84 cycles",
    src: "images/cycle84.jpg",
    description: "Severe scaling across the exposed surface."
  },
  {
    label: "98 cycles",
    src: "images/cycle98.jpg",
    description: "Late-stage deterioration after prolonged exposure."
  }
];

const cycleImage = document.getElementById("cycleImage");
const cycleLabel = document.getElementById("cycleLabel");
const cycleDescription = document.getElementById("cycleDescription");
const cycleSlider = document.getElementById("cycleSlider");
const cycleButtons = document.querySelectorAll(".cycle-btn");

let cycleTimeout;

function updateCycle(index) {
  if (index < 0 || index >= cycleData.length) return;
  if (!cycleImage || !cycleLabel || !cycleDescription || !cycleSlider) return;

  const item = cycleData[index];

  clearTimeout(cycleTimeout);

  cycleImage.style.opacity = "0.35";
  cycleSlider.value = index;

  cycleButtons.forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.cycle-btn[data-index="${index}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  cycleTimeout = setTimeout(() => {
    cycleImage.src = item.src;
    cycleImage.alt = `Concrete surface at ${item.label}`;
    cycleLabel.textContent = item.label;
    cycleDescription.textContent = item.description;
    cycleImage.style.opacity = "1";
  }, 120);
}

if (cycleImage && cycleLabel && cycleDescription && cycleSlider) {
  updateCycle(0);

  cycleSlider.addEventListener("input", () => {
    updateCycle(Number(cycleSlider.value));
  });

  cycleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateCycle(Number(btn.dataset.index));
    });
  });
}


