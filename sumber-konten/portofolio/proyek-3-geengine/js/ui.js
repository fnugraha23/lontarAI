/**
 * ui.js
 * Modul Utilitas Antarmuka Pengguna (UI) LontaraGeo
 * Menangani notifikasi, modal, loader, dan sinkronisasi tema.
 */

const UI = {
  // --- 1. Konfigurasi & Elemen Utama ---
  elements: {
    body: document.body,
    toast: document.getElementById("toastBox"),
    toastMsg: document.getElementById("toastMsg"),
    btnProcess: document.getElementById("btnProcess"),
    btnText: document.getElementById("btnText"),
    processLoader: document.getElementById("processLoader"),
    mapOverlay: document.getElementById("mapOverlay"),
    overlayText: document.getElementById("overlayText"),
  },

  // --- 2. Inisialisasi ---
  init() {
    console.log("✅ LontaraGeo UI Engine aktif!");
    this.checkThemePreference();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Menutup modal dengan tombol Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  },

  // --- 3. Utilitas Manipulasi DOM ---
  createElement(tag, className = "", attributes = {}, content = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;

    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
    return el;
  },

  // --- 4. Notifikasi Toast (Lontara Style) ---
  /**
   * Menampilkan pesan notifikasi yang sinkron dengan index.html
   * @param {string} message - Isi pesan
   * @param {string} type - 'success' (default), 'error', 'info'
   */
  notify(message, type = "success") {
    const toast = this.elements.toast;
    const toastMsg = this.elements.toastMsg;

    if (!toast || !toastMsg) return;

    // Set konten dan ikon berdasarkan tipe
    const icon =
      type === "success"
        ? "fa-circle-check"
        : type === "error"
          ? "fa-circle-exclamation"
          : "fa-info-circle";

    toastMsg.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;

    // Sesuaikan warna background berdasarkan variabel CSS Lontara
    if (type === "error") {
      toast.style.backgroundColor = "var(--danger)";
    } else if (type === "success") {
      toast.style.backgroundColor = "var(--accent)";
    } else {
      toast.style.backgroundColor = "var(--primary)";
    }

    // Tampilkan animasi masuk
    toast.classList.add("show");

    // Sembunyikan otomatis setelah 3.5 detik
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  },

  // --- 5. State Manajemen (Loading/Processing) ---
  /**
   * Mengatur tampilan UI saat proses komputasi berlangsung
   * @param {boolean} isLoading
   * @param {string} message - Pesan yang tampil di overlay peta
   */
  setLoading(isLoading, message = "Menghubungi GEE...") {
    const { btnProcess, btnText, processLoader, mapOverlay, overlayText } =
      this.elements;

    if (isLoading) {
      if (btnProcess) btnProcess.disabled = true;
      if (processLoader) processLoader.style.display = "block";
      if (btnText) btnText.innerText = "Memproses...";
      if (mapOverlay) mapOverlay.style.display = "flex";
      if (overlayText) overlayText.innerText = message;
    } else {
      if (btnProcess) btnProcess.disabled = false;
      if (processLoader) processLoader.style.display = "none";
      if (btnText) btnText.innerText = "Analisis Ulang";
      if (mapOverlay) mapOverlay.style.display = "none";
    }
  },

  // --- 6. Komponen Modal (Popup Informasi) ---
  /**
   * Membuka modal pop-up kustom Lontara
   */
  openModal(title, contentHtml) {
    let modal = document.getElementById("ui-global-modal");

    if (!modal) {
      modal = this.createElement("div", "ui-modal", { id: "ui-global-modal" });

      // Styling dasar via JS (Agar portabel tanpa file CSS tambahan)
      Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(18, 59, 58, 0.75)", // --primary dengan transparansi
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "10000",
        backdropFilter: "blur(5px)",
      });

      const modalContent = this.createElement("div", "ui-modal-content");
      Object.assign(modalContent.style, {
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "16px",
        width: "550px",
        maxWidth: "90%",
        position: "relative",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        fontFamily: "'Manrope', sans-serif",
      });

      modalContent.innerHTML = `
        <button id="closeModal" style="position:absolute; top:20px; right:20px; border:none; background:none; font-size:24px; cursor:pointer; color:var(--text-muted)">&times;</button>
        <h3 style="color:var(--primary); margin-bottom:16px; font-weight:800; font-size:1.4rem">${title}</h3>
        <div class="modal-body" style="font-size:0.95rem; line-height:1.7; color:var(--text-main)">${contentHtml}</div>
        <div style="margin-top:25px; text-align:right;">
          <button onclick="UI.closeModal()" style="padding:10px 20px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;">Tutup</button>
        </div>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      document.getElementById("closeModal").onclick = () => this.closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal();
      };
    } else {
      modal.querySelector("h3").innerText = title;
      modal.querySelector(".modal-body").innerHTML = contentHtml;
      modal.style.display = "flex";
    }
  },

  closeModal() {
    const modal = document.getElementById("ui-global-modal");
    if (modal) modal.style.display = "none";
  },

  // --- 7. Manajemen Tema ---
  toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("lontara-theme", isDark ? "dark" : "light");
    this.notify(`Mode ${isDark ? "Gelap" : "Terang"} diaktifkan`, "info");
  },

  checkThemePreference() {
    if (localStorage.getItem("lontara-theme") === "dark") {
      document.body.classList.add("dark-theme");
    }
  },
};

// Pastikan UI inisialisasi setelah DOM siap
document.addEventListener("DOMContentLoaded", () => UI.init());

// Simpan ke window agar bisa dipanggil dari api.js dan map.js
window.UI = UI;
