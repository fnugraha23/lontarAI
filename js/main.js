/**
 * ==========================================================================
 * LONTARA TECH — MAIN UI ENGINE
 * Lokasi: js/main.js
 * Fungsi: Mengatur interaksi global (Tema, Header, Menu Mobile, Nav Aktif)
 * ==========================================================================
 */

const LontaraUI = {
  init() {
    console.log("Lontara Main UI Engine: Active");

    // Cache DOM Elements
    this.header = document.getElementById("master-header");
    this.themeBtn = document.getElementById("theme-toggle");
    this.navToggle = document.getElementById("mobile-toggle");
    this.navMenu = document.getElementById("main-nav");
    this.navOverlay = document.getElementById("nav-overlay");

    // Initialize Features
    this.initTheme();
    this.initHeaderScroll();
    this.initMobileMenu();
  },

  // --- 1. THEME ENGINE (Dark Mode Persistence) ---
  initTheme() {
    if (!this.themeBtn) return;

    // Baca preferensi sebelumnya dari Local Storage
    const savedTheme = localStorage.getItem("lontara_theme") || "light";

    // Aplikasikan tema awal
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    }
    this.updateThemeIcon(savedTheme);

    // Event Listener untuk Tombol Toggle
    this.themeBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-theme");
      const newTheme = isDark ? "dark" : "light";

      // Simpan pilihan user
      localStorage.setItem("lontara_theme", newTheme);
      this.updateThemeIcon(newTheme);
    });
  },

  // Ganti ikon bulan/matahari dan LOGO sesuai tema
  updateThemeIcon(theme) {
    const icon = this.themeBtn.querySelector("i");
    const mainLogo = document.getElementById("main-logo");

    if (icon) {
      if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
        if (mainLogo) mainLogo.src = "aset/logo/logo-putih.png";
      } else {
        icon.className = "fa-solid fa-moon";
        if (mainLogo) mainLogo.src = "aset/logo/logo-hitam.png";
      }
    }
  },

  // --- 2. HEADER INTERACTION (Shrink on Scroll) ---
  initHeaderScroll() {
    if (!this.header) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 50) {
          this.header.classList.add("shrink");
        } else {
          this.header.classList.remove("shrink");
        }
      },
      { passive: true },
    ); 
  },

  // --- 3. MOBILE MENU LOGIC ---
  initMobileMenu() {
    if (!this.navToggle || !this.navMenu || !this.navOverlay) return;

    const toggleMenu = () => {
      this.navToggle.classList.toggle("active");
      this.navMenu.classList.toggle("active");
      this.navOverlay.classList.toggle("active");

      // Matikan scroll pada body saat menu terbuka
      if (this.navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    // Buka/Tutup lewat tombol hamburger dan overlay
    this.navToggle.addEventListener("click", toggleMenu);
    this.navOverlay.addEventListener("click", toggleMenu);

    // Tutup menu otomatis jika user mengklik salah satu link
    this.navMenu.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link-ajax") || e.target.closest(".nav-cta")) {
        if (this.navMenu.classList.contains("active")) {
          toggleMenu();
        }
      }
    });
  },

  // --- 4. NAVIGATION MAPPING (Highlighter Menu Aktif) ---
  // Menerima parameter alias (contoh: "layanan/website" atau "beranda")
  updateActiveLinks(currentAlias) {
    const links = document.querySelectorAll(".nav-links .nav-link-ajax, .nav-cta");
    let matched = false;

    // Default ke beranda jika kosong
    const activeAlias = currentAlias || "beranda";

    links.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return; // Lewati jika bukan link hash

      const targetAlias = href.substring(1); // Hilangkan tanda # (misal: "layanan")

      // Cek apakah posisi sekarang persis sama, ATAU merupakan sub-folder dari menu
      // Contoh: activeAlias "layanan/website" mengandung awalan "layanan/"
      if (activeAlias === targetAlias || activeAlias.startsWith(targetAlias + "/")) {
        link.classList.add("active");
        matched = true;
      }
    });

    // Fallback: Jika tidak ada menu yang cocok, nyalakan Beranda
    if (!matched) {
      const berandaLink = document.querySelector('.nav-links a[href="#beranda"]');
      if (berandaLink) berandaLink.classList.add("active");
    }
  },
};

// Ekspos ke object window agar bisa diakses file JS lain
window.LontaraUI = LontaraUI;

// Jalankan sistem saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  LontaraUI.init();
});