/**
 * LONTARA Suitability Engine v3.2
 * Fix: Full Detailed CSV Export (Including all parameters)
 */

const SuitabilityEngine = {
  crops: {
    padi_sawah: {
      label: "Padi Sawah",
      params: [
        {
          id: "tc",
          name: "Temperatur Rata-rata",
          simbol: "tc",
          unit: "°C",
          type: "numeric",
          S1: [[24, 29]],
          S2: [
            [22, 24],
            [29, 32],
          ],
          S3: [
            [18, 22],
            [32, 35],
          ],
          N: [
            [0, 18],
            [35, 100],
          ],
          tip: "t",
        },
        {
          id: "w_dry",
          name: "Bulan Kering (<75 mm)",
          simbol: "w",
          unit: "bulan",
          type: "numeric",
          S1: [[0, 3]],
          S2: [[3, 9]],
          S3: [[9, 9.5]],
          N: [[9.5, 12]],
          tip: "w",
        },
        {
          id: "w_rain",
          name: "Curah Hujan Tahunan",
          simbol: "w",
          unit: "mm",
          type: "numeric",
          S1: [[1500, 10000]],
          S2: [[1200, 1500]],
          S3: [[800, 1200]],
          N: [[0, 800]],
          tip: "w",
        },
        {
          id: "w_lgp",
          name: "LGP (Hari)",
          simbol: "w",
          unit: "hari",
          type: "numeric",
          S1: [[90, 240]],
          S2: [[75, 90]],
          S3: [[75, 90]],
          N: [[0, 75]],
          tip: "w",
        },
        {
          id: "r_drain",
          name: "Drainase Tanah",
          simbol: "r",
          unit: "-",
          type: "categorical",
          options: ["Terhambat", "Sedang", "Baik", "Cepat", "Sangat Cepat"],
          S1: ["Terhambat"],
          S2: ["Terhambat"],
          S3: ["Sedang", "Baik"],
          N: ["Cepat", "Sangat Cepat"],
          tip: "r",
        },
        {
          id: "r_tex",
          name: "Tekstur Tanah",
          simbol: "r",
          unit: "-",
          type: "categorical",
          options: [
            "SCL",
            "SiL",
            "Si",
            "CL",
            "SL",
            "L",
            "SiCL",
            "C",
            "SiC",
            "LS",
            "Str C",
            "Pasir",
            "Kerikil",
          ],
          S1: ["SCL", "SiL", "Si", "CL"],
          S2: ["SL", "L", "SiCL", "C", "SiC"],
          S3: ["LS", "Str C"],
          N: ["Pasir", "Kerikil"],
          tip: "r",
        },
        {
          id: "r_depth",
          name: "Kedalaman Efektif",
          simbol: "rc",
          unit: "cm",
          type: "numeric",
          S1: [[50, 300]],
          S2: [[40, 50]],
          S3: [[25, 40]],
          N: [[0, 25]],
          tip: "r",
        },
        {
          id: "f_ph",
          name: "pH Tanah (H2O)",
          simbol: "f",
          unit: "-",
          type: "numeric",
          S1: [[5.5, 7.0]],
          S2: [
            [4.5, 5.5],
            [7.0, 8.0],
          ],
          S3: [
            [4.0, 4.5],
            [8.0, 8.5],
          ],
          N: [
            [0, 4.0],
            [8.5, 14],
          ],
          tip: "f",
        },
        {
          id: "f_ktk",
          name: "KTK Tanah",
          simbol: "f",
          unit: "cmol",
          type: "categorical",
          options: ["Tinggi", "Sedang", "Rendah", "Sangat Rendah"],
          S1: ["Sedang", "Tinggi"],
          S2: ["Rendah"],
          S3: ["Sangat Rendah"],
          N: ["-"],
          tip: "f",
        },
        {
          id: "x_sal",
          name: "Salinitas",
          simbol: "x",
          unit: "mmhos/cm",
          type: "numeric",
          S1: [[0, 3.5]],
          S2: [[3.5, 5.0]],
          S3: [[5.0, 6.6]],
          N: [[6.6, 100]],
          tip: "x",
        },
        {
          id: "n_total",
          name: "Total N",
          simbol: "n",
          unit: "%",
          type: "categorical",
          options: ["Tinggi", "Sedang", "Rendah", "Sangat Rendah"],
          S1: ["Sedang", "Tinggi"],
          S2: ["Rendah"],
          S3: ["Sangat Rendah"],
          N: ["-"],
          tip: "n",
        },
        {
          id: "e_slope",
          name: "Lereng (%)",
          simbol: "e",
          unit: "%",
          type: "numeric",
          S1: [[0, 3]],
          S2: [[3, 8]],
          S3: [[8, 15]],
          N: [[15, 100]],
          tip: "e",
        },
        {
          id: "b_flood",
          name: "Bahaya Banjir",
          simbol: "b",
          unit: "-",
          type: "categorical",
          options: ["F0", "F1", "F2", "F3", "F4"],
          S1: ["F0", "F1"],
          S2: ["F2"],
          S3: ["F3"],
          N: ["F4"],
          tip: "b",
        },
      ],
    },
  },

  init() {
    console.log("LONTARA: Suitability Engine Active.");
    setTimeout(() => {
      const container = document.querySelector(".suitability-params-container");
      if (container) {
        this.populateParams(container);
        this.bindEvents();
      }
    }, 100);
  },

  populateParams(container) {
    const crop = this.crops["padi_sawah"];
    container.innerHTML = crop.params
      .map(
        (p) => `
            <tr class="param-row" data-id="${p.id}">
                <td style="width: 40px"><input type="checkbox" class="form-check-input check-param"></td>
                <td class="text-start">
                    <div class="fw-bold x-small" style="font-size:0.8rem">${p.name}</div>
                    <div class="text-muted" style="font-size: 0.65rem">(${p.simbol})</div>
                </td>
                <td>
                    ${
                      p.type === "numeric"
                        ? `<input type="number" class="form-control form-control-sm val-input text-center" style="width: 80px" placeholder="0.0">`
                        : `<select class="form-select form-select-sm val-input" style="width: 120px">
                             <option value="" selected disabled>-</option>
                             ${p.options.map((o) => `<option value="${o}">${o}</option>`).join("")}
                           </select>`
                    }
                </td>
                <td class="x-small text-muted">${p.unit}</td>
                <td class="text-end"><span class="badge bg-light text-muted status-badge-sm">--</span></td>
            </tr>
        `,
      )
      .join("");
  },

  bindEvents() {
    // Event delegation agar lebih responsif
    document.addEventListener("input", (e) => this.handleUpdate(e));
    document.addEventListener("change", (e) => this.handleUpdate(e));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn && !e.target.id) return;
      const id = btn ? btn.id : e.target.id;

      if (e.target.closest(".btn-expand-suit"))
        this.toggleDrawer(e.target.closest(".btn-expand-suit"));
      if (id === "btn-add-plot") this.addPlot();
      if (id === "btn-trigger-reset-ui") this.toggleResetUI(true);
      if (id === "btn-cancel-reset-ui") this.toggleResetUI(false);
      if (id === "btn-final-reset-execute") this.executeReset();
      if (id === "btn-export-csv-suitability") this.exportDetailedCSV(); // FIX: Fitur Baru
      if (e.target.closest(".btn-delete-row"))
        this.deletePlot(e.target.closest(".master-row"));
    });
  },

  handleUpdate(e) {
    const row = e.target.closest("tr");
    if (!row) return;
    const drawer = row.closest(".drawer-row") || row.nextElementSibling;
    const master = row.classList.contains("master-row")
      ? row
      : drawer
        ? drawer.previousElementSibling
        : null;
    if (drawer && master) this.runMatching(drawer, master);
  },

  runMatching(drawer, master) {
    const crop = this.crops["padi_sawah"];
    let factors = [];
    const weightMap = { S1: 1, S2: 2, S3: 3, N: 4 };

    drawer.querySelectorAll(".param-row").forEach((pRow) => {
      const id = pRow.dataset.id;
      const param = crop.params.find((p) => p.id === id);
      const isActive = pRow.querySelector(".check-param").checked;
      const input = pRow.querySelector(".val-input").value;
      const badge = pRow.querySelector(".status-badge-sm");

      if (!isActive || input === "") {
        badge.className = "badge bg-light text-muted status-badge-sm";
        badge.innerText = "--";
        return;
      }

      let res = "N";
      if (param.type === "numeric") {
        const n = parseFloat(input);
        if (this.inRange(n, param.S1)) res = "S1";
        else if (this.inRange(n, param.S2)) res = "S2";
        else if (this.inRange(n, param.S3)) res = "S3";
      } else {
        if (param.S1.includes(input)) res = "S1";
        else if (param.S2.includes(input)) res = "S2";
        else if (param.S3.includes(input)) res = "S3";
      }

      badge.innerText = res;
      const colors = {
        S1: "bg-success",
        S2: "bg-info text-dark",
        S3: "bg-warning text-dark",
        N: "bg-danger",
      };
      badge.className = `badge ${colors[res]} status-badge-sm shadow-sm`;
      factors.push({
        name: param.name,
        weight: weightMap[res],
        class: res,
        tip: param.tip,
      });
    });

    this.updatePlotUI(drawer, master, factors);
  },

  inRange(val, ranges) {
    return ranges.some((r) => val >= r[0] && val <= r[1]);
  },

  updatePlotUI(drawer, master, factors) {
    const badgeMaster = master.querySelector(".final-class-badge");
    const drawClass = drawer.querySelector(".drawer-final-class");
    const drawLabel = drawer.querySelector(".drawer-final-label");
    const drawLimit = drawer.querySelector(".drawer-limiter");
    const drawReco = drawer.querySelector(".drawer-recommendation");

    if (factors.length === 0) {
      badgeMaster.innerText = "--";
      badgeMaster.className =
        "badge bg-amber-light text-amber final-class-badge";
      drawClass.innerText = "--";
      drawLabel.innerText = "Centang Parameter";
      return;
    }

    const maxW = Math.max(...factors.map((f) => f.weight));
    const worst = factors.find((f) => f.weight === maxW);
    const limiters = factors
      .filter((f) => f.weight === maxW)
      .map((f) => f.name)
      .join(", ");

    badgeMaster.innerText = worst.class;
    const labels = {
      S1: "Sangat Sesuai",
      S2: "Cukup Sesuai",
      S3: "Sesuai Marginal",
      N: "Tidak Sesuai",
    };
    drawLabel.innerText = labels[worst.class];
    drawLimit.innerText = limiters;
    drawClass.innerText = worst.class;

    const recoMap = {
      t: "Temperatur suboptimal. Sesuaikan varietas.",
      w: "Kendala air. Bangun irigasi teknis.",
      r: "Media perakaran terhambat. Olah tanah dalam.",
      f: "Retensi hara rendah. Lakukan pengapuran.",
      x: "Salinitas tinggi. Lakukan pencucian lahan.",
      n: "Hara N rendah. Tambah Urea/ZA.",
      e: "Bahaya erosi tinggi. Buat terasering.",
      b: "Risiko banjir. Buat drainase makro.",
    };
    drawReco.innerText = recoMap[worst.tip] || "Lakukan observasi lapangan.";
  },

  toggleDrawer(btn) {
    const drawer = btn.closest("tr").nextElementSibling;
    drawer.classList.toggle("d-none");
    btn.querySelector("i").classList.toggle("fa-chevron-down");
    btn.querySelector("i").classList.toggle("fa-chevron-up");
  },

  addPlot() {
    const tbody = document.getElementById("body-suitability-master");
    const mClone = tbody.querySelector(".master-row").cloneNode(true);
    const dClone = tbody.querySelector(".drawer-row").cloneNode(true);

    const count = tbody.querySelectorAll(".master-row").length + 1;
    mClone.querySelector(".land-id").value = `ID-0${count}`;
    mClone
      .querySelectorAll("input:not(.land-id)")
      .forEach((i) => (i.value = ""));
    mClone.querySelector(".final-class-badge").innerText = "--";

    dClone.classList.add("d-none");
    this.populateParams(dClone.querySelector(".suitability-params-container"));
    tbody.append(mClone, dClone);
  },

  /**
   * FITUR BARU: Export CSV Detail (ID, X, Y, All Params, Final Class, Recommendation)
   */
  exportDetailedCSV() {
    const crop = this.crops["padi_sawah"];

    // 1. Buat Header (ID, Koordinat, Parameter, Hasil)
    let headers = ["ID Lahan", "Koordinat X", "Koordinat Y", "Keterangan"];
    crop.params.forEach((p) => headers.push(`${p.name} (${p.unit})`));
    headers.push("Kelas Akhir", "Faktor Pembatas", "Saran Perbaikan");

    let csvRows = [headers.join(",")];

    // 2. Ambil Data per Baris Lahan
    document.querySelectorAll(".master-row").forEach((mRow) => {
      const dRow = mRow.nextElementSibling;
      let rowData = [
        `"${mRow.querySelector(".land-id").value}"`,
        `"${mRow.querySelector(".coord-x").value}"`,
        `"${mRow.querySelector(".coord-y").value}"`,
        `"${mRow.querySelector(".description").value}"`,
      ];

      // Ambil detail tiap parameter di dalam drawer
      crop.params.forEach((p) => {
        const pRow = dRow.querySelector(`.param-row[data-id="${p.id}"]`);
        const val = pRow.querySelector(".val-input").value;
        const status = pRow.querySelector(".status-badge-sm").innerText;

        if (val !== "" && status !== "--") {
          rowData.push(`"${val} (${status})"`);
        } else {
          rowData.push(`"-"`);
        }
      });

      // Tambahkan Hasil Akhir
      rowData.push(`"${mRow.querySelector(".final-class-badge").innerText}"`);
      rowData.push(`"${dRow.querySelector(".drawer-limiter").innerText}"`);
      rowData.push(
        `"${dRow.querySelector(".drawer-recommendation").innerText}"`,
      );

      csvRows.push(rowData.join(","));
    });

    // 3. Trigger Download
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `LONTARA_Kesesuaian_Lahan_${new Date().getTime()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  toggleResetUI(show) {
    document
      .getElementById("reset-default-state")
      .classList.toggle("d-none", show);
    document
      .getElementById("reset-confirm-state")
      .classList.toggle("d-none", !show);
  },

  executeReset() {
    const tbody = document.getElementById("body-suitability-master");
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

export default SuitabilityEngine;
