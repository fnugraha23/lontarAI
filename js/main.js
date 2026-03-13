/**
 * LONTARA TECH — UI CORE v4.0
 * Logic: Theme Switching, Mobile Navigation, & Header States
 * Compatibility: Fully SPA-Ready
 */

const LontaraUI = {
  // 1. SELECTORS (Caching elemen DOM)
  elements: {
    body: document.body,
    header: document.getElementById("header"),
    navMenu: document.getElementById("nav-menu"),
    navToggle: document.getElementById("nav-toggle"),
    navOverlay: document.getElementById("nav-overlay"),
    themeBtn: document.getElementById("theme-toggle"),
    mainLogo: document.getElementById("main-logo"),
  },

  // 2. INISIALISASI
  init() {
    console.log("Lontara UI Core: Online");
    this.initTheme();
    this.bindEvents();
    this.updateActiveLinks();
  },

  // 3. SISTEM TEMA (DARK / LIGHT)
  initTheme() {
    const savedTheme = localStorage.getItem("lontara-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    // Cek preferensi user atau sistem
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    if (isDark) {
      this.elements.body.classList.add("dark-theme");
    }
    this.syncThemeAssets(isDark);
  },

  toggleTheme() {
    const isDark = this.elements.body.classList.toggle("dark-theme");
    localStorage.setItem("lontara-theme", isDark ? "dark" : "light");
    this.syncThemeAssets(isDark);
  },

  syncThemeAssets(isDark) {
    // A. Update Ikon Tombol Tema
    if (this.elements.themeBtn) {
      const icon = this.elements.themeBtn.querySelector("i");
      if (icon) {
        icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    }

    // B. Update Logo (Point: Menggunakan versi logo yang sesuai tema)
    if (this.elements.mainLogo) {
      this.elements.mainLogo.src = isDark
        ? "aset/logo/logo-putih.png"
        : "aset/logo/logo-hitam.png";
    }
  },

  // 4. BINDING EVENT LISTENERS
  bindEvents() {
    // Ganti Tema
    this.elements.themeBtn?.addEventListener("click", () => this.toggleTheme());

    // Navigasi Mobile
    this.elements.navToggle?.addEventListener("click", () =>
      this.toggleMobileNav(),
    );
    this.elements.navOverlay?.addEventListener("click", () =>
      this.closeMobileNav(),
    );

    // Header Scroll Effect (Shrink)
    // Menggunakan throttle sederhana untuk performa scroll yang mulus
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 40) {
          this.elements.header.classList.add("shrink");
        } else {
          this.elements.header.classList.remove("shrink");
        }
      },
      { passive: true },
    );
  },

  // 5. LOGIKA NAVIGASI MOBILE
  toggleMobileNav() {
    const isActive = this.elements.navMenu.classList.toggle("active");
    this.elements.navToggle.classList.toggle("active");
    this.elements.navOverlay.classList.toggle("active");

    // Mencegah scroll pada body saat menu terbuka
    this.elements.body.style.overflow = isActive ? "hidden" : "";
  },

  closeMobileNav() {
    this.elements.navMenu.classList.remove("active");
    this.elements.navToggle.classList.remove("active");
    this.elements.navOverlay.classList.remove("active");
    this.elements.body.style.overflow = "";
  },

  // 6. UPDATE STATE MENU AKTIF (Penting untuk SPA)
  updateActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.remove("active");

      // Cek kecocokan URL untuk memberikan highlight hijau pada menu
      if (currentPath.includes(href) && !href.includes("beranda.html")) {
        link.classList.add("active");
      } else if (
        (currentPath === "/" || currentPath.endsWith("index.html")) &&
        href.includes("beranda.html")
      ) {
        link.classList.add("active");
      }
    });
  },
};

// Start UI Engine saat DOM siap
document.addEventListener("DOMContentLoaded", () => LontaraUI.init());

/**
 * GLOBAL EXPORTS
 * Fungsi ini akan dipanggil oleh app-shell.js setiap kali konten baru disuntikkan.
 */
window.updateLontaraUI = () => LontaraUI.updateActiveLinks();
window.closeLontaraMenu = () => LontaraUI.closeMobileNav();
