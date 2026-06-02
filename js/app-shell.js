/**
 * ==========================================================================
 * LONTARA TECH — SPA ROUTING ENGINE (APP SHELL)
 * Lokasi: js/app-shell.js
 * ==========================================================================
 */

const AppShell = {
routeMap: {
    // --- HALAMAN UTAMA ---
    "beranda": { url: "sumber-konten/beranda.html", title: "Beranda | Lontara Tech" },
    "layanan": { url: "sumber-konten/layanan/layanan.html", title: "Layanan | Lontara Tech" },
    "layanan/pemodelan-das": { url: "sumber-konten/layanan/analisis-spasial/pemodelan-das.html", title: "Klasifikasi Lahan | Lontara Tech" },
    "layanan/data-tutupan-lahan": { url: "sumber-konten/layanan/data-spasial/data-tutupan-lahan.html", title: "Data Tutupan Lahan | Lontara Tech" },
    "layanan/webgis-statis-biasa": { url: "sumber-konten/layanan/webgis/webgis-statis-biasa.html", title: "WebGIS Statis | Lontara Tech" },
    "layanan/website-portofolio-1": { url: "sumber-konten/layanan/website/website-portofolio-1.html", title: "Website Portofolio | Lontara Tech" },
    "portofolio": { url: "sumber-konten/portofolio/portofolio.html", title: "Portofolio | Lontara Tech" },
    "artikel": { url: "sumber-konten/artikel/artikel.html", title: "Artikel | Lontara Tech" },
    "publikasi": { url: "sumber-konten/publikasi/publikasi.html", title: "Publikasi | Lontara Tech" },
    "aset-digital": { url: "sumber-konten/aset-digital/aset-digital.html", title: "Aset Digital | Lontara Tech" },
    "tentang": { url: "sumber-konten/tentang/tentang.html", title: "Tentang Kami | Lontara Tech" },
    "kontak": { url: "sumber-konten/kontak/kontak.html", title: "Kontak | Lontara Tech" },
    
    // --- FITUR & AKUN ---
    "keranjang": { url: "sumber-konten/keranjang/keranjang.html", title: "Keranjang Belanja | Lontara Tech" },
    "profil": { url: "sumber-konten/profil/profil.html", title: "Profil Pengguna | Lontara Tech" },
    "login": { url: "sumber-konten/auth/login.html", title: "Masuk | Lontara Tech" },
    "register": { url: "sumber-konten/auth/register.html", title: "Daftar Akun | Lontara Tech" },

    // --- ARTIKEL ---
    "artikel/data-spasial": { url: "sumber-konten/artikel/data-spasial.html", title: "Data Spasial | Lontara Tech" },
    "artikel/gis-dasar": { url: "sumber-konten/artikel/gis-dasar.html", title: "GIS Dasar | Lontara Tech" },
    "artikel/proyeksi": { url: "sumber-konten/artikel/proyeksi.html", title: "Proyeksi | Lontara Tech" },
    "artikel/workflow": { url: "sumber-konten/artikel/workflow.html", title: "Workflow | Lontara Tech" },

    // --- PORTOFOLIO ---
    "portofolio/lereng": { url: "sumber-konten/portofolio/proyek-0-toolbox-lereng/toolbox-lereng.html", title: "Toolbox Lereng | Portofolio Lontara" },
    "portofolio/proyek-1": { url: "sumber-konten/portofolio/proyek-1-webgis/overview-proyek-1.html", title: "Proyek WebGIS | Portofolio Lontara" },
    "portofolio/proyek-2": { url: "sumber-konten/portofolio/proyek-2-wb-style/overview-proyek-2.html", title: "Proyek WB Style | Portofolio Lontara" },
    "portofolio/proyek-3": { url: "sumber-konten/portofolio/proyek-3-geengine/overview-proyek-3.html", title: "Proyek GE Engine | Portofolio Lontara" },
    "portofolio/proyek-4": { url: "sumber-konten/portofolio/proyek-4-usle/overview-proyek-4.html", title: "Proyek USLE | Portofolio Lontara" },
    "portofolio/proyek-5": { url: "sumber-konten/portofolio/proyek-5-toolkit/overview-proyek-5.html", title: "Proyek Toolkit | Portofolio Lontara" },

    // --- ASET DIGITAL ---
    "aset-digital/batas-admin-2024": { url: "sumber-konten/aset-digital/gratis/batas-admin-big-2024.html", title: "Batas Admin BIG 2024 | Aset Digital Lontara" },
    "aset-digital/tool-lereng": { url: "sumber-konten/aset-digital/premium/toolbox-lereng.html", title: "Toolbox Lereng | Aset Digital Lontara" }
  },

  init() {
    console.log("Lontara SPA Engine: Berjalan Tanpa Hambatan...");

    this.contentArea = document.getElementById("render-konten");
    this.progressBar = document.getElementById("progress-bar");

    document.body.addEventListener("click", (e) => {
      const link = e.target.closest(".nav-link-ajax");
      if (link) {
        e.preventDefault(); 
        const href = link.getAttribute("href");
        const alias = href.startsWith("#") ? href.substring(1) : href;
        this.navigateTo(alias);
      }
    });

    window.addEventListener("hashchange", () => {
      this.loadContentFromHash();
    });

    // Langsung muat konten tanpa menunggu Firebase!
    this.loadContentFromHash();
  },

  navigateTo(alias) {
    window.location.hash = alias;
  },

  async loadContentFromHash() {
    let alias = window.location.hash.substring(1);
    if (!alias || alias === "" || alias === "/") {
      alias = "beranda";
    }

    const route = this.routeMap[alias];

    if (!route) {
      this.renderErrorPage(alias);
      return;
    }

    document.title = route.title;
    this.fetchAndRender(route.url, alias);
  },

  async fetchAndRender(url, alias) {
    if (this.progressBar) {
      this.progressBar.style.opacity = "1";
      this.progressBar.style.width = "30%";
    }

    try {
      const response = await fetch(url);
      if (this.progressBar) this.progressBar.style.width = "60%";

      if (!response.ok) {
        throw new Error(`File tidak ditemukan: ${response.status}`);
      }

      const htmlContent = await response.text();
      if (this.progressBar) this.progressBar.style.width = "90%";

      this.contentArea.innerHTML = htmlContent;
      this.onContentLoaded(alias);
    } catch (error) {
      console.error("Lontara SPA Error:", error);
      this.renderErrorPage(alias);
    } finally {
      if (this.progressBar) {
        this.progressBar.style.width = "100%";
        setTimeout(() => {
          this.progressBar.style.opacity = "0";
          setTimeout(() => {
            this.progressBar.style.width = "0%";
          }, 300);
        }, 500);
      }
    }
  },

  renderErrorPage(alias) {
    this.contentArea.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 2rem;">
          <i class="fa-solid fa-satellite-dish" style="font-size: 5rem; color: var(--accent); margin-bottom: 1.5rem;"></i>
          <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-main);">Radar Kehilangan Sinyal</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem; max-width: 500px;">
              Koordinat <strong>"${alias}"</strong> tidak ditemukan dalam database rute Lontara.
          </p>
          <a href="#beranda" class="nav-link-ajax btn-primary">
              Kembali ke Pusat Komando
          </a>
      </div>
    `;
  },

  onContentLoaded(alias) {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (window.LontaraUI && typeof window.LontaraUI.updateActiveLinks === "function") {
      window.LontaraUI.updateActiveLinks(alias);
    }

    if (typeof window.reinitAnimations === "function") {
      window.reinitAnimations();
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  AppShell.init();
});