/**
 * LONTARA Hydrology Engine v3.5
 * Logic: Indonesian Conservation Method (Sitanala Arsyad)
 * Formula: Q = 0,278 * C * I * A
 * Intensity: Mononobe Equation (Based on R24)
 * Status: Reset Fixed, Contrast Sync Active
 */

const HidrologiEngine = {
  init() {
    console.log("LONTARA: Mesin Hidrologi Arsyad-Mononobe Online.");
    this.bindEvents();
  },

  bindEvents() {
    // Deteksi perubahan pada input dan dropdown (Kalkulasi Real-time)
    document.addEventListener("input", (e) => {
      if (this.isHydroInput(e.target)) this.handleUpdate(e);
    });

    document.addEventListener("change", (e) => {
      if (this.isHydroInput(e.target)) this.handleUpdate(e);
    });

    // Handler Klik untuk Kontrol UI
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      const id = btn ? btn.id : e.target.id;

      // Kontrol Drawer & Baris
      if (e.target.closest(".btn-expand-hydro"))
        this.toggleDrawer(e.target.closest(".btn-expand-hydro"));
      if (id === "btn-add-plot-hydro") this.addPlot();
      if (e.target.closest(".btn-delete-row-hydro"))
        this.deletePlot(e.target.closest(".master-row"));

      // Kontrol Reset & Export
      if (id === "btn-trigger-reset-hydro") this.toggleResetUI(true);
      if (id === "btn-cancel-reset-hydro") this.toggleResetUI(false);
      if (id === "btn-final-reset-hydro") this.executeReset();
      if (id === "btn-export-csv-hidrologi") this.exportDetailedCSV();
    });
  },

  isHydroInput(el) {
    return (
      el.classList.contains("val-r24") ||
      el.classList.contains("val-tc") ||
      el.classList.contains("val-cr") ||
      el.classList.contains("val-ci") ||
      el.classList.contains("val-cv") ||
      el.classList.contains("val-cs") ||
      el.classList.contains("val-area")
    );
  },

  handleUpdate(e) {
    const drawer = e.target.closest(".drawer-row");
    if (!drawer) return;
    const master = drawer.previousElementSibling;
    this.runCalculation(drawer, master);
  },

  /**
   * LOGIKA SAINTIFIK: Mononobe & Metode Rasional
   */
  runCalculation(drawer, master) {
    // 1. Hitung Intensitas (I) - Rumus Mononobe
    const r24 = parseFloat(drawer.querySelector(".val-r24").value) || 0;
    const tc = parseFloat(drawer.querySelector(".val-tc").value) || 0;

    let intensity = 0;
    if (r24 > 0 && tc > 0) {
      // I = (R24/24) * (24/tc)^(2/3)
      intensity = (r24 / 24) * Math.pow(24 / tc, 2 / 3);
    }

    // 2. Hitung Koefisien Aliran (C) - Komponen Arsyad
    const cr = parseFloat(drawer.querySelector(".val-cr").value) || 0;
    const ci = parseFloat(drawer.querySelector(".val-ci").value) || 0;
    const cv = parseFloat(drawer.querySelector(".val-cv").value) || 0;
    const cs = parseFloat(drawer.querySelector(".val-cs").value) || 0;
    const c_total = cr + ci + cv + cs;

    // 3. Luas Area (A)
    const area = parseFloat(drawer.querySelector(".val-area").value) || 0;

    // 4. Hitung Q = 0,278 * C * I * A
    const q_peak = 0.278 * c_total * intensity * area;

    this.updateUI(drawer, master, { intensity, c_total, q_peak });
  },

  updateUI(drawer, master, data) {
    // Helper format desimal Indonesia (koma)
    const fmt = (num, fix) => num.toFixed(fix).replace(".", ",");

    // Update Hasil di Drawer (Area Kontras Tinggi)
    drawer.querySelector(".calc-i").innerText = fmt(data.intensity, 2);
    drawer.querySelector(".calc-c").innerText = fmt(data.c_total, 2);
    drawer.querySelector(".drawer-q-val").innerText = fmt(data.q_peak, 3);

    // Update Ringkasan di Baris Master
    master.querySelector(".summary-c").innerText = fmt(data.c_total, 2);
    master.querySelector(".summary-i").innerText = fmt(data.intensity, 2);
    master.querySelector(".final-result-badge").innerText =
      `${fmt(data.q_peak, 3)} m³/s`;
  },

  toggleDrawer(btn) {
    const drawer = btn.closest("tr").nextElementSibling;
    drawer.classList.toggle("d-none");
    btn.querySelector("i").classList.toggle("fa-chevron-down");
    btn.querySelector("i").classList.toggle("fa-chevron-up");
  },

  addPlot() {
    const tbody = document.getElementById("body-hidrologi-master");
    const mClone = tbody.querySelector(".master-row").cloneNode(true);
    const dClone = tbody.querySelector(".drawer-row").cloneNode(true);

    const count = tbody.querySelectorAll(".master-row").length + 1;
    mClone.querySelector(".land-id").value =
      `SPL-${count.toString().padStart(2, "0")}`;

    // Bersihkan input di kloningan
    mClone
      .querySelectorAll("input:not(.land-id)")
      .forEach((i) => (i.value = ""));
    mClone.querySelector(".final-result-badge").innerText = "0,000 m³/s";
    mClone.querySelector(".summary-c").innerText = "--";
    mClone.querySelector(".summary-i").innerText = "--";

    dClone.classList.add("d-none");
    dClone.querySelectorAll("input").forEach((i) => (i.value = ""));

    tbody.append(mClone, dClone);
  },

  toggleResetUI(show) {
    document
      .getElementById("reset-default-state-hydro")
      .classList.toggle("d-none", show);
    document
      .getElementById("reset-confirm-state-hydro")
      .classList.toggle("d-none", !show);
  },

  executeReset() {
    const tbody = document.getElementById("body-hidrologi-master");
    // Sisakan baris template pertama
    while (tbody.rows.length > 2) tbody.deleteRow(2);

    // Bersihkan data baris utama
    tbody.querySelectorAll("input").forEach((i) => (i.value = ""));
    tbody.querySelector(".final-result-badge").innerText = "0,000 m³/s";
    tbody.querySelector(".summary-c").innerText = "--";
    tbody.querySelector(".summary-i").innerText = "--";

    this.toggleResetUI(false);
    console.log("LONTARA: Data Hidrologi di-reset.");
  },

  exportDetailedCSV() {
    let headers = [
      "ID SPL",
      "X",
      "Y",
      "Keterangan",
      "R24 (mm)",
      "tc (jam)",
      "I (mm/jam)",
      "Cr (Relief)",
      "Ci (Tanah)",
      "Cv (Vegetasi)",
      "Cs (Simpanan)",
      "Total-C",
      "Luas (km2)",
      "Q-Peak (m3/s)",
    ];
    let csvRows = [headers.join(",")];

    document.querySelectorAll(".master-row").forEach((m) => {
      const d = m.nextElementSibling;
      const rowData = [
        `"${m.querySelector(".land-id").value}"`,
        `"${m.querySelector(".coord-x").value}"`,
        `"${m.querySelector(".coord-y").value}"`,
        `"${m.querySelector(".description").value}"`,
        d.querySelector(".val-r24").value || "0",
        d.querySelector(".val-tc").value || "0",
        d.querySelector(".calc-i").innerText.replace(",", "."),
        d.querySelector(".val-cr").value,
        d.querySelector(".val-ci").value,
        d.querySelector(".val-cv").value,
        d.querySelector(".val-cs").value,
        d.querySelector(".calc-c").innerText.replace(",", "."),
        d.querySelector(".val-area").value || "0",
        d.querySelector(".drawer-q-val").innerText.replace(",", "."),
      ];
      csvRows.push(rowData.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `LONTARA_Hidrologi_Arsyad_${new Date().getTime()}.csv`,
    );
    link.click();
  },

  deletePlot(row) {
    if (document.querySelectorAll(".master-row").length > 1) {
      row.nextElementSibling.remove();
      row.remove();
    }
  },
};

export default HidrologiEngine;
