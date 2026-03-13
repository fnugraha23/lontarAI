/* ========================================================
    LONTARA DASHBOARD - CHART ENGINE
    Fungsi: Visualisasi Analitik Hidrologi & Tata Guna Lahan
    Library: Chart.js v4+
   ======================================================== */

// Pengaturan Global: Menyesuaikan dengan font Manrope (Theme Utama)
Chart.defaults.font.family = "'Manrope', sans-serif";
Chart.defaults.color = "#64748b"; // Tailwind gray-500
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.borderRadius = 8;

// ==========================================
// 1. GRAFIK TUTUPAN LAHAN (DOUGHNUT)
// ==========================================
const ctxPie = document.getElementById("landUseChart").getContext("2d");
let landUseChart = new Chart(ctxPie, {
  type: "doughnut",
  data: {
    labels: ["Hutan", "Pertanian", "Pemukiman", "Semak", "Sawah"],
    datasets: [
      {
        data: [35, 25, 10, 15, 15],
        backgroundColor: [
          "#123b3a", // Forest Green (Primary)
          "#ca8a04", // Mustard
          "#dc2626", // Red
          "#00b8a9", // Teal (Accent)
          "#22c55e", // Green
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 10,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // Lebih elegan untuk gaya World Bank
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          font: { size: 11, weight: "600" },
        },
      },
    },
  },
});

// ==========================================
// 2. GRAFIK INDEKS KERENTANAN (HORIZONTAL BAR)
// ==========================================
const ctxBar = document.getElementById("vulnerabilityChart").getContext("2d");
let vulnerabilityChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: ["Limpasan", "Erosi", "Kualitas Air"],
    datasets: [
      {
        label: "Skor Kerentanan",
        data: [75, 60, 40],
        backgroundColor: ["#dc2626", "#f59e0b", "#00b8a9"],
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true, max: 100, grid: { display: false } },
      y: { grid: { borderDash: [2, 4], drawBorder: false } },
    },
    plugins: {
      legend: { display: false },
    },
  },
});

// ==========================================
// 3. GRAFIK FAKTOR PENENTU (RADAR)
// ==========================================
const ctxRadar = document.getElementById("radarChart").getContext("2d");
let radarChart = new Chart(ctxRadar, {
  type: "radar",
  data: {
    labels: ["Lereng", "Hujan", "Tanah", "Vegetasi", "Antropogenik"],
    datasets: [
      {
        label: "Bobot Pengaruh",
        data: [80, 70, 65, 40, 55],
        backgroundColor: "rgba(0, 184, 169, 0.15)", // Teal Transparan
        borderColor: "#00b8a9",
        borderWidth: 2,
        pointBackgroundColor: "#123b3a",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(0,0,0,0.05)" },
        grid: { color: "rgba(0,0,0,0.05)" },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: { font: { size: 10, weight: "700" } },
      },
    },
    plugins: { legend: { display: false } },
  },
});

// ==========================================
// 4. FUNGSI UPDATE DATA (Dinamis dari map.js)
// ==========================================
window.updateDashboardCharts = function (properties) {
  if (!properties) return;

  // A. Update Radar Chart (Contoh: Berdasarkan data spasial Machine Learning)
  if (properties.weight_slope) {
    radarChart.data.datasets[0].data = [
      properties.weight_slope,
      properties.weight_rain,
      properties.weight_soil,
      properties.weight_veg,
      properties.weight_human,
    ];
    radarChart.update();
  }

  // B. Update Doughnut Chart (Data penggunaan lahan per poligon)
  if (properties.hutan_pct) {
    landUseChart.data.datasets[0].data = [
      properties.hutan_pct,
      properties.tani_pct,
      properties.mukin_pct,
      properties.semak_pct,
      properties.sawah_pct,
    ];
    landUseChart.update();
  }

  // C. Update Tabel Parameter di dashboard.html
  const tableBody = document.getElementById("hydrology-table-body");
  if (tableBody && properties.runoff_coeff) {
    tableBody.innerHTML = `
      <tr>
        <td>Koefisien Limpasan (C)</td>
        <td>${properties.runoff_coeff}</td>
        <td class="text-accent">${properties.runoff_pred}</td>
        <td><span class="badge ${properties.runoff_status_class}">${properties.runoff_status}</span></td>
      </tr>
      <tr>
        <td>Laju Erosi (ton/ha/thn)</td>
        <td>${properties.erosion_val}</td>
        <td class="text-accent">${properties.erosion_pred}</td>
        <td><span class="badge ${properties.erosion_status_class}">${properties.erosion_status}</span></td>
      </tr>
    `;
  }
};
