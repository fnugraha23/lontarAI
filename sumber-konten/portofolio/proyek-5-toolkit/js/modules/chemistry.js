/**
 * LONTARA v2.5 - Chemistry Engine
 * Logic: Soil Nutrient Analysis & Fertilizer Recommendation
 * Focus: DAS Tanralili Integrated Chemistry Management
 */

const ChemistryEngine = {
  init() {
    console.log("LONTARA: Chemistry Engine Aktif.");
    this.bindEvents();
  },

  bindEvents() {
    // 1. Delegasi Klik (Tambah, Hapus, Reset, Export)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = btn.id;

      // Tambah Baris Spesifik
      if (id === "btn-add-ph") this.addRow("body-ph");
      if (id === "btn-add-cn") this.addRow("body-cn");
      if (id === "btn-add-ktk") this.addRow("body-ktk");
      if (id === "btn-add-pupuk") this.addRow("body-pupuk");

      // Hapus Baris
      if (btn.classList.contains("btn-delete-row")) {
        const tr = btn.closest("tr");
        if (tr.parentElement.rows.length > 1) tr.remove();
        else alert("Minimal harus ada satu baris data.");
      }

      // Reset & Export
      if (id === "btn-trigger-reset-ui") this.toggleResetUI(true);
      if (id === "btn-cancel-reset-ui") this.toggleResetUI(false);
      if (id === "btn-final-reset-execute") this.executeReset();
      if (id === "btn-export-chemistry") this.handleExport();
    });

    // 2. Delegasi Input (Kalkulasi Otomatis)
    document.addEventListener("input", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;
      const tbody = row.parentElement;

      if (tbody.id === "body-ph") this.calculatePH(row);
      if (tbody.id === "body-cn") this.calculateCN(row);
      if (tbody.id === "body-ktk") this.calculateKTK(row);
      if (tbody.id === "body-pupuk") this.calculatePupuk(row);
    });
  },

  addRow(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const newRow = tbody.rows[0].cloneNode(true);
    newRow.querySelectorAll("input").forEach((i) => (i.value = ""));
    newRow.querySelectorAll(".res-area").forEach((d) => (d.innerText = "--"));
    tbody.appendChild(newRow);
  },

  /**
   * LOGIKA: Reaksi Tanah (pH)
   * Delta pH = pH KCl - pH H2O
   */
  calculatePH(row) {
    const h2o = parseFloat(row.querySelectorAll("input")[1].value) || 0;
    const kcl = parseFloat(row.querySelectorAll("input")[2].value) || 0;
    const resDelta = row.querySelector(".res-delta-ph");
    const resCrit = row.querySelector(".res-ph-kriteria");

    if (h2o > 0) {
      if (kcl > 0) resDelta.innerText = (kcl - h2o).toFixed(2);

      let crit = "Netral";
      if (h2o < 4.5) crit = "Sangat Masam";
      else if (h2o <= 5.5) crit = "Masam";
      else if (h2o <= 6.5) crit = "Agak Masam";
      else if (h2o <= 7.5) crit = "Netral";
      else if (h2o <= 8.5) crit = "Agak Alkalis";
      else crit = "Alkalis";

      resCrit.innerText = crit;
    }
  },

  /**
   * LOGIKA: Karbon & Nitrogen
   * BO = %C * 1.724 (Van Bemmelen Factor)
   */
  calculateCN(row) {
    const c = parseFloat(row.querySelectorAll("input")[1].value) || 0;
    const n = parseFloat(row.querySelectorAll("input")[2].value) || 0;
    const resBO = row.querySelector(".res-bo");
    const resRatio = row.querySelector(".res-cn-ratio");

    if (c > 0) {
      resBO.innerText = (c * 1.724).toFixed(2);
      if (n > 0) resRatio.innerText = (c / n).toFixed(1);
    }
  },

  /**
   * LOGIKA: KTK & Kejenuhan Basa (KB)
   * KB = (Sum Bases / KTK) * 100
   */
  calculateKTK(row) {
    const inputs = row.querySelectorAll("input");
    const ca = parseFloat(inputs[1].value) || 0;
    const mg = parseFloat(inputs[2].value) || 0;
    const k = parseFloat(inputs[3].value) || 0;
    const na = parseFloat(inputs[4].value) || 0;
    const ktk = parseFloat(inputs[5].value) || 0;
    const resKB = row.querySelector(".res-kb");

    if (ktk > 0) {
      const sumBases = ca + mg + k + na;
      resKB.innerText = ((sumBases / ktk) * 100).toFixed(1);
    }
  },

  /**
   * LOGIKA: Dosis Pupuk
   * Kebutuhan = (Target / Kandungan * 100) * Luas
   */
  calculatePupuk(row) {
    const target = parseFloat(row.querySelectorAll("input")[0].value) || 0;
    const content = parseFloat(row.querySelectorAll("input")[1].value) || 0;
    const area = parseFloat(row.querySelectorAll("input")[2].value) || 0;
    const res = row.querySelector(".res-dosis-hasil");

    if (target > 0 && content > 0 && area > 0) {
      const total = (target / content) * 100 * area;
      res.innerText = total.toFixed(1);
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
    ["body-ph", "body-cn", "body-ktk", "body-pupuk"].forEach((id) => {
      const tbody = document.getElementById(id);
      if (!tbody) return;
      while (tbody.rows.length > 1) tbody.deleteRow(1);
      const r = tbody.rows[0];
      r.querySelectorAll("input").forEach((i) => (i.value = ""));
      r.querySelectorAll(".res-area").forEach((d) => (d.innerText = "--"));
    });
    this.toggleResetUI(false);
  },

  handleExport() {
    // Logika Export CSV sederhana menggabungkan ID sampel dan ringkasan kimia
    const csv = [["ID", "pH H2O", "Kriteria", "BO (%)", "C/N Ratio", "KB (%)"]];
    const rows = document.querySelectorAll("#body-ph tr");
    rows.forEach((r, i) => {
      const cnR = document.querySelectorAll("#body-cn tr")[i];
      const ktkR = document.querySelectorAll("#body-ktk tr")[i];
      csv.push(
        [
          r.querySelectorAll("input")[0].value || `S-${i + 1}`,
          r.querySelectorAll("input")[1].value || "--",
          r.querySelector(".res-ph-kriteria")?.innerText || "--",
          cnR?.querySelector(".res-bo")?.innerText || "--",
          cnR?.querySelector(".res-cn-ratio")?.innerText || "--",
          ktkR?.querySelector(".res-kb")?.innerText || "--",
        ].join(","),
      );
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LONTARA_KimiaTanah_${new Date().getTime()}.csv`;
    a.click();
  },
};

export default ChemistryEngine;
