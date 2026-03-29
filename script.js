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
// DATASETS
// =========================
const frostSaltData = [
  {
    cycle: 0,
    label: "0 cycles",
    src: "images/cycle0.jpg",
    description: "Initial surface condition before freeze-thaw exposure.",
    scaling: 0,
    secondary: 0.0
  },
  {
    cycle: 4,
    label: "4 cycles",
    src: "images/cycle4.jpg",
    description: "Very early stage with minimal visible change.",
    scaling: 152,
    secondary: 7.9
  },
  {
    cycle: 8,
    label: "8 cycles",
    src: "images/cycle8.jpg",
    description: "Early exposure stage; surface still mostly intact.",
    scaling: 253,
    secondary: 11.9
  },
  {
    cycle: 14,
    label: "14 cycles",
    src: "images/cycle14.jpg",
    description: "Initial signs of surface distress may begin.",
    scaling: 397,
    secondary: 17.4
  },
  {
    cycle: 28,
    label: "28 cycles",
    src: "images/cycle28.jpg",
    description: "Scaling becomes more noticeable.",
    scaling: 700,
    secondary: 22.3
  },
  {
    cycle: 40,
    label: "40 cycles",
    src: "images/cycle40.jpg",
    description: "Progressive surface damage develops.",
    scaling: 1145,
    secondary: 24.8
  },
  {
    cycle: 56,
    label: "56 cycles",
    src: "images/cycle56.jpg",
    description: "Clear scaling with visible material loss.",
    scaling: 1506,
    secondary: 27.2
  },
  {
    cycle: 70,
    label: "70 cycles",
    src: "images/cycle70.jpg",
    description: "Advanced deterioration of the surface.",
    scaling: 1988,
    secondary: 30.1
  },
  {
    cycle: 84,
    label: "84 cycles",
    src: "images/cycle84.jpg",
    description: "Severe scaling across the exposed surface.",
    scaling: 2439,
    secondary: 32.5
  },
  {
    cycle: 98,
    label: "98 cycles",
    src: "images/cycle98.jpg",
    description: "Late-stage deterioration after prolonged exposure.",
    scaling: 3081,
    secondary: 36.5
  }
];

// Replace this with your real pure frost data later
const pureFrostData = [
  {
    cycle: 0,
    label: "0 cycles",
    src: "images/purefrost0.jpg",
    description: "Initial condition before pure frost exposure.",
    scaling: 0,
    secondary: 100.0
  },
  {
    cycle: 4,
    label: "4 cycles",
    src: "images/purefrost4.jpg",
    description: "Insignificant scaling.",
    scaling: 19.0,
    secondary: 3.0
  },
  {
    cycle: 8,
    label: "8 cycles",
    src: "images/purefrost8.jpg",
    description: "Insignificant scaling.",
    scaling: 29.0,
    secondary: 5.5
  },
  {
    cycle: 14,
    label: "14 cycles",
    src: "images/purefrost14.jpg",
    description: "Insignificant scaling.",
    scaling: 33.0,
    secondary: 8.8
  },
  {
    cycle: 28,
    label: "28 cycles",
    src: "images/purefrost28.jpg",
    description: "Insignificant scaling.",
    scaling: 51.0,
    secondary: 14.5
  },
  {
    cycle: 40,
    label: "40 cycles",
    src: "images/purefrost40.jpg",
    description: "Insignificant scaling.",
    scaling: 62,
    secondary: 19.7
  },
  {
    cycle: 56,
    label: "56 cycles",
    src: "images/purefrost56.jpg",
    description: "Insignificant scaling.",
    scaling: 83.0,
    secondary: 24.4
  },
  {
    cycle: 70,
    label: "70 cycles",
    src: "images/purefrost70.jpg",
    description: "Insignificant scaling.",
    scaling: 95,
    secondary: 25.9
  },
  {
    cycle: 84,
    label: "84 cycles",
    src: "images/purefrost84.jpg",
    description: "Insignificant scaling.",
    scaling: 117,
    secondary: 27.1
  },
  {
    cycle: 98,
    label: "98 cycles",
    src: "images/purefrost98.jpg",
    description: "Insignificant scaling.",
    scaling: 125,
    secondary: 27.8
  }
];

const modes = {
  frostSalt: {
    name: "Frost-salt attack",
    data: frostSaltData,
    secondaryTitle: "Cryogenic suction (g)",
    secondaryValueLabel: "Current cryogenic suction",
    secondaryKey: "secondary",
    secondaryDecimals: 1,
    secondaryYMin: 0,
    secondaryYMax: 40,
    secondaryShowOnlyMinMax: true,
    secondaryLineColor: "#2a9d8f",
    secondaryPointColor: "#5c8f88",
    scalingYMin: 0,
    scalingYMax: 4000,
    showScalingThresholds: true
  },
  pureFrost: {
    name: "Pure frost attack",
    data: pureFrostData,
    secondaryTitle: "Relative dynamic modulus (%)",
    secondaryValueLabel: "Current RDM",
    secondaryKey: "secondary",
    secondaryDecimals: 1,
    secondaryYMin: 0,
    secondaryYMax: 100,
    secondaryShowOnlyMinMax: true,
    secondaryLineColor: "#8a5cf6",
    secondaryPointColor: "#a084e8",
    scalingYMin: 0,
    scalingYMax: 400,
    showScalingThresholds: false
  }
};

let currentMode = "frostSalt";

// =========================
// ELEMENTS
// =========================
const cycleImage = document.getElementById("cycleImage");
const cycleLabel = document.getElementById("cycleLabel");
const cycleDescription = document.getElementById("cycleDescription");
const cycleSlider = document.getElementById("cycleSlider");

const scalingCanvas = document.getElementById("scalingChart");
const massGainCanvas = document.getElementById("massGainChart");

const playPauseBtn = document.getElementById("playPauseBtn");
const frostSaltTab = document.getElementById("frostSaltTab");
const pureFrostTab = document.getElementById("pureFrostTab");

let cycleTimeout;

// =========================
// AUTOPLAY
// =========================
let autoplayInterval = null;
let isPlaying = true;
let currentIndex = 0;
const autoplayDelay = 1800;

// =========================
// HELPERS
// =========================
function getActiveModeConfig() {
  return modes[currentMode];
}

function getActiveData() {
  return getActiveModeConfig().data;
}

function updateSliderBounds() {
  const activeData = getActiveData();
  if (!cycleSlider) return;
  cycleSlider.min = 0;
  cycleSlider.max = activeData.length - 1;
  cycleSlider.step = 1;
}

function setActiveTabUI() {
  if (frostSaltTab) {
    frostSaltTab.classList.toggle("active", currentMode === "frostSalt");
  }
  if (pureFrostTab) {
    pureFrostTab.classList.toggle("active", currentMode === "pureFrost");
  }
}

function startAutoplay() {
  if (autoplayInterval) return;

  autoplayInterval = setInterval(() => {
    const activeData = getActiveData();
    currentIndex += 1;

    if (currentIndex >= activeData.length) {
      currentIndex = 0;
    }

    updateCycle(currentIndex);
  }, autoplayDelay);

  if (playPauseBtn) {
    playPauseBtn.textContent = "⏸ Pause";
  }
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = null;

  if (playPauseBtn) {
    playPauseBtn.textContent = "▶ Play";
  }
}

function pauseAutoplayOnManualInput() {
  stopAutoplay();
  isPlaying = false;
}

function switchMode(newMode) {
  if (!modes[newMode]) return;

  stopAutoplay();
  currentMode = newMode;
  currentIndex = 0;
  updateSliderBounds();
  setActiveTabUI();
  updateCycle(currentIndex);

  if (isPlaying) {
    startAutoplay();
  } else if (playPauseBtn) {
    playPauseBtn.textContent = "▶ Play";
  }
}

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
      ctx.fillText(yVal.toFixed(1), padding.left - 8, y);
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

function drawLabelBox(ctx, x, y, label) {
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

// =========================
// CHARTS
// =========================
function drawScalingChart(activeIndex) {
  if (!scalingCanvas) return;

  const activeMode = getActiveModeConfig();
  const activeData = getActiveData();

  const ctx = scalingCanvas.getContext("2d");
  const w = scalingCanvas.width;
  const h = scalingCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const xValues = activeData.map(d => d.cycle);

  const yMin = activeMode.scalingYMin;
  const yMax = activeMode.scalingYMax;

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

  if (activeMode.showScalingThresholds) {
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
  }

  const visibleData = activeData.slice(0, activeIndex + 1);
  const activeItem = activeData[activeIndex];

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

  if (activeItem) {
    const x = xScale(activeItem.cycle);
    const y = yScale(activeItem.scaling);
    const label = `(${activeItem.cycle}, ${activeItem.scaling})`;
    drawLabelBox(ctx, x, y, label);
  }
}

function drawSecondaryChart(activeIndex) {
  if (!massGainCanvas) return;

  const activeMode = getActiveModeConfig();
  const activeData = getActiveData();

  const ctx = massGainCanvas.getContext("2d");
  const w = massGainCanvas.width;
  const h = massGainCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const xValues = activeData.map(d => d.cycle);

  const yMin = activeMode.secondaryYMin;
  const yMax = activeMode.secondaryYMax;

  const { xScale, yScale } = drawAxes(
    ctx,
    w,
    h,
    padding,
    xValues,
    yMin,
    yMax,
    activeMode.secondaryTitle,
    activeMode.secondaryShowOnlyMinMax
  );

  const visibleData = activeData.slice(0, activeIndex + 1);
  const activeItem = activeData[activeIndex];

  drawLineAndPoints(
    ctx,
    visibleData,
    activeItem,
    xScale,
    yScale,
    activeMode.secondaryKey,
    activeMode.secondaryLineColor,
    activeMode.secondaryPointColor
  );

  if (activeItem) {
    const x = xScale(activeItem.cycle);
    const y = yScale(activeItem[activeMode.secondaryKey]);
    const label = `(${activeItem.cycle}, ${activeItem[activeMode.secondaryKey].toFixed(activeMode.secondaryDecimals)})`;
    drawLabelBox(ctx, x, y, label);
  }
}

// =========================
// UPDATE VIEWER
// =========================
function updateCycle(index) {
  const activeData = getActiveData();
  const activeMode = getActiveModeConfig();

  if (index < 0 || index >= activeData.length) return;
  if (!cycleImage || !cycleLabel || !cycleDescription || !cycleSlider) return;

  const item = activeData[index];
  clearTimeout(cycleTimeout);

  cycleImage.style.opacity = "0.35";
  cycleSlider.value = index;

  cycleTimeout = setTimeout(() => {
    cycleImage.src = item.src;
    cycleImage.alt = `${activeMode.name} surface at ${item.label}`;
    cycleLabel.textContent = item.label;
    cycleDescription.textContent =
      `${item.description} Current scaling: ${item.scaling} g/m². ${activeMode.secondaryValueLabel}: ${item[activeMode.secondaryKey].toFixed(activeMode.secondaryDecimals)}.`;
    cycleImage.style.opacity = "1";
  }, 120);

  drawScalingChart(index);
  drawSecondaryChart(index);
}

// =========================
// INITIALIZATION
// =========================
if (cycleImage && cycleLabel && cycleDescription && cycleSlider) {
  currentIndex = 0;
  updateSliderBounds();
  setActiveTabUI();
  updateCycle(currentIndex);
  startAutoplay();

  cycleSlider.addEventListener("input", () => {
    pauseAutoplayOnManualInput();
    currentIndex = Number(cycleSlider.value);
    updateCycle(currentIndex);
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
      isPlaying = !isPlaying;
    });
  }

  if (frostSaltTab) {
    frostSaltTab.addEventListener("click", () => {
      switchMode("frostSalt");
    });
  }

  if (pureFrostTab) {
    pureFrostTab.addEventListener("click", () => {
      switchMode("pureFrost");
    });
  }
}
