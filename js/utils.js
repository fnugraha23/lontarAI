/**
 * LONTARA TECH — UTILITIES ENGINE v4.0
 * Logic: Global Helper Functions & Performance Optimizers
 * Purpose: Support core modules with reusable logic
 */

const LontaraUtils = {
  // 1. DEBOUNCE
  // Menunda eksekusi fungsi sampai aktivitas berhenti (Contoh: Mengetik di kolom cari)
  debounce(func, wait = 250) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  // 2. THROTTLE
  // Membatasi eksekusi fungsi maksimal sekali dalam rentang waktu (Contoh: Scroll & Resize)
  throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // 3. FORMAT TANGGAL
  // Mengubah format ISO (2026-03-13) menjadi format Indonesia yang rapi
  formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (e) {
      return dateString;
    }
  },

  // 4. POTONG TEKS (Truncate)
  // Merapikan ringkasan artikel atau hasil pencarian agar tidak terlalu panjang
  truncateText(text, limit = 120) {
    if (!text || text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
  },

  // 5. STORAGE WRAPPER (Safe LocalStorage)
  // Memastikan data tersimpan aman tanpa merusak aplikasi jika storage penuh
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn("Lontara Storage: Gagal menyimpan data", e);
        return false;
      }
    },
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    },
  },

  // 6. DETEKSI PERANGKAT
  // Berguna untuk mematikan fitur berat pada perangkat mobile
  isMobile: {
    any: () => window.innerWidth <= 1024,
    touch: () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
  },

  // 7. PATH NORMALIZER (Penting untuk SPA)
  // Membersihkan path URL agar sistem navigasi tetap konsisten
  cleanPath(path) {
    return path.replace(window.location.origin, "").replace(/^\/|\/$/g, "");
  },
};

// Daftarkan ke global window agar bisa diakses oleh main.js, app-shell.js, dll.
window.LontaraUtils = LontaraUtils;
