// script.js
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;

  const g = 9.8;
  const v0Slider = document.getElementById('v0-slider');
  const angleSlider = document.getElementById('angle-slider');
  const v0Display = document.getElementById('v0-display');
  const angleDisplay = document.getElementById('angle-display');
  const maxHeightP = document.getElementById('max-height');
  const maxRangeP = document.getElementById('max-range');
  const ctx = document.getElementById('trajectory-chart').getContext('2d');

  const trajectoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Trayectoria',
        data: [],
        showLine: true,
        pointRadius: 4,
        pointHoverRadius: 8,
        borderWidth: 2,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: { display: true, text: 'Distancia (m)' }
        },
        y: {
          title: { display: true, text: 'Altura (m)' },
          min: 0
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => {
              const p = ctx.raw;
              return [
                `X: ${p.x.toFixed(2)} m`,
                `Y: ${p.y.toFixed(2)} m`,
                `Vx: ${p.vx.toFixed(2)} m/s`,
                `Vy: ${p.vy.toFixed(2)} m/s`
              ];
            }
          }
        }
      }
    }
  });

  function updateSimulation() {
    const v0 = +v0Slider.value;
    const θ = +angleSlider.value * Math.PI / 180;
    const v0x = v0 * Math.cos(θ);
    const v0y = v0 * Math.sin(θ);
    const tFlight = 2 * v0y / g;
    const hMax = v0y * v0y / (2 * g);
    const rangeMax = v0 * v0 * Math.sin(2 * θ) / g;

    maxHeightP.textContent = `Altura máxima: ${hMax.toFixed(2)} m`;
    maxRangeP.textContent  = `Alcance máximo: ${rangeMax.toFixed(2)} m`;

    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * tFlight;
      const x = v0x * t;
      const y = v0y * t - 0.5 * g * t * t;
      pts.push({ x, y, vx: v0x, vy: v0y - g * t });
    }

    trajectoryChart.data.datasets[0].data = pts;
    trajectoryChart.update();
  }

  function onV0Change() {
    v0Display.textContent = `${v0Slider.value} m/s`;
    v0Slider.setAttribute('aria-valuenow', v0Slider.value);
    updateSimulation();
  }
  function onAngleChange() {
    angleDisplay.textContent = `${angleSlider.value}°`;
    angleSlider.setAttribute('aria-valuenow', angleSlider.value);
    updateSimulation();
  }

  v0Slider.addEventListener('input', onV0Change);
  angleSlider.addEventListener('input', onAngleChange);

  onV0Change();
  onAngleChange();
});
