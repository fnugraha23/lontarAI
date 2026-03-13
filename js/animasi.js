/**
 * LONTARA TECH — ANIMATION ENGINE v4.1
 * Logic: Scroll Reveals, Ripple Effects, & Reading Progress (Reflow-Free)
 * Compatibility: Fully SPA-Ready (Lontara App Shell)
 */

const LontaraAnim = {
  // 1. INISIALISASI UTAMA
  init() {
    console.log("Lontara Animation Engine: Active");
    this.initReadingProgress();
    this.initScrollReveal();
    this.initRippleEffect();
    this.initSmoothScroll();
  },

  // 2. READING PROGRESS BAR (FIXED: Anti-Reflow / Anti-Geser)
  initReadingProgress() {
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;

    // PAKSA PROGRESS BAR KELUAR DARI ALIRAN FLEXBOX HEADER
    // Ini mencegah baris ini mendorong logo saat lebarnya bertambah
    progressBar.style.position = "absolute";
    progressBar.style.bottom = "0"; // Nempel di garis bawah header
    progressBar.style.left = "0";
    progressBar.style.width = "100%"; // Lebar di-set full sejak awal
    progressBar.style.height = "3px"; // Ketebalan garis
    progressBar.style.backgroundColor = "var(--accent)"; // Warna garis
    progressBar.style.transformOrigin = "left center"; // Melebar dari kiri ke kanan
    progressBar.style.transform = "scaleX(0)"; // Skala awal disembunyikan
    progressBar.style.zIndex = "1001";

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const windowScroll = document.documentElement.scrollTop;
            const height =
              document.documentElement.scrollHeight -
              document.documentElement.clientHeight;

            // Dapatkan nilai desimal antara 0.0 hingga 1.0
            const scrolled = windowScroll / height;

            // KUNCI: Gunakan transform scaleX alih-alih merubah width
            // Ini tidak akan memicu reflow Flexbox, jadi logo tidak akan tergeser!
            progressBar.style.transform = `scaleX(${scrolled})`;

            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );
  },

  // 3. SCROLL REVEAL (Intersection Observer)
  initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-init");
    if (revealElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Muncul sedikit sebelum benar-benar terlihat
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target); // Hanya animasi satu kali
        }
      });
    }, observerOptions);

    revealElements.forEach((el, index) => {
      // Jalankan Observer
      observer.observe(el);

      // LOGIKA EAGER REVEAL (Penting: Agar Hero tidak hilang/kosong)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Beri sedikit delay staggered (bergantian) agar mewah
        setTimeout(() => {
          el.classList.add("reveal-active");
        }, index * 120);
      }
    });
  },

  // 4. BUTTON RIPPLE EFFECT (Efek air saat tombol diklik)
  initRippleEffect() {
    // Daftarkan semua elemen tombol
    const rippleElements = document.querySelectorAll(
      ".btn-primary, .btn-secondary, .btn-tersier, .nav-cta, .theme-btn, .search-submit",
    );

    rippleElements.forEach((button) => {
      // Hindari duplikasi listener pada sistem SPA
      if (button.dataset.rippleAttached) return;

      button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        // Hapus elemen ripple setelah animasi selesai
        setTimeout(() => ripple.remove(), 600);
      });

      button.dataset.rippleAttached = "true";
    });
  },

  // 5. SMOOTH SCROLL UNTUK INTERNAL LINKS
  initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor || anchor.getAttribute("href") === "#") return;

      const targetId = anchor.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  },
};

// Start Engine
document.addEventListener("DOMContentLoaded", () => LontaraAnim.init());

/**
 * GLOBAL RE-INITIALIZATION
 * Fungsi ini dipanggil oleh app-shell.js setiap kali konten baru disuntikkan
 * agar elemen di halaman baru bisa muncul dengan animasi.
 */
window.reinitAnimations = () => {
  LontaraAnim.initScrollReveal();
  LontaraAnim.initRippleEffect();
};
