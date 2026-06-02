/**
 * ==========================================================================
 * LONTARA TECH — ANIMATION ENGINE
 * Lokasi: js/animasi.js
 * Fungsi: Scroll Reveal, Ripple Effect Tombol, & Reading Progress Bar
 * ==========================================================================
 */

const LontaraAnim = {
  init() {
    // Gunakan try-catch agar jika satu animasi gagal, web SPA tidak blank
    try {
      this.initReadingProgress();
    } catch (e) {
      console.warn("Progress Bar Error:", e);
    }
    try {
      this.initScrollReveal();
    } catch (e) {
      console.warn("Scroll Reveal Error:", e);
    }
    try {
      this.initRippleEffect();
    } catch (e) {
      console.warn("Ripple Effect Error:", e);
    }
  },

  // --- 1. READING PROGRESS BAR ---
  // Indikator garis di paling atas layar saat user membaca artikel/halaman panjang
  initReadingProgress() {
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;

    // Cegah penambahan event listener berkali-kali di SPA
    if (window.hasProgressBound) return;

    window.addEventListener(
      "scroll",
      () => {
        const windowScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        if (height <= 0) return;

        const scrolled = (windowScroll / height) * 100;
        // Gunakan lebar persentase (sesuai CSS components.css yang menggunakan width)
        progressBar.style.width = scrolled + "%";
      },
      { passive: true },
    );

    window.hasProgressBound = true;
  },

  // --- 2. SCROLL REVEAL (INTERSECTION OBSERVER) ---
  // Memunculkan elemen secara elegan saat masuk ke area pandang (viewport) layar
  initScrollReveal() {
    const revealElements = document.querySelectorAll(
      ".reveal-init:not(.reveal-active)",
    );
    if (revealElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1, // Elemen muncul saat 10% bagiannya terlihat
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target); // Cukup animasi satu kali saja
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      observer.observe(el);

      // Fallback: Jika observer gagal mendeteksi, paksa muncul setelah 1.5 detik
      // Ini menyelamatkan konten agar tidak hilang/transparan selamanya
      setTimeout(() => {
        if (!el.classList.contains("reveal-active")) {
          el.classList.add("reveal-active");
        }
      }, 1500);
    });
  },

  // --- 3. RIPPLE EFFECT (EFEK KLIK PREMIUM) ---
  // Memberikan feedback visual berbentuk gelombang air pada tombol
  initRippleEffect() {
    const buttons = document.querySelectorAll(
      ".btn-primary, .btn-secondary, .btn-dark, .nav-cta",
    );

    buttons.forEach((button) => {
      // Cegah double-binding pada elemen yang sudah ada (Penting untuk SPA)
      if (button.dataset.rippleAttached) return;

      button.addEventListener("mousedown", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple-effect";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        // Hapus span ripple setelah animasi selesai (600ms dari CSS components)
        setTimeout(() => ripple.remove(), 600);
      });

      // Tandai tombol bahwa efek sudah dipasang
      button.dataset.rippleAttached = "true";
    });
  },
};

// Ekspos ke global window
window.LontaraAnim = LontaraAnim;

// Inisialisasi awal saat web pertama kali dibuka
document.addEventListener("DOMContentLoaded", () => {
  LontaraAnim.init();
});

// FUNGSI GLOBAL UNTUK APP-SHELL
// Wajib dipanggil oleh app-shell.js setiap kali berhasil fetch konten baru
window.reinitAnimations = () => {
  LontaraAnim.init();
};
