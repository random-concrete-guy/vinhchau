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
// Replace massGain values with your real data
// =========================
const cycleData = [
  {
    cycle: 0,
    label: "0 cycles",
    src: "images/cycle0.jpg",
    description: "Initial surface condition before freeze-thaw exposure.",
    scaling: 0,
    massGain: 0.00
  },
  {
    cycle: 4,
    label: "4 cycles",
    src: "images/cycle4.jpg",
    description: "Very early stage with minimal visible change.",
    scaling: 152,
    massGain: 7.9
  },
  {
    cycle: 8,
    label: "8 cycles",
    src: "images/cycle8.jpg",
    description: "Early exposure stage; surface still mostly intact.",
    scaling: 253,
    massGain: 11.9
  },
  {
    cycle: 14,
    label: "14 cycles",
    src: "images/cycle14.jpg",
    description: "Initial signs of surface distress may begin.",
    scaling: 397,
    massGain: 17.4
  },
  {
    cycle: 28,
    label: "28 cycles",
    src: "images/cycle28.jpg",
    description: "Scaling becomes more noticeable.",
    scaling: 700,
    massGain: 22.3
  },
  {
    cycle: 40,
    label: "40 cycles",
    src: "images/cycle40.jpg",
    description: "Progressive surface damage develops.",
    scaling: 1145,
    massGain: 24.8
  },
  {
    cycle: 56,
    label: "56 cycles",
    src: "images/cycle56.jpg",
    description: "Clear scaling with visible material loss.",
    scaling: 1506,
    massGain: 27.2
  },
  {
    cycle: 70,
    label: "70 cycles",
    src: "images/cycle70.jpg",
    description: "Advanced deterioration of the surface.",
    scaling: 1988,
    massGain: 30.1
  },
  {
    cycle: 84,
    label: "84 cycles",
    src: "images/cycle84.jpg",
    description: "Severe scaling across the exposed surface.",
    scaling: 2439,
    massGain: 32.5
  },
  {
    cycle: 98,
    label: "98 cycles",
    src: "images/cycle98.jpg",
    description: "Late-stage deterioration after prolonged exposure.",
    scaling: 3081,
    massGain: 36.5
  }
];

const cycleImage = document.getElementById("cycleImage");
const cycleLabel = document.getElementById("cycleLabel");
const cycleDescription = document.getElementById("cycleDescription");
const cycleSlider = document.getElementById("cycleSlider");
const cycleButtons = document.querySelectorAll(".cycle-btn");

const scalingCanvas = document.getElementById("scalingChart");
const massGainCanvas = document.getElementById("massGainChart");

let cycleTimeout;

// =========================
// Shared chart helpers
// =========================
function drawAxes(ctx, w, h, padding, xValues, yMin, yMax, yLabel, showOnlyMinMax = false) {
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);

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

  // y labels
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#5d6b78";

  if (showOnlyMinMax) {
    ctx.fillText(String(yMin), padding.left - 8, yScale(yMin));
    ctx.fillText(String(yMax), padding.left - 8, yScale(yMax));
  } else {
    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yMin + (i / yTicks) * (yMax - yMin);
      const y = yScale(yVal);

      ctx.strokeStyle = "rgba(120,130,140,0.18)";
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotW, y);
      ctx.stroke();

      ctx.fillStyle = "#5d6b78";
      ctx.fillText(yVal.toFixed(2), padding.left - 8, y);
    }
  }

  // x labels + vertical guides
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  xValues.forEach((xVal) => {
    const x = xScale(xVal);

    ctx.strokeStyle = "rgba(120,130,140,0.12)";
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + plotH);
    ctx.stroke();

    ctx.fillStyle = "#5d6b78";
    ctx.fillText(String(xVal), x, padding.top + plotH + 8);
  });

  // x-axis title
  ctx.save();
  ctx.fillStyle = "#334";
  ctx.font = "13px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Freeze-thaw cycles", padding.left + plotW / 2, h - 10);

  // y-axis title
  ctx.translate(18, padding.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  return { xScale, yScale, plotW, plotH };
}

function drawLineAndPoints(ctx, visibleData, activeItem, xScale, yScale, valueKey, lineColor, pointColor) {
  if (visibleData.length > 0) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    visibleData.forEach((d, i) => {
      const x = xScale(d.cycle);
      const y = yScale(d[valueKey]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  visibleData.forEach((d) => {
    const x = xScale(d.cycle);
    const y = yScale(d[valueKey]);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = pointColor;
    ctx.fill();
  });

  if (activeItem) {
    const x = xScale(activeItem.cycle);
    const y = yScale(activeItem[valueKey]);

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
    ctx.strokeStyle = "#173a56";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// =========================
// Scaling chart
// =========================
function drawScalingChart(activeIndex) {
  if (!scalingCanvas) return;

  const ctx = scalingCanvas.getContext("2d");
  const w = scalingCanvas.width;
  const h = scalingCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const xValues = cycleData.map(d => d.cycle);

  const yMin = 0;
  const yMax = 4000;

  const { xScale, yScale, plotW } = drawAxes(
    ctx,
    w,
    h,
    padding,
    xValues,
    yMin,
    yMax,
    "Scaling mass (g/m²)",
    true
  );

  // dashed threshold lines
  function drawDashedLine(yValue, label, color) {
    const y = yScale(yValue);

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + plotW, y);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = color;
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(label, padding.left + 6, y - 4);
  }

  drawDashedLine(500, "Insignificant limit (500)", "#4caf50");
  drawDashedLine(1500, "Failure limit (1500)", "#d9534f");

  const visibleData = cycleData.slice(0, activeIndex + 1);
  const activeItem = cycleData[activeIndex];

  drawLineAndPoints(
    ctx,
    visibleData,
    activeItem,
    xScale,
    yScale,
    "scaling",
    "#1f78d1",
    "#4f7a96"
  );

  // active label box
  if (activeItem) {
    const x = xScale(activeItem.cycle);
    const y = yScale(activeItem.scaling);

    const label = `(${activeItem.cycle}, ${activeItem.scaling})`;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textW = ctx.measureText(label).width;
    const boxW = textW + 16;
    const boxH = 24;
    const boxX = x - boxW / 2;
    const boxY = y - 38;

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.strokeStyle = "#9fb4c3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#243340";
    ctx.fillText(label, x, boxY + boxH / 2);
  }
}

// =========================
// Mass gain chart
// =========================
function drawMassGainChart(activeIndex) {
  if (!massGainCanvas) return;

  const ctx = massGainCanvas.getContext("2d");
  const w = massGainCanvas.width;
  const h = massGainCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const xValues = cycleData.map(d => d.cycle);

  const allMassGain = cycleData.map(d => d.massGain);
  const yMin = 0;
  const yMax = 40;

  const { xScale, yScale } = drawAxes(
    ctx,
    w,
    h,
    padding,
    xValues,
    yMin,
    yMax,
    "Mass gain (g)",
    true
  );

  const visibleData = cycleData.slice(0, activeIndex + 1);
  const activeItem = cycleData[activeIndex];

  drawLineAndPoints(
    ctx,
    visibleData,
    activeItem,
    xScale,
    yScale,
    "massGain",
    "#2a9d8f",
    "#5c8f88"
  );

  // active label box
  if (activeItem) {
    const x = xScale(activeItem.cycle);
    const y = yScale(activeItem.massGain);

    const label = `(${activeItem.cycle}, ${activeItem.massGain.toFixed(1)})`;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textW = ctx.measureText(label).width;
    const boxW = textW + 16;
    const boxH = 24;
    const boxX = x - boxW / 2;
    const boxY = y - 38;

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.strokeStyle = "#9fb4c3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#243340";
    ctx.fillText(label, x, boxY + boxH / 2);
  }
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
    cycleDescription.textContent =
      `${item.description} Current scaling: ${item.scaling} g/m². Current mass gain: ${item.massGain.toFixed(2)} g.`;
    cycleImage.style.opacity = "1";
  }, 120);

  drawScalingChart(index);
  drawMassGainChart(index);
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
