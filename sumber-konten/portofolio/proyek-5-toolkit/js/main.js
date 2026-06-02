/**
 * LONTARA v2.0 - Core Engine Orchestrator
 * Logic: Single Page Application (SPA) with Module Lifecycle Management
 */

// 1. GLOBAL STATE MANAGEMENT
export const LontaraState = {
  currentView: "home",
  soilData: {
    physics: {
      bd: null,
      pd: 2.65,
      porosity: null,
      texture: null,
      kaBerat: null,
      kaVol: null,
    },
    chemistry: { organicC: null, ph: null, ktk: null },
    erosion: { resultA: null, factorK: null },
    environment: { carbonStock: null },
  },
};

// 2. IMPORT SCIENTIFIC MODULES
import PhysicsEngine from "./modules/physics.js";
import ChemistryEngine from "./modules/chemistry.js";
import SuitabilityEngine from "./modules/suitability.js";
import CapabilityEngine from "./modules/capability.js";
import ErosionEngine from "./modules/erosion.js";
import EnvironmentEngine from "./modules/environment.js";
// Jalur Baru untuk Karbon dan Hidrologi
import CarbonEngine from "./modules/carbon.js";
import HydrologyEngine from "./modules/hydrology.js";

const App = {
  /**
   * Inisialisasi Aplikasi
   */
  init() {
    console.log("LONTARA v2.0 Engine: Online");
    this.bindEvents();
    this.loadInitialView();
  },

  /**
   * Event Listeners Utama
   */
  bindEvents() {
    document.addEventListener("click", (e) => {
      // Handler Navigasi SPA
      const btn = e.target.closest("[data-component]");
      if (btn) {
        e.preventDefault();
        const component = btn.getAttribute("data-component");
        this.navigateTo(component);

        // Tutup Mobile Menu (Bootstrap Offcanvas) jika terbuka
        const offcanvasEl = document.getElementById("mobileMenu");
        if (offcanvasEl) {
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
          if (bsOffcanvas) bsOffcanvas.hide();
        }
      }
    });

    // Handle tombol Back/Forward Browser
    window.onpopstate = () => this.loadInitialView();
  },

  /**
   * Router: Memuat Fragment HTML & Mengaktifkan Mesin Modul
   */
  async navigateTo(componentName) {
    const appView = document.getElementById("app-view");
    const loader = document.getElementById("loader");

    if (loader) loader.style.display = "block";

    try {
      const response = await fetch(`components/${componentName}.html`);
      if (!response.ok) throw new Error(`Modul ${componentName} gagal dimuat.`);

      const html = await response.text();

      // Animasi Transisi Sederhana
      appView.style.opacity = "0";

      setTimeout(() => {
        appView.innerHTML = html;

        // Aktivasi Mesin JS sesuai komponen yang dimuat
        this.activateModuleEngine(componentName);

        // Tampilkan kembali dengan Fade In
        appView.style.transition = "opacity 0.3s ease";
        appView.style.opacity = "1";

        this.updateActiveUI(componentName);
        this.refreshThirdPartyPlugins();

        window.location.hash = componentName;
        if (loader) loader.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    } catch (error) {
      console.error("LONTARA Navigation Error:", error);
      if (loader) loader.style.display = "none";
      appView.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-circle-exclamation text-danger display-1 mb-4"></i>
                <h3 class="fw-bold">Gagal Memuat Komponen</h3>
                <p class="text-muted">Pastikan file <b>components/${componentName}.html</b> sudah ada.</p>
            </div>`;
    }
  },

  /**
   * Bridge: Menghubungkan Fragment UI dengan Engine JS-nya
   */
  activateModuleEngine(name) {
    switch (name) {
      case "physics_ui":
        PhysicsEngine.init();
        break;
      case "chemistry_ui":
        ChemistryEngine.init();
        break;
      case "suitability_ui":
        SuitabilityEngine.init();
        break;
      case "capability_ui":
        CapabilityEngine.init();
        break;
      case "erosion_ui":
        ErosionEngine.init();
        break;
      case "carbon_ui":
        CarbonEngine.init(); // Jalur Spesifik Karbon
        break;
      case "hydrology_ui":
        HydrologyEngine.init(); // Jalur Spesifik Hidrologi
        break;
      default:
        console.log(`LONTARA: View ${name} dimuat tanpa engine khusus.`);
    }
  },

  /**
   * GLOBAL HELPER: Tambah Baris Tabel
   * Fungsi ini dipanggil oleh tombol "Tambah Sampel" di semua modul
   */
  addRow(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    // Clone baris pertama sebagai template
    const newRow = tbody.rows[0].cloneNode(true);

    // Bersihkan nilai input di baris baru
    newRow.querySelectorAll("input").forEach((input) => {
      // Jika input punya nilai default (seperti PD 2.65), kembalikan ke default
      if (input.hasAttribute("value")) {
        input.value = input.getAttribute("value");
      } else {
        input.value = "";
      }
    });

    // Bersihkan tampilan hasil (div text --)
    newRow.querySelectorAll("div").forEach((div) => {
      if (div.innerText !== "") div.innerText = "--";
    });

    tbody.appendChild(newRow);
    console.log(`LONTARA: Baris baru ditambahkan ke ${tbodyId}`);
  },

  /**
   * Sinkronisasi Status Aktif di Navigasi
   */
  updateActiveUI(componentName) {
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-component") === componentName,
      );
    });
  },

  /**
   * Re-render Plugins (MathJax untuk Rumus & Bootstrap Tooltips)
   */
  refreshThirdPartyPlugins() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }

    // Inisialisasi ulang tooltip Bootstrap jika ada
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  },

  loadInitialView() {
    const hash = window.location.hash.replace("#", "") || "home";
    this.navigateTo(hash);
  },
};

// Jalankan Engine saat DOM siap
document.addEventListener("DOMContentLoaded", () => App.init());

// Ekspos App ke Global Scope agar bisa dipanggil dari HTML (onclick="App.addRow")
window.App = App;
