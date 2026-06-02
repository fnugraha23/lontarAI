/**
 * ==========================================================================
 * LONTARA TECH — GLOBAL FORM HANDLER (SPA OPTIMIZED)
 * Lokasi: js/form-handler.js
 * Mendukung: Form Kontak, Gated Access, dan Checkout Keranjang
 * ==========================================================================
 */

const LONTARA_CONFIG = {
  publicKey: "UYXE1DX3pWfcDCIU8",
  serviceId: "service_1gevel5",
  templateId: "template_n753lnf",
};

/**
 * 1. INISIALISASI EMAILJS
 */
const initLontaraMail = () => {
  if (typeof emailjs !== "undefined") {
    emailjs.init(LONTARA_CONFIG.publicKey);
    console.log("Lontara Mail Engine: Terkoneksi");
  } else {
    setTimeout(initLontaraMail, 500);
  }
};
initLontaraMail();

/**
 * 2. HELPER: NOTIFIKASI STATUS FORM
 */
const showFormStatus = (form, message, type) => {
  let statusEl = form.querySelector(".form-status");

  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.className = "form-status";
    form.appendChild(statusEl);
  }

  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`; 
  statusEl.style.display = "block";

  setTimeout(() => {
    statusEl.style.display = "none";
  }, 6000);
};

/**
 * 3. AUTO-FILL DATA USER (Integrasi LontaraState)
 * Fungsi ini bisa dipanggil saat halaman dimuat untuk mengisi form otomatis
 */
const autoFillUserData = (form) => {
  if (window.LontaraState && window.LontaraState.user) {
    const user = window.LontaraState.user;
    const nameInput = form.querySelector('[name="nama"], [name="user_name"]');
    const emailInput = form.querySelector('[name="email"], [name="user_email"]');
    
    if (nameInput && !nameInput.value) nameInput.value = user.displayName || "";
    if (emailInput && !emailInput.value) emailInput.value = user.email || "";
  }
};

/**
 * 4. EVENT DELEGATION: MENANGANI SEMUA SUBMIT FORM
 */
document.addEventListener("submit", function (e) {
  const form = e.target;

  // Filter form yang valid untuk diproses
  if (form.id === "contact-form" || form.id === "gated-access-form" || form.id === "checkout-form") {
    e.preventDefault(); 

    // Jika ini form checkout, pastikan keranjang tidak kosong dan siapkan data order
    if (form.id === "checkout-form") {
      const cartData = window.LontaraState ? window.LontaraState.cart : [];
      
      if (cartData.length === 0) {
        showFormStatus(form, "Keranjang Anda masih kosong. Silakan pilih layanan terlebih dahulu.", "error");
        return;
      }

      // Format detail pesanan menjadi string untuk dikirim via email
      const orderDetails = cartData.map(item => `- ${item.title || item.nama} (${item.qty}x)`).join("\n");
      
      // Sisipkan data pesanan ke input tersembunyi
      let orderInput = form.querySelector('input[name="pesan"]');
      if (orderInput) {
        orderInput.value = `PESANAN LAYANAN:\n${orderDetails}\n\nCatatan Tambahan: ${orderInput.value}`;
      }
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = btn.innerHTML;

    // Tentukan pesan sukses spesifik
    let successMessage = "Terima kasih! Pesan Anda telah terkirim.";
    if (form.id === "checkout-form") successMessage = "Pesanan berhasil dibuat! Tim Lontara akan segera menghubungi Anda.";
    if (form.id === "gated-access-form") successMessage = "Sukses! Akses digital segera dikirimkan ke email Anda.";

    // Visual Feedback: Loading State
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses...`;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // PENGIRIMAN VIA EMAILJS
    emailjs
      .sendForm(LONTARA_CONFIG.serviceId, LONTARA_CONFIG.templateId, form)
      .then(() => {
        showFormStatus(form, successMessage, "success");
        form.reset(); 

        // Jika form checkout berhasil, kosongkan keranjang
        if (form.id === "checkout-form" && window.LontaraState) {
          window.LontaraState.clearCart();
        }

        btn.innerHTML = `<i class="fa-solid fa-check"></i> Berhasil`;
        btn.style.backgroundColor = "#10b981"; 
        btn.style.color = "white";
      })
      .catch((error) => {
        console.error("Lontara Mail Error:", error);
        showFormStatus(form, "Gagal memproses permintaan. Sila periksa koneksi internet Anda.", "error");

        btn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Gagal`;
        btn.style.backgroundColor = "#ef4444"; 
      })
      .finally(() => {
        // Cleanup: Kembalikan tombol ke kondisi semula setelah 4 detik
        setTimeout(() => {
          btn.innerHTML = originalBtnHTML;
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.style.backgroundColor = "";
          btn.style.color = "";
        }, 4000);
      });
  }
});

/**
 * 5. LISTENER INTERAKTIF UNTUK FORM SPA
 * Mengisi data otomatis saat user mengklik input area di form mana pun
 */
document.addEventListener("focusin", function(e) {
  const form = e.target.closest("form");
  if (form && (form.id === "contact-form" || form.id === "checkout-form")) {
    autoFillUserData(form);
  }
});