/**
 * LONTARA Erosion Engine v2.8
 * Focus: DAS Tanralili Scientific Calculation
 * UI: Synced with Physics Module (No-Popup Notification)
 */

const ErosionEngine = {
  init() {
    console.log("LONTARA: Erosion Engine Aktif & Sinkron dengan UI.");
    this.bindEvents();
  },

  bindEvents() {
    // 1. Kalkulasi Real-time (Input Angka & Dropdown)
    document.addEventListener("input", (e) => this.handleUpdate(e));
    document.addEventListener("change", (e) => this.handleUpdate(e));

    // 2. Delegasi Klik Tombol
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const id = btn.id;

      // --- Logika Konfirmasi Reset (In-UI) ---
      if (id === "btn-trigger-reset-ui") {
        e.preventDefault();
        this.toggleResetUI(true);
      }
      if (id === "btn-cancel-reset-ui") {
        e.preventDefault();
        this.toggleResetUI(false);
      }
      if (id === "btn-final-reset-execute") {
        e.preventDefault();
        this.executeReset();
        this.toggleResetUI(false);
      }

      // --- Logika Baris & Drawer ---
      if (id === "btn-add-row-erosion") {
        e.preventDefault();
        this.addErosionRow();
      }
      if (btn.classList.contains("btn-delete-row")) {
        e.preventDefault();
        this.deleteErosionRow(btn);
      }
      if (btn.classList.contains("btn-expand")) {
        e.preventDefault();
        this.toggleDrawer(btn);
      }
    });
  },

  /**
   * Manajemen Notifikasi (Menukar tombol Reset dengan panel konfirmasi)
   */
  toggleResetUI(isConfirming) {
    const defaultState = document.getElementById("reset-default-state");
    const confirmState = document.getElementById("reset-confirm-state");

    if (isConfirming) {
      defaultState.classList.add("d-none");
      confirmState.classList.remove("d-none");
    } else {
      defaultState.classList.remove("d-none");
      confirmState.classList.add("d-none");
    }
  },

  handleUpdate(e) {
    const row = e.target.closest("tr");
    if (!row) return;

    const masterRow = row.classList.contains("master-row")
      ? row
      : row.previousElementSibling;
    const drawerRow = row.classList.contains("drawer-row")
      ? row
      : row.nextElementSibling;

    if (masterRow && drawerRow) {
      // Logika Checkbox R Eksklusif
      if (e.target.classList.contains("check-r")) {
        drawerRow.querySelectorAll(".check-r").forEach((cb) => {
          if (cb !== e.target) cb.checked = false;
        });
      }
      this.calculateAll(masterRow, drawerRow);
    }
  },

  calculateAll(master, drawer) {
    // --- A. FAKTOR R (EROSIVITAS) ---
    const isBols = drawer.querySelector("#checkBols").checked;
    const chBols = parseFloat(drawer.querySelector(".raw-r-bols").value) || 0;
    const pLen = parseFloat(drawer.querySelector(".raw-r-lenvain").value) || 0;
    let R = 0;

    if (isBols && chBols > 0) {
      R = (2.5 * Math.pow(chBols, 2)) / (100 * (0.073 * chBols + 0.73));
    } else if (!isBols && pLen > 0) {
      R = 2.21 * Math.pow(pLen / 10, 1.36); // P dalam cm
    }
    master.querySelector(".factor-r").innerText = R.toFixed(2);

    // --- B. FAKTOR K (ERODIBILITAS) ---
    const mRaw = parseFloat(drawer.querySelector(".raw-k-mvfs").value) || 0;
    const clay = parseFloat(drawer.querySelector(".raw-k-clay").value) || 0;
    const bo = parseFloat(drawer.querySelector(".raw-k-bo").value) || 0;
    const b = parseInt(drawer.querySelector(".raw-k-struk").value) || 1;
    const c = parseInt(drawer.querySelector(".raw-k-perm").value) || 1;
    let K = 0;

    if (mRaw > 0) {
      const M = mRaw * (100 - clay);
      const part1 = 2.1 * Math.pow(M, 1.14) * Math.pow(10, -4) * (12 - bo);
      const part2 = 3.25 * (b - 2);
      const part3 = 2.5 * (c - 3);
      K = (part1 + part2 + part3) / 100;
    }
    master.querySelector(".factor-k").innerText = Math.max(K, 0.001).toFixed(3);

    // --- C. FAKTOR LS (LERENG) ---
    const L = parseFloat(drawer.querySelector(".raw-ls-l").value) || 0;
    const S = parseFloat(drawer.querySelector(".raw-ls-s").value) || 0;
    let LS = 0;
    if (L > 0 && S > 0) {
      LS = Math.sqrt(L) * (0.00138 * Math.pow(S, 2) + 0.00965 * S + 0.0138);
    }
    master.querySelector(".factor-ls").innerText = LS.toFixed(2);

    // --- FINAL A (EROSI) ---
    const C = parseFloat(master.querySelector(".factor-c").value) || 0;
    const P = parseFloat(master.querySelector(".factor-p").value) || 0;
    const finalA = R * K * LS * C * P;

    const displayA = master.querySelector(".result-a");
    const displayTBE = master.querySelector(".tbe-class");

    if (finalA > 0) {
      displayA.innerText = finalA.toFixed(2);
      this.classifyTBE(displayTBE, finalA);
    } else {
      displayA.innerText = "--";
      displayTBE.innerText = "--";
    }
  },

  classifyTBE(el, val) {
    let label = "";
    if (val < 15) label = "I (SR)";
    else if (val < 60) label = "II (R)";
    else if (val < 180) label = "III (S)";
    else if (val < 480) label = "IV (B)";
    else label = "V (SB)";
    el.innerText = label;
  },

  executeReset() {
    const tbody = document.getElementById("body-erosion");
    // Hapus semua kecuali baris pertama
    while (tbody.rows.length > 2) {
      tbody.deleteRow(2);
    }
    // Reset baris pertama
    const m = tbody.querySelector(".master-row");
    const d = tbody.querySelector(".drawer-row");
    m.querySelector("input").value = "SPL-01";
    m.querySelectorAll(
      ".factor-r, .factor-k, .factor-ls, .result-a, .tbe-class",
    ).forEach(
      (el) =>
        (el.innerText = el.classList.contains("factor-k") ? "0.000" : "0.00"),
    );
    m.querySelector(".factor-c").selectedIndex = 0;
    m.querySelector(".factor-p").selectedIndex = 0;
    d.querySelectorAll("input").forEach((i) => (i.value = ""));
    d.querySelector("#checkBols").checked = true;
    d.querySelector("#checkLenvain").checked = false;
  },

  addErosionRow() {
    const tbody = document.getElementById("body-erosion");
    const mClone = tbody.querySelector(".master-row").cloneNode(true);
    const dClone = tbody.querySelector(".drawer-row").cloneNode(true);

    const count = tbody.querySelectorAll(".master-row").length + 1;
    mClone.querySelector("input").value = `SPL-0${count}`;
    mClone
      .querySelectorAll(
        ".factor-r, .factor-k, .factor-ls, .result-a, .tbe-class",
      )
      .forEach(
        (el) =>
          (el.innerText = el.classList.contains("factor-k") ? "0.000" : "0.00"),
      );

    dClone.querySelectorAll("input").forEach((i) => (i.value = ""));
    dClone.classList.add("d-none");

    tbody.appendChild(mClone);
    tbody.appendChild(dClone);
  },

  deleteErosionRow(btn) {
    const mRow = btn.closest("tr");
    const dRow = mRow.nextElementSibling;
    if (document.querySelectorAll(".master-row").length > 1) {
      mRow.remove();
      dRow.remove();
    }
  },

  toggleDrawer(btn) {
    const drawer = btn.closest("tr").nextElementSibling;
    const icon = btn.querySelector("i");
    drawer.classList.toggle("d-none");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  },
};

export default ErosionEngine;
