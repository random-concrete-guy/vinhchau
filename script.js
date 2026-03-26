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
// Scaling viewer data
// =========================
const cycleData = [
  {
    cycle: 0,
    label: "0 cycles",
    src: "images/cycle0.jpg",
    description: "Initial surface condition before freeze-thaw exposure.",
    scaling: 0
  },
  {
    cycle: 4,
    label: "4 cycles",
    src: "images/cycle4.jpg",
    description: "Very early stage with minimal visible change.",
    scaling: 152
  },
  {
    cycle: 8,
    label: "8 cycles",
    src: "images/cycle8.jpg",
    description: "Insignificant dammage.",
    scaling: 253
  },
  {
    cycle: 14,
    label: "14 cycles",
    src: "images/cycle14.jpg",
    description: "Insignificant dammage.",
    scaling: 397
  },
  {
    cycle: 28,
    label: "28 cycles",
    src: "images/cycle28.jpg",
    description: "Scaling becomes more noticeable.",
    scaling: 700
  },
  {
    cycle: 40,
    label: "40 cycles",
    src: "images/cycle40.jpg",
    description: "Progressive surface damage develops.",
    scaling: 1145
  },
  {
    cycle: 56,
    label: "56 cycles",
    src: "images/cycle56.jpg",
    description: "Clear scaling with visible material loss.",
    scaling: 1506
  },
  {
    cycle: 70,
    label: "70 cycles",
    src: "images/cycle70.jpg",
    description: "Advanced deterioration of the surface.",
    scaling: 1988
  },
  {
    cycle: 84,
    label: "84 cycles",
    src: "images/cycle84.jpg",
    description: "Severe scaling across the exposed surface.",
    scaling: 2439
  },
  {
    cycle: 98,
    label: "98 cycles",
    src: "images/cycle98.jpg",
    description: "Late-stage deterioration after prolonged exposure.",
    scaling: 3082
  }
];

const cycleImage = document.getElementById("cycleImage");
const cycleLabel = document.getElementById("cycleLabel");
const cycleDescription = document.getElementById("cycleDescription");
const cycleSlider = document.getElementById("cycleSlider");
const cycleButtons = document.querySelectorAll(".cycle-btn");
const chartCanvas = document.getElementById("scalingChart");

let cycleTimeout;

// =========================
// Draw plot
// =========================
function drawScalingChart(activeIndex) {
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext("2d");
  const w = chartCanvas.width;
  const h = chartCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = { top: 30, right: 20, bottom: 45, left: 60 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const xValues = cycleData.map(d => d.cycle);
  const yValues = cycleData.map(d => d.scaling);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = 0;
  const yMax = Math.max(...yValues) * 1.1;

  function xScale(x) {
    return padding.left + ((x - xMin) / (xMax - xMin)) * plotW;
  }

  function yScale(y) {
    return padding.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
  }

  // axes
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "#334";
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + plotH);
  ctx.lineTo(padding.left + plotW, padding.top + plotH);
  ctx.stroke();

  // y ticks
  ctx.fillStyle = "#556";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const yVal = yMin + (i / yTicks) * (yMax - yMin);
    const y = yScale(yVal);

    ctx.strokeStyle = "rgba(120,130,140,0.18)";
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + plotW, y);
    ctx.stroke();

    ctx.fillStyle = "#5d6b78";
    ctx.fillText(Math.round(yVal), padding.left - 8, y);
  }

  // x ticks
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  xValues.forEach((xVal) => {
    const x = xScale(xVal);
    ctx.strokeStyle = "rgba(120,130,140,0.18)";
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + plotH);
    ctx.stroke();

    ctx.fillStyle = "#5d6b78";
    ctx.fillText(String(xVal), x, padding.top + plotH + 8);
  });

  // axis labels
  ctx.save();
  ctx.fillStyle = "#334";
  ctx.font = "13px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Freeze-thaw cycles", padding.left + plotW / 2, h - 10);

  ctx.translate(16, padding.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Scaling mass (g/m²)", 0, 0);
  ctx.restore();

  // line
  ctx.strokeStyle = "#4f7a96";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  cycleData.forEach((d, i) => {
    const x = xScale(d.cycle);
    const y = yScale(d.scaling);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // points
  cycleData.forEach((d, i) => {
    const x = xScale(d.cycle);
    const y = yScale(d.scaling);

    ctx.beginPath();
    ctx.arc(x, y, i === activeIndex ? 7 : 4, 0, Math.PI * 2);
    ctx.fillStyle = i === activeIndex ? "#1f78d1" : "#4f7a96";
    ctx.fill();

    if (i === activeIndex) {
      ctx.strokeStyle = "#173a56";
      ctx.lineWidth = 2;
      ctx.stroke();

      // tooltip-like label
      const label = `${d.cycle}, ${d.scaling}`;
      ctx.font = "12px Arial";
      const textW = ctx.measureText(label).width;
      const boxX = x - textW / 2 - 8;
      const boxY = y - 34;

      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.strokeStyle = "#9fb4c3";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, textW + 16, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#243340";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, boxY + 11);
    }
  });
}

// =========================
// Update selected cycle
// =========================
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
    cycleDescription.textContent = `${item.description} Scaling mass: ${item.scaling} g/m².`;
    cycleImage.style.opacity = "1";
  }, 120);

  drawScalingChart(index);
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
