/**
 * LONTARA Carbon Engine v1.1
 * Logic: Mandatory Volumetric SOC Stock (No Checkboxes)
 * Formula: SOC (Mg/ha) = OC (%) * BD (g/cm3) * Depth (cm) * (1 - Gravel)
 */

const CarbonEngine = {
  // 1. Parameter Utama (Semua Wajib Isi)
  params: [
    {
      id: "oc",
      name: "C-Organik",
      simbol: "OC",
      unit: "%",
      tip: "Kadar karbon organik dari lab.",
    },
    {
      id: "bd",
      name: "Bulk Density",
      simbol: "BD",
      unit: "g/cm³",
      tip: "Berat volume tanah kering oven.",
    },
    {
      id: "depth",
      name: "Ketebalan",
      simbol: "T",
      unit: "cm",
      tip: "Ketebalan lapisan sampel.",
    },
    {
      id: "gravel",
      name: "Gravel (Kerikil)",
      simbol: "δ",
      unit: "%",
      tip: "Persentase fragmen batuan > 2mm.",
    },
  ],

  init() {
    console.log("LONTARA: Carbon Engine (Mandatory Mode) Online.");
    setTimeout(() => {
      const container = document.querySelector(".carbon-params-container");
      if (container) {
        this.populateParams(container);
        this.bindEvents();
      }
    }, 150);
  },

  /**
   * Render Baris Input ke dalam Drawer
   */
  populateParams(container) {
    if (!container) return;
    container.innerHTML = this.params
      .map(
        (p) => `
            <tr class="param-row-carbon" data-id="${p.id}">
                <td class="text-start">
                    <div class="fw-bold x-small" style="font-size:0.8rem">${p.name} (${p.simbol})</div>
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm val-input-carbon text-center" 
                           style="width: 110px" placeholder="0.0" step="0.01">
                </td>
                <td class="x-small text-muted">${p.unit}</td>
            </tr>
        `,
      )
      .join("");
  },

  bindEvents() {
    // Delegasi Input (Kalkulasi otomatis saat mengetik)
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("val-input-carbon")) this.handleUpdate(e);
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      const id = btn ? btn.id : e.target.id;

      if (e.target.closest(".btn-expand-carbon"))
        this.toggleDrawer(e.target.closest(".btn-expand-carbon"));
      if (id === "btn-add-plot-carbon") this.addPlot();
      if (id === "btn-trigger-reset-carbon") this.toggleResetUI(true);
      if (id === "btn-cancel-reset-carbon") this.toggleResetUI(false);
      if (id === "btn-final-reset-carbon") this.executeReset();
      if (id === "btn-export-csv-carbon") this.exportDetailedCSV();
      if (e.target.closest(".btn-delete-row-carbon"))
        this.deletePlot(e.target.closest(".master-row"));
    });
  },

  handleUpdate(e) {
    const drawer = e.target.closest(".drawer-row");
    if (!drawer) return;
    const master = drawer.previousElementSibling;
    this.calculateSOC(drawer, master);
  },

  /**
   * Logika Inti: SOC Stock Calculation
   * SOC (Mg/ha) = OC * BD * Depth * (1 - (Gravel/100))
   */
  calculateSOC(drawer, master) {
    const getV = (id) =>
      parseFloat(
        drawer.querySelector(
          `.param-row-carbon[data-id="${id}"] .val-input-carbon`,
        ).value,
      ) || 0;

    const oc = getV("oc");
    const bd = getV("bd");
    const t = getV("depth");
    const delta = getV("gravel") / 100;

    // Formula volumetrik
    const stock = oc * bd * t * (1 - delta);

    this.updateUI(drawer, master, stock);
  },

  updateUI(drawer, master, stock) {
    const res = stock.toFixed(2);
    master.querySelector(".final-result-badge").innerText = `${res} Mg/ha`;
    drawer.querySelector(".drawer-final-value").innerText = res;

    const interp = drawer.querySelector(".drawer-interpretation");
    if (stock === 0) {
      interp.innerText = "Isi data parameter untuk melihat estimasi.";
    } else if (stock < 30) {
      interp.innerText = "Kategori: Rendah. Perlu penambahan input organik.";
    } else if (stock < 100) {
      interp.innerText = "Kategori: Sedang. Pertahankan tutupan lahan.";
    } else {
      interp.innerText = "Kategori: Tinggi. Potensi besar sebagai Carbon Sink.";
    }
  },

  toggleDrawer(btn) {
    const drawer = btn.closest("tr").nextElementSibling;
    drawer.classList.toggle("d-none");
    btn.querySelector("i").classList.toggle("fa-chevron-down");
    btn.querySelector("i").classList.toggle("fa-chevron-up");
  },

  addPlot() {
    const tbody = document.getElementById("body-carbon-master");
    const mClone = tbody.querySelector(".master-row").cloneNode(true);
    const dClone = tbody.querySelector(".drawer-row").cloneNode(true);

    const count = tbody.querySelectorAll(".master-row").length + 1;
    mClone.querySelector(".land-id").value = `C-0${count}`;
    mClone
      .querySelectorAll("input:not(.land-id)")
      .forEach((i) => (i.value = ""));
    mClone.querySelector(".final-result-badge").innerText = "0.00 Mg/ha";

    dClone.classList.add("d-none");
    this.populateParams(dClone.querySelector(".carbon-params-container"));
    tbody.append(mClone, dClone);
  },

  /**
   * Export Detailed CSV (All Params Included)
   */
  exportDetailedCSV() {
    let headers = [
      "ID Sampel",
      "X",
      "Y",
      "Keterangan",
      "C-Org (%)",
      "BD (g/cm3)",
      "Ketebalan (cm)",
      "Gravel (%)",
      "Stok Karbon (Mg/ha)",
    ];
    let csvRows = [headers.join(",")];

    document.querySelectorAll(".master-row").forEach((m) => {
      const d = m.nextElementSibling;
      const getV = (id) =>
        d.querySelector(`.param-row-carbon[data-id="${id}"] .val-input-carbon`)
          .value || "0";

      csvRows.push(
        [
          `"${m.querySelector(".land-id").value}"`,
          `"${m.querySelector(".coord-x").value}"`,
          `"${m.querySelector(".coord-y").value}"`,
          `"${m.querySelector(".description").value}"`,
          getV("oc"),
          getV("bd"),
          getV("depth"),
          getV("gravel"),
          `"${d.querySelector(".drawer-final-value").innerText}"`,
        ].join(","),
      );
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `LONTARA_Carbon_Detailed_Report.csv`);
    link.click();
  },

  toggleResetUI(show) {
    document
      .getElementById("reset-default-state-carbon")
      .classList.toggle("d-none", show);
    document
      .getElementById("reset-confirm-state-carbon")
      .classList.toggle("d-none", !show);
  },

  executeReset() {
    const tbody = document.getElementById("body-carbon-master");
    while (tbody.rows.length > 2) tbody.deleteRow(2);
    this.init();
    this.toggleResetUI(false);
  },

  deletePlot(row) {
    if (document.querySelectorAll(".master-row").length > 1) {
      row.nextElementSibling.remove();
      row.remove();
    }
  },
};

export default CarbonEngine;
