/**
 * LONTARA — GLOBAL FORM HANDLER (SPA OPTIMIZED)
 * Mendukung Form Kontak & Akses Aset Digital (Gated Access)
 * Menggunakan Kredensial Resmi: UYXE1DX3pWfcDCIU8
 */

// 1. KONFIGURASI KREDENSIAL
const LONTARA_CONFIG = {
  publicKey: "UYXE1DX3pWfcDCIU8",
  serviceId: "service_1gevel5",
  templateId: "template_n753lnf",
};

/**
 * Inisialisasi EmailJS dengan perlindungan 'ReferenceError'
 * Memastikan library sudah dimuat dari index.html sebelum dijalankan
 */
const initLontaraMail = () => {
  if (typeof emailjs !== "undefined") {
    emailjs.init(LONTARA_CONFIG.publicKey);
    console.log("Lontara Mail Engine: Terkoneksi");
  } else {
    // Jika library belum siap, coba lagi dalam 500ms
    setTimeout(initLontaraMail, 500);
  }
};

initLontaraMail();

/**
 * Helper: Menampilkan pesan status inline di bawah form
 * @param {HTMLElement} form - Elemen form terkait
 * @param {string} message - Teks pesan
 * @param {string} type - 'success' atau 'error'
 */
const showFormStatus = (form, message, type) => {
  let statusEl = form.querySelector(".form-status");

  // Buat elemen jika belum ada
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.className = "form-status";
    form.appendChild(statusEl);
  }

  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`; // Sesuai class di components.css
  statusEl.style.display = "block";

  // Hilangkan otomatis setelah 6 detik
  setTimeout(() => {
    statusEl.style.display = "none";
  }, 6000);
};

/**
 * EVENT DELEGATION: Menangani submit form secara global
 * Ini kunci utama agar form di sistem SPA tetap berfungsi saat berpindah tab
 */
document.addEventListener("submit", function (e) {
  const form = e.target;

  // Filter: Hanya proses form yang terdaftar
  if (form.id === "contact-form" || form.id === "gated-access-form") {
    e.preventDefault(); // STOP reload halaman & URL query (?nama=...)

    const btn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = btn.innerHTML;

    // Tentukan pesan sukses berdasarkan jenis form
    const successMessage =
      form.id === "contact-form"
        ? "Terima kasih! Pesan Anda telah terkirim ke tim admin Lontara."
        : "Sukses! Permintaan akses digital Anda telah kami terima.";

    // 2. VISUAL FEEDBACK: Loading State
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses...`;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // 3. PENGIRIMAN VIA EMAILJS
    emailjs
      .sendForm(LONTARA_CONFIG.serviceId, LONTARA_CONFIG.templateId, form)
      .then(() => {
        // STATUS: BERHASIL
        showFormStatus(form, successMessage, "success");
        form.reset(); // Kosongkan inputan

        // Ubah tombol jadi tanda centang sebentar
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Berhasil`;
        btn.style.backgroundColor = "#10b981"; // Hijau
        btn.style.color = "white";
      })
      .catch((error) => {
        // STATUS: GAGAL
        console.error("Lontara Mail Error:", error);
        showFormStatus(
          form,
          "Gagal mengirim pesan. Sila periksa koneksi Anda.",
          "error",
        );

        btn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Gagal`;
        btn.style.backgroundColor = "#ef4444"; // Merah
      })
      .finally(() => {
        // 4. CLEANUP: Kembalikan tombol ke kondisi semula setelah 4 detik
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
