/**
 * LONTARA v2.5 - Physics Engine (Stabil)
 * Fokus: Analisis Fisika Tanah DAS Tanralili
 * Fitur: Multi-tabel, Kalkulasi Otomatis, & Export CSV
 */

const PhysicsEngine = {
  init() {
    console.log("LONTARA: Physics Engine (DAS Tanralili Mode) Aktif.");
    this.bindEvents();
  },

  bindEvents() {
    // 1. Delegasi Klik: Menangani Tambah, Hapus, Reset, dan Export
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const id = btn.id;

      // Tombol Tambah Baris
      if (id === "btn-add-bd") this.addRow("body-bd");
      if (id === "btn-add-ka") this.addRow("body-ka");
      if (id === "btn-add-tekstur") this.addRow("body-tekstur");

      // Tombol Hapus Baris (Icon Trash)
      if (btn.classList.contains("btn-delete-row")) {
        const tr = btn.closest("tr");
        const tbody = tr.parentElement;
        if (tbody.rows.length > 1) {
          tr.remove();
        } else {
          alert("Minimal harus menyisakan satu sampel data.");
        }
      }

      // Kontrol Reset
      if (id === "btn-trigger-reset-ui") this.toggleResetUI(true);
      if (id === "btn-cancel-reset-ui") this.toggleResetUI(false);
      if (id === "btn-final-reset-execute") this.executeReset();

      // Export
      if (id === "btn-export-physics") this.handleExport();
    });

    // 2. Delegasi Input: Kalkulasi Otomatis saat mengetik
    document.addEventListener("input", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;
      const tbody = row.parentElement;

      if (tbody.id === "body-bd") this.calculateBD(row);
      if (tbody.id === "body-ka") this.calculateKA(row);
      if (tbody.id === "body-tekstur") this.calculateTexture(row);
    });
  },

  /**
   * FUNGSI ADD ROW: Menambah baris sampel baru dengan kloning baris terakhir
   */
  addRow(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    // Ambil baris terakhir sebagai template agar style tetap konsisten
    const lastRow = tbody.rows[tbody.rows.length - 1];
    const newRow = lastRow.cloneNode(true);

    // Bersihkan nilai input di baris baru
    newRow.querySelectorAll("input").forEach((input) => {
      // Jika input punya nilai default (seperti PD 2.65), biarkan. Jika tidak, kosongkan.
      if (!input.hasAttribute("value")) {
        input.value = "";
      } else {
        input.value = input.getAttribute("value");
      }
    });

    // Reset tampilan hasil (div dengan class res-area)
    newRow.querySelectorAll(".res-area").forEach((div) => {
      div.innerText = "--";
    });

    tbody.appendChild(newRow);
    console.log(`LONTARA: Baris baru ditambahkan ke ${tbodyId}`);
  },

  /**
   * LOGIKA: Bulk Density & Porositas
   * Rumus: BD = Massa Kering / Volume Ring
   * Porositas = (1 - BD/PD) * 100
   */
  calculateBD(row) {
    const inputs = row.querySelectorAll("input");
    const mk = parseFloat(inputs[1].value) || 0; // Massa Kering
    const pd = parseFloat(inputs[2].value) || 2.65; // Particle Density (Default)
    const d = parseFloat(inputs[3].value) || 0; // Diameter Ring
    const h = parseFloat(inputs[4].value) || 0; // Tinggi Ring

    const resBD = row.querySelector(".res-bd");
    const resN = row.querySelector(".res-n");

    if (d > 0 && h > 0 && mk > 0) {
      const vol = Math.PI * Math.pow(d / 2, 2) * h;
      const bd = mk / vol;
      resBD.innerText = bd.toFixed(2);
      resN.innerText = ((1 - bd / pd) * 100).toFixed(1);
    } else {
      resBD.innerText = "--";
      resN.innerText = "--";
    }
  },

  /**
   * LOGIKA: Kadar Air (Gravimetrik & Volumetrik)
   */
  calculateKA(row) {
    const inputs = row.querySelectorAll("input");
    const mb = parseFloat(inputs[1].value) || 0; // Massa Basah
    const mk = parseFloat(inputs[2].value) || 0; // Massa Kering
    const bdRef = parseFloat(inputs[3].value) || 1.25; // BD Referensi

    const resW = row.querySelector(".res-ka-berat");
    const resTheta = row.querySelector(".res-ka-vol");

    if (mb > 0 && mk > 0 && mb > mk) {
      const w = ((mb - mk) / mk) * 100;
      resW.innerText = w.toFixed(1);
      resTheta.innerText = (w * bdRef).toFixed(1);
    } else {
      resW.innerText = "--";
      resTheta.innerText = "--";
    }
  },

  /**
   * LOGIKA: Klasifikasi Tekstur USDA
   */
  calculateTexture(row) {
    const inputs = row.querySelectorAll("input");
    const sand = parseFloat(inputs[1].value) || 0;
    const silt = parseFloat(inputs[2].value) || 0;
    const clay = parseFloat(inputs[3].value) || 0;
    const resDisplay = row.querySelector(".res-tekstur");

    if (Math.round(sand + silt + clay) === 100) {
      let cls = "Lempung";
      // Simple Logic for USDA Triangle
      if (clay >= 40) {
        if (sand > 45) cls = "Liat Berpasir";
        else if (silt > 40) cls = "Liat Berdebu";
        else cls = "Liat";
      } else if (clay >= 27) {
        if (sand > 45) cls = "Lempung Liat Berpasir";
        else if (silt > 40) cls = "Lempung Liat Berdebu";
        else cls = "Lempung Berliat";
      } else if (silt >= 80) cls = "Debu";
      else if (sand >= 85) cls = "Pasir";
      else if (silt >= 50 && clay < 27) cls = "Lempung Berdebu";

      resDisplay.innerText = cls;
      resDisplay.className = "res-area res-tekstur fw-bold text-indigo";
    } else {
      resDisplay.innerText = "--";
      resDisplay.className = "res-area res-tekstur text-muted";
    }
  },

  toggleResetUI(show) {
    document
      .getElementById("reset-default-state")
      ?.classList.toggle("d-none", show);
    document
      .getElementById("reset-confirm-state")
      ?.classList.toggle("d-none", !show);
  },

  executeReset() {
    ["body-bd", "body-ka", "body-tekstur"].forEach((id) => {
      const tbody = document.getElementById(id);
      if (!tbody) return;
      while (tbody.rows.length > 1) tbody.deleteRow(1);

      const firstRow = tbody.rows[0];
      firstRow
        .querySelectorAll("input")
        .forEach((i) => (i.value = i.getAttribute("value") || ""));
      firstRow
        .querySelectorAll(".res-area")
        .forEach((d) => (d.innerText = "--"));
    });
    this.toggleResetUI(false);
  },

  handleExport() {
    const csvRows = [
      [
        "ID",
        "BD (g/cm3)",
        "Porositas (%)",
        "KA Berat (%)",
        "KA Volum (%)",
        "Tekstur",
      ],
    ];

    const rowsBD = document.querySelectorAll("#body-bd tr");
    rowsBD.forEach((row, i) => {
      const kaRow = document.querySelectorAll("#body-ka tr")[i];
      const txtRow = document.querySelectorAll("#body-tekstur tr")[i];

      csvRows.push(
        [
          row.querySelectorAll("input")[0]?.value || `S-${i + 1}`,
          row.querySelector(".res-bd")?.innerText || "--",
          row.querySelector(".res-n")?.innerText || "--",
          kaRow?.querySelector(".res-ka-berat")?.innerText || "--",
          kaRow?.querySelector(".res-ka-vol")?.innerText || "--",
          txtRow?.querySelector(".res-tekstur")?.innerText || "--",
        ].join(","),
      );
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `LONTARA_FisikaTanah_${new Date().getTime()}.csv`,
    );
    link.click();
  },
};

export default PhysicsEngine;
