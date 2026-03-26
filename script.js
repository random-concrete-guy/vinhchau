
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
    label: "7 cycles",
    src: "images/cycle7.jpg",
    description: "Early exposure stage with little or limited visible surface change."
  },
  {
    label: "14 cycles",
    src: "images/cycle14.jpg",
    description: "Initial signs of progressive surface distress may begin to appear."
  },
  {
    label: "28 cycles",
    src: "images/cycle28.jpg",
    description: "Scaling becomes more noticeable as exposure continues."
  },
  {
    label: "56 cycles",
    src: "images/cycle56.jpg",
    description: "Surface scaling is clearly developed at this stage."
  },
  {
    label: "80 cycles",
    src: "images/cycle80.jpg",
    description: "Late-stage surface deterioration after prolonged freeze-thaw cycling."
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


