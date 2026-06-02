/**
 * ==========================================================================
 * LONTARA TECH — SHOPPING CART ENGINE (WHATSAPP CHECKOUT)
 * Lokasi: js/cart.js
 * ==========================================================================
 */

const LontaraCart = {
  init() {
    console.log("Lontara Cart Engine: Active");

    window.addEventListener("lontara:cartUpdated", (e) => {
      const cartData = e.detail;
      this.updateCartCounter(cartData);

      if (window.location.hash === "#keranjang") {
        this.renderCartPage(cartData);
      }
    });

    document.body.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".btn-add-cart");
      if (addBtn) { e.preventDefault(); this.handleAddToCart(addBtn); }

      const plusBtn = e.target.closest(".cart-qty-plus");
      if (plusBtn) {
        const id = plusBtn.closest(".cart-item").dataset.id;
        const item = window.LontaraState.cart.find(i => i.id === id);
        if (item) window.LontaraState.updateQty(id, item.qty + 1);
      }

      const minusBtn = e.target.closest(".cart-qty-minus");
      if (minusBtn) {
        const id = minusBtn.closest(".cart-item").dataset.id;
        const item = window.LontaraState.cart.find(i => i.id === id);
        if (item && item.qty > 1) window.LontaraState.updateQty(id, item.qty - 1);
      }

      const removeBtn = e.target.closest(".cart-item-remove");
      if (removeBtn) {
        const id = removeBtn.closest(".cart-item").dataset.id;
        window.LontaraState.removeFromCart(id);
      }
    });

    document.body.addEventListener("submit", (e) => {
      if (e.target.id === "checkout-form") {
        e.preventDefault();
        this.handleCheckoutSubmit(e.target);
      }
    });

    if (window.LontaraState) {
      this.updateCartCounter(window.LontaraState.cart);
    }
  },

  // --- FUNGSI CHECKOUT WHATSAPP ---
  handleCheckoutSubmit(form) {
    const btnSubmit = form.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerHTML;
    
    // Ubah tombol
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengalihkan ke WhatsApp...';
    btnSubmit.disabled = true;

    // 1. Ambil data dari form input HTML
    const nama = document.getElementById("checkout-name").value;
    const email = document.getElementById("checkout-email").value;
    const wa = document.getElementById("checkout-wa").value;
    const domisili = document.getElementById("checkout-domisili").value || "-"; 
    const notes = document.getElementById("checkout-notes").value || "Tidak ada catatan";

    const cartItems = window.LontaraState ? window.LontaraState.cart : [];
    
    if (!cartItems || cartItems.length === 0) {
        Swal.fire({ icon: 'error', title: 'Keranjang Kosong', text: 'Silakan pilih layanan terlebih dahulu.' });
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        return;
    }

    // 2. Susun Daftar Belanjaan untuk teks WhatsApp
    let orderList = "";
    let totalPesan = 0;
    
    cartItems.forEach((item, index) => {
      const subtotal = item.harga * item.qty;
      totalPesan += subtotal;
      orderList += `${index + 1}. ${item.nama} (${item.qty}x)\n   *Harga:* ${window.LontaraUtils.formatRupiah(subtotal)}\n`;
    });

    // 3. Susun Teks Pesan Lengkap dengan Nomor Lontara
    const adminWhatsApp = "62881022823654"; 

    const pesanTeks = `Halo Tim Lontara Tech, saya tertarik untuk mendiskusikan layanan/aset digital berikut:\n\n*INFORMASI PEMESAN*\n- Nama: ${nama}\n- No. WA: ${wa}\n- Email: ${email}\n- Domisili: ${domisili}\n\n*RINCIAN PESANAN*\n${orderList}\n*Total Estimasi: ${window.LontaraUtils.formatRupiah(totalPesan)}*\n\n*CATATAN TAMBAHAN:*\n${notes}\n\nMohon informasi mengenai teknis proyek dan langkah selanjutnya. Terima kasih.`;

    // 4. Ubah teks menjadi format link WhatsApp (URL Encoding)
    const waLink = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(pesanTeks)}`;

    // 5. Buka tab WhatsApp & Tampilkan SweetAlert
    setTimeout(() => {
        window.open(waLink, '_blank'); 

        Swal.fire({
            icon: 'success',
            title: 'Dialihkan ke WhatsApp!',
            text: 'Silakan klik kirim pesan di aplikasi WhatsApp Anda. Keranjang akan kami kosongkan.',
            confirmButtonColor: '#00b8a9'
        }).then(() => {
            if (window.LontaraState && typeof window.LontaraState.clearCart === "function") {
                window.LontaraState.clearCart();
            }
            window.location.hash = "beranda";
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        });
    }, 800);
  },

  // --- FUNGSI UPDATE NOTIFIKASI NAVBAR ---
  updateCartCounter(cartData) {
    const counterEl = document.getElementById("cart-count");
    if (!counterEl) return;

    const totalItems = cartData.reduce((sum, item) => sum + item.qty, 0);
    counterEl.textContent = totalItems;
    
    if (totalItems > 0) {
      counterEl.style.display = "flex";
      counterEl.style.transform = "scale(1.3)";
      setTimeout(() => counterEl.style.transform = "scale(1)", 200);
    } else {
      counterEl.style.display = "none";
    }
  },

  handleAddToCart(btn) {
    const product = {
      id: btn.dataset.id,
      nama: btn.dataset.nama,
      harga: parseInt(btn.dataset.harga) || 0,
      kategori: btn.dataset.kategori || "Layanan Spasial"
    };

    if (!product.id || !product.nama) return;

    window.LontaraState.addToCart(product);

    const originalContent = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Masuk Keranjang`;
    btn.style.backgroundColor = "var(--primary)";
    btn.style.color = "white";
    btn.style.borderColor = "var(--primary)";

    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }, 2000);
  },

  renderCartPage(cartData) {
    const cartContainer = document.getElementById("cart-items-container");
    const cartSummary = document.getElementById("cart-summary-container");
    
    if (!cartContainer || !cartSummary) return;

    if (cartData.length === 0) {
      cartContainer.style.gridColumn = "1 / -1";
      cartContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 5rem 1rem; width: 100%;">
          <i class="fa-solid fa-cart-arrow-down" style="font-size: 5rem; color: var(--border); margin-bottom: 1.5rem;"></i>
          <h3 style="color: var(--text-main); font-size: 1.8rem; margin-bottom: 10px;">Keranjang Anda Kosong</h3>
          <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 1.1rem;">Silakan jelajahi layanan atau aset digital kami.</p>
          <a href="#layanan" class="btn-primary nav-link-ajax" style="padding: 12px 30px; font-size: 1rem;">Lihat Layanan Lontara</a>
        </div>
      `;
      cartSummary.style.display = "none";
      return;
    }

    cartSummary.style.display = "block";
    cartContainer.style.gridColumn = ""; 
    
    let htmlContent = "";
    let subtotal = 0;

    cartData.forEach(item => {
      const totalHargaBarang = item.harga * item.qty;
      subtotal += totalHargaBarang;

      htmlContent += `
        <div class="cart-item" data-id="${item.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 1rem; background: var(--bg-light);">
          
          <div style="flex: 1;">
            <span style="font-size: 0.7rem; font-weight: 800; color: var(--accent); text-transform: uppercase;">${item.kategori}</span>
            <h4 style="margin: 0.3rem 0; font-size: 1.1rem; color: var(--text-main);">${item.nama}</h4>
            <p style="margin: 0; font-weight: 700; color: var(--text-muted);">${window.LontaraUtils.formatRupiah(item.harga)}</p>
          </div>

          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
              <button class="cart-qty-minus" style="padding: 8px 12px; border: none; background: var(--bg-main); cursor: pointer; color: var(--text-main);"><i class="fa-solid fa-minus"></i></button>
              <span style="padding: 0 15px; font-weight: 700;">${item.qty}</span>
              <button class="cart-qty-plus" style="padding: 8px 12px; border: none; background: var(--bg-main); cursor: pointer; color: var(--text-main);"><i class="fa-solid fa-plus"></i></button>
            </div>
            
            <button class="cart-item-remove" title="Hapus Barang" style="background: none; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer; padding: 10px;">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>

        </div>
      `;
    });

    cartContainer.innerHTML = htmlContent;

    const totalEl = document.getElementById("cart-total-price");
    if (totalEl) {
      totalEl.textContent = window.LontaraUtils.formatRupiah(subtotal);
    }
  }
};

window.LontaraCart = LontaraCart;
document.addEventListener("DOMContentLoaded", () => {
  LontaraCart.init();
});