/**
 * ==========================================================================
 * LONTARA TECH — UTILITIES & STATE MANAGEMENT
 * Lokasi: js/utils.js
 * Fungsi: Helper global, Storage, dan Manajemen Data Keranjang/Akun
 * ==========================================================================
 */

const LontaraUtils = {
  /**
   * 1. DEBOUNCE FUNCTION
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 2. FORMATTER KOORDINAT SPASIAL (GIS UTILITY)
   */
  formatKoordinat(lat, lng) {
    const toDMS = (coordinate, type) => {
      const absolute = Math.abs(coordinate);
      const degrees = Math.floor(absolute);
      const minutesNotTruncated = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesNotTruncated);
      const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

      let direction = "";
      if (type === "lat") direction = coordinate >= 0 ? "N" : "S";
      if (type === "lng") direction = coordinate >= 0 ? "E" : "W";

      return `${degrees}°${minutes}'${seconds}"${direction}`;
    };

    return `${toDMS(lat, "lat")}, ${toDMS(lng, "lng")}`;
  },

  /**
   * 3. FORMATTER TANGGAL LOKAL (INDONESIA)
   */
  formatTanggal(dateString) {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", options);
  },

  /**
   * 4. FORMATTER UKURAN FILE (DIGITAL ASSET UTILITY)
   */
  formatUkuranFile(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },

  /**
   * 5. FORMATTER RUPIAH (BARU: Untuk fitur keranjang/layanan)
   */
  formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(angka);
  },

  /**
   * 6. SAFE LOCAL STORAGE
   */
  storage: {
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn("Lontara Storage Save Error:", e);
      }
    },
    get(key) {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn("Lontara Storage Read Error:", e);
        return null;
      }
    },
    remove(key) {
      window.localStorage.removeItem(key);
    }
  }
};


/**
 * ==========================================================================
 * LONTARA STATE — GLOBAL DATA MANAGER (CART & AUTH)
 * ==========================================================================
 */
const LontaraState = {
  cart: [],
  user: null,

  init() {
    // Tarik data dari LocalStorage saat web pertama kali dibuka
    this.cart = LontaraUtils.storage.get("lontara_cart") || [];
    this.user = LontaraUtils.storage.get("lontara_user") || null;

    // Pancarkan event agar komponen UI (seperti Navbar) langsung sinkron
    this.notify("cart");
    this.notify("auth");
  },

  // --- LOGIKA KERANJANG BELANJA ---
  addToCart(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.qty += 1; // Jika barang sudah ada, tambah jumlahnya
    } else {
      this.cart.push({ ...product, qty: 1 }); // Jika baru, masukkan ke array
    }
    
    this.save("cart");
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.save("cart");
  },

  updateQty(productId, qty) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.qty = Math.max(1, qty); // Qty tidak boleh kurang dari 1
      this.save("cart");
    }
  },

  clearCart() {
    this.cart = [];
    this.save("cart");
  },

  // --- LOGIKA AUTENTIKASI ---
  setUser(userData) {
    this.user = userData;
    this.save("auth");
  },

  logout() {
    this.user = null;
    this.save("auth");
  },

  // --- INTERNAL ENGINE ---
  save(type) {
    if (type === "cart") {
      LontaraUtils.storage.set("lontara_cart", this.cart);
      this.notify("cart");
    } else if (type === "auth") {
      LontaraUtils.storage.set("lontara_user", this.user);
      this.notify("auth");
    }
  },

  // Fungsi untuk memberitahu seluruh website bahwa ada data yang berubah
  notify(type) {
    const eventName = type === "cart" ? "lontara:cartUpdated" : "lontara:authUpdated";
    const eventData = type === "cart" ? this.cart : this.user;
    
    // Custom Event Vanilla JS
    const event = new CustomEvent(eventName, { detail: eventData });
    window.dispatchEvent(event);
  }
};

// Ekspos ke global window
window.LontaraUtils = LontaraUtils;
window.LontaraState = LontaraState;

// Jalankan state manager saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  LontaraState.init();
});