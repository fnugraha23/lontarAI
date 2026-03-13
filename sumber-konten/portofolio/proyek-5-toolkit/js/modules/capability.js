/**
 * LONTARA Capability Engine v3.0
 * Logic: USDA / Arsyad (1989) - Limiting Factor Method
 * Based on: Table 5.10 - 5.19 (User Provided Images)
 */

const CapabilityEngine = {
  // 1. Data Kriteria Berdasarkan Tabel 5.10 - 5.18
  criteria: [
    {
      id: "l",
      name: "Lereng Permukaan",
      simbol: "l",
      type: "numeric",
      unit: "%",
      map: [
        { class: "I", range: [0, 3], label: "l0 (Datar)" },
        { class: "II", range: [3, 8], label: "l1 (Landai)" },
        { class: "III", range: [8, 15], label: "l2 (Agak Miring)" },
        { class: "IV", range: [15, 30], label: "l3 (Miring)" },
        { class: "VI", range: [30, 45], label: "l4 (Agak Curam)" },
        { class: "VII", range: [45, 65], label: "l5 (Curam)" },
        { class: "VIII", range: [65, 1000], label: "l6 (Sangat Curam)" },
      ],
    },
    {
      id: "e",
      name: "Kepekaan Erosi",
      simbol: "e",
      type: "categorical",
      unit: "-",
      options: [
        "Tidak ada (e0)",
        "Ringan (e1)",
        "Sedang (e2)",
        "Berat (e3)",
        "Sangat Berat (e4)",
        "Ekstrim (e5)",
      ],
      map: {
        "Tidak ada (e0)": "I",
        "Ringan (e1)": "II",
        "Sedang (e2)": "III",
        "Berat (e3)": "IV",
        "Sangat Berat (e4)": "VI",
        "Ekstrim (e5)": "VII",
      },
    },
    {
      id: "k",
      name: "Kedalaman Efektif",
      simbol: "k",
      type: "numeric",
      unit: "cm",
      map: [
        { class: "I", range: [90, 1000], label: "k0 (Dalam)" },
        { class: "III", range: [50, 90], label: "k1 (Sedang)" },
        { class: "IV", range: [25, 50], label: "k2 (Dangkal)" },
        { class: "VI", range: [0, 25], label: "k3 (Sangat Dangkal)" },
      ],
    },
    {
      id: "t",
      name: "Tekstur Tanah",
      simbol: "t",
      type: "categorical",
      unit: "-",
      options: [
        "Halus (t1)",
        "Agak Halus (t2)",
        "Sedang (t3)",
        "Agak Kasar (t4)",
        "Kasar (t5)",
      ],
      map: {
        "Agak Halus (t2)": "I",
        "Sedang (t3)": "I",
        "Halus (t1)": "II",
        "Agak Kasar (t4)": "II",
        "Kasar (t5)": "III",
      },
    },
    {
      id: "p",
      name: "Permeabilitas",
      simbol: "p",
      type: "numeric",
      unit: "cm/jam",
      map: [
        { class: "I", range: [2.0, 6.25], label: "p3 (Sedang)" },
        { class: "II", range: [0.5, 2.0], label: "p2 (Agak Lambat)" },
        { class: "II", range: [6.25, 12.5], label: "p4 (Agak Cepat)" },
        { class: "III", range: [0.1, 0.5], label: "p1 (Lambat)" },
        { class: "III", range: [12.5, 1000], label: "p5 (Cepat)" },
      ],
    },
    {
      id: "d",
      name: "Drainase Tanah",
      simbol: "d",
      type: "categorical",
      unit: "-",
      options: [
        "Baik (d0)",
        "Agak Baik (d1)",
        "Agak Buruk (d2)",
        "Buruk (d3)",
        "Sangat Buruk (d4)",
      ],
      map: {
        "Baik (d0)": "I",
        "Agak Baik (d1)": "I",
        "Agak Buruk (d2)": "II",
        "Buruk (d3)": "III",
        "Sangat Buruk (d4)": "IV",
      },
    },
    {
      id: "b",
      name: "Kandungan Batuan",
      simbol: "b",
      type: "categorical",
      unit: "-",
      options: ["Tidak ada (b0)", "Sedikit (b1)", "Sedang (b2)", "Banyak (b3)"],
      map: {
        "Tidak ada (b0)": "I",
        "Sedikit (b1)": "IV",
        "Sedang (b2)": "V",
        "Banyak (b3)": "VIII",
      },
    },
    {
      id: "o",
      name: "Ancaman Banjir",
      simbol: "O",
      type: "categorical",
      unit: "-",
      options: [
        "Tidak Pernah (O0)",
        "Kadang-kadang (O1)",
        "Sedang (O2)",
        "Agak Sering (O3)",
        "Sering (O4)",
      ],
      map: {
        "Tidak Pernah (O0)": "I",
        "Kadang-kadang (O1)": "II",
        "Sedang (O2)": "III",
        "Agak Sering (O3)": "IV",
        "Sering (O4)": "V",
      },
    },
  ],

  init() {
    console.log("LONTARA: Capability Engine Online.");
    setTimeout(() => {
      const container = document.querySelector(".capability-params-container");
      if (container) {
        this.populateParams(container);
        this.bindEvents();
      }
    }, 150);
  },

  populateParams(container) {
    if (!container) return;
    container.innerHTML = this.criteria
      .map(
        (p) => `
            <tr class="param-row-cap" data-id="${p.id}">
                <td style="width: 40px"><input type="checkbox" class="form-check-input check-param-cap"></td>
                <td class="text-start">
                    <div class="fw-bold x-small" style="font-size:0.8rem">${p.name}</div>
                    <div class="text-muted" style="font-size: 0.65rem">Simbol: ${p.simbol}</div>
                </td>
                <td>
                    ${
                      p.type === "numeric"
                        ? `<input type="number" class="form-control form-control-sm val-input-cap text-center" style="width: 80px" placeholder="0.0">`
                        : `<select class="form-select form-select-sm val-input-cap" style="width: 130px">
                             <option value="" selected disabled>-</option>
                             ${p.options.map((o) => `<option value="${o}">${o}</option>`).join("")}
                           </select>`
                    }
                </td>
                <td class="x-small text-muted">${p.unit}</td>
                <td class="text-end"><span class="badge bg-light text-muted status-badge-cap">--</span></td>
            </tr>
        `,
      )
      .join("");
  },

  bindEvents() {
    document.addEventListener("input", (e) => this.handleUpdate(e));
    document.addEventListener("change", (e) => this.handleUpdate(e));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      const id = btn ? btn.id : e.target.id;

      if (e.target.closest(".btn-expand-cap"))
        this.toggleDrawer(e.target.closest(".btn-expand-cap"));
      if (id === "btn-add-plot-cap") this.addPlot();
      if (id === "btn-trigger-reset-cap") this.toggleResetUI(true);
      if (id === "btn-cancel-reset-cap") this.toggleResetUI(false);
      if (id === "btn-final-reset-cap") this.executeReset();
      if (id === "btn-export-csv-capability") this.exportDetailedCSV();
      if (e.target.closest(".btn-delete-row-cap"))
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
    let factors = [];
    const classWeights = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
      VII: 7,
      VIII: 8,
    };

    drawer.querySelectorAll(".param-row-cap").forEach((pRow) => {
      const id = pRow.dataset.id;
      const crit = this.criteria.find((c) => c.id === id);
      const isActive = pRow.querySelector(".check-param-cap").checked;
      const input = pRow.querySelector(".val-input-cap").value;
      const badge = pRow.querySelector(".status-badge-cap");

      if (!isActive || input === "") {
        badge.className = "badge bg-light text-muted status-badge-cap";
        badge.innerText = "--";
        return;
      }

      let assigned = "VIII"; // Default

      if (crit.type === "numeric") {
        const val = parseFloat(input);
        for (const m of crit.map) {
          if (val >= m.range[0] && val < m.range[1]) {
            assigned = m.class;
            break;
          }
        }
      } else {
        assigned = crit.map[input] || "VIII";
      }

      badge.innerText = assigned;
      const colors = {
        I: "bg-success",
        II: "bg-info text-dark",
        III: "bg-warning text-dark",
        IV: "bg-orange text-white",
        V: "bg-primary",
        VI: "bg-secondary",
        VII: "bg-dark",
        VIII: "bg-danger",
      };
      badge.className = `badge ${colors[assigned]} status-badge-cap shadow-sm`;
      factors.push({
        name: crit.name,
        weight: classWeights[assigned],
        class: assigned,
      });
    });

    this.updateUI(drawer, master, factors);
  },

  updateUI(drawer, master, factors) {
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
      return;
    }

    const maxW = Math.max(...factors.map((f) => f.weight));
    const worst = factors.find((f) => f.weight === maxW);
    const limiters = factors
      .filter((f) => f.weight === maxW)
      .map((f) => f.name)
      .join(", ");

    badgeMaster.innerText = worst.class;
    const colorMap = {
      I: "bg-success",
      II: "bg-info text-dark",
      III: "bg-warning text-dark",
      IV: "bg-orange text-white",
      VIII: "bg-danger",
    };
    badgeMaster.className = `badge ${colorMap[worst.class] || "bg-dark"} final-class-badge shadow-sm`;

    drawClass.innerText = worst.class;
    drawLimit.innerText = limiters;

    const labels = {
      I: "Lahan Sangat Sesuai",
      II: "Hambatan Ringan",
      III: "Hambatan Sedang",
      IV: "Hambatan Berat",
      V: "Hambatan Khusus",
      VI: "Hanya Tanaman Tahunan",
      VII: "Hutan Lindung Terbatas",
      VIII: "Kawasan Lindung Mutlak",
    };
    drawLabel.innerText = labels[worst.class];

    const recoMap = {
      1: "Dapat ditanami segala jenis tanaman tanpa tindakan konservasi khusus.",
      3: "Perlu tindakan konservasi sedang seperti teras gulud atau strip cropping.",
      4: "Penggunaan sangat terbatas, disarankan untuk tanaman tahunan atau rumput permanen.",
      6: "Tidak disarankan untuk tanaman semusim. Gunakan untuk hutan produksi atau padang rumput.",
      8: "Biarkan sebagai vegetasi alami untuk perlindungan DAS Tanralili.",
    };
    drawReco.innerText =
      recoMap[maxW] || "Lakukan tindakan konservasi sesuai kelerengan.";
  },

  toggleDrawer(btn) {
    const drawer = btn.closest("tr").nextElementSibling;
    drawer.classList.toggle("d-none");
    btn.querySelector("i").classList.toggle("fa-chevron-down");
    btn.querySelector("i").classList.toggle("fa-chevron-up");
  },

  addPlot() {
    const tbody = document.getElementById("body-capability-master");
    const mClone = tbody.querySelector(".master-row").cloneNode(true);
    const dClone = tbody.querySelector(".drawer-row").cloneNode(true);

    const count = tbody.querySelectorAll(".master-row").length + 1;
    mClone.querySelector(".land-id").value = `SPL-0${count}`;
    mClone
      .querySelectorAll("input:not(.land-id)")
      .forEach((i) => (i.value = ""));
    mClone.querySelector(".final-class-badge").innerText = "--";

    dClone.classList.add("d-none");
    this.populateParams(dClone.querySelector(".capability-params-container"));
    tbody.append(mClone, dClone);
  },

  exportDetailedCSV() {
    let headers = ["ID Lahan", "X", "Y", "Keterangan"];
    this.criteria.forEach((c) => headers.push(`${c.name} (Kelas)`));
    headers.push("Kelas Akhir", "Faktor Penghambat", "Saran Pengelolaan");

    let csvRows = [headers.join(",")];

    document.querySelectorAll(".master-row").forEach((mRow) => {
      const dRow = mRow.nextElementSibling;
      let rowData = [
        `"${mRow.querySelector(".land-id").value}"`,
        `"${mRow.querySelector(".coord-x").value}"`,
        `"${mRow.querySelector(".coord-y").value}"`,
        `"${mRow.querySelector(".description").value}"`,
      ];

      this.criteria.forEach((c) => {
        const pRow = dRow.querySelector(`.param-row-cap[data-id="${c.id}"]`);
        const val = pRow.querySelector(".val-input-cap").value;
        const status = pRow.querySelector(".status-badge-cap").innerText;
        rowData.push(val !== "" ? `"${val} (${status})"` : `"-"`);
      });

      rowData.push(`"${mRow.querySelector(".final-class-badge").innerText}"`);
      rowData.push(`"${dRow.querySelector(".drawer-limiter").innerText}"`);
      rowData.push(
        `"${dRow.querySelector(".drawer-recommendation").innerText}"`,
      );
      csvRows.push(rowData.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `LONTARA_Capability_Report_${new Date().getTime()}.csv`,
    );
    link.click();
  },

  toggleResetUI(show) {
    document
      .getElementById("reset-default-state-cap")
      .classList.toggle("d-none", show);
    document
      .getElementById("reset-confirm-state-cap")
      .classList.toggle("d-none", !show);
  },

  executeReset() {
    const tbody = document.getElementById("body-capability-master");
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

export default CapabilityEngine;
