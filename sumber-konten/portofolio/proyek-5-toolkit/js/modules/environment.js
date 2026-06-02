/**
 * LONTARA v2.0 - Environment & Hydrology Engine
 * Logic: SOC Stock, CO2 Equivalent, Horton Infiltration, & Water Balance
 */

import { LontaraState } from "../main.js";

const EnvironmentEngine = {
  init() {
    console.log("Environment Engine: Active");
    this.bindEvents();
  },

  bindEvents() {
    // 1. Listeners untuk Modul Karbon
    const carbonTable = document.getElementById("carbon-table-body");
    if (carbonTable) {
      carbonTable.addEventListener("input", (e) => {
        if (e.target.closest("input"))
          this.calculateSOC(e.target.closest("tr"));
      });
    }

    // 2. Listeners untuk Modul Hidrologi
    const hydroCalcBtn = document.querySelector(".btn-info.text-white");
    if (hydroCalcBtn) {
      hydroCalcBtn.addEventListener("click", () => {
        this.calculateHorton();
        this.calculateWaterBalance();
      });
    }
  },

  /**
   * KALKULASI STOK KARBON (SOC)
   * Formula: SOC = C-Org (%) * BD (g/cm3) * Depth (cm)
   */
  calculateSOC(row) {
    const inputs = row.querySelectorAll("input");
    const depth = parseFloat(inputs[1].value) || 0;
    const bd = parseFloat(inputs[2].value) || 0;
    const cOrg = parseFloat(inputs[3].value) || 0;
    const resultField = inputs[4];

    if (depth > 0 && bd > 0 && cOrg > 0) {
      // Kalkulasi per lapisan (ton/ha)
      const socLayer = (cOrg / 100) * bd * depth * 100;
      resultField.value = socLayer.toFixed(2);

      this.updateCarbonSummary();
    }
  },

  updateCarbonSummary() {
    let totalSOC = 0;
    document.querySelectorAll("#carbon-table-body tr").forEach((row) => {
      totalSOC += parseFloat(row.querySelectorAll("input")[4].value) || 0;
    });

    const displaySOC = document.getElementById("total-soc-ha");
    const displayCO2 = document.getElementById("total-co2");

    if (displaySOC) displaySOC.innerText = totalSOC.toFixed(1);

    // Konversi ke CO2e (Rasio 44/12 ≈ 3.67)
    if (displayCO2) {
      const co2e = totalSOC * 3.667;
      displayCO2.innerText = co2e.toFixed(1);
    }

    LontaraState.soilData.environment.carbonStock = totalSOC;
  },

  /**
   * MODEL INFILTRASI HORTON
   * Formula: f = fc + (f0 - fc) * e^(-kt)
   */
  calculateHorton() {
    const f0 =
      parseFloat(document.querySelectorAll(".card-main input")[0].value) || 0;
    const fc =
      parseFloat(document.querySelectorAll(".card-main input")[1].value) || 0;
    const k =
      parseFloat(document.querySelectorAll(".card-main input")[2].value) || 0;
    const t =
      parseFloat(document.querySelectorAll(".card-main input")[3].value) || 0;

    if (f0 > 0 && k > 0) {
      // t dalam menit dikonversi ke jam jika k dalam satuan per jam
      const tHour = t / 60;
      const infiltration = fc + (f0 - fc) * Math.exp(-k * tHour);

      console.log(
        `Laju Infiltrasi Horton pada t=${t}:`,
        infiltration.toFixed(2),
      );
      // Output bisa diarahkan ke grafik chart.js nantinya
    }
  },

  /**
   * NERACA AIR (WATER BALANCE)
   * Formula: dS = P - ET - Q
   */
  calculateWaterBalance() {
    const inputs = document.querySelectorAll(".col-lg-7 input");
    const P = parseFloat(inputs[0].value) || 0;
    const ET = parseFloat(inputs[1].value) || 0;
    const Q = parseFloat(inputs[2].value) || 0;

    const deltaS = P - ET - Q;

    const resultDisplay = document.getElementById("water-storage-result");
    if (resultDisplay) {
      resultDisplay.innerText = deltaS.toFixed(1) + " mm";
      resultDisplay.className =
        deltaS < 0
          ? "fw-extrabold text-danger mb-0"
          : "fw-extrabold text-info mb-0";
    }
  },
};

export default EnvironmentEngine;
