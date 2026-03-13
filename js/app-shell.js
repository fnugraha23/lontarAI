/**
 * LONTARA TECH — APP SHELL ENGINE v5.0
 * Logic: SPA Router dengan Memory Session (Anti-Redirect Home)
 */

const AppShell = {
  init() {
    console.log("Lontara App Shell: Online");
    this.renderArea = document.getElementById("render-konten");

    this.initRouter();

    // CEK MEMORY: Apakah tadi user sedang membuka halaman tertentu?
    const lastPage = sessionStorage.getItem("lontara_last_page");

    if (lastPage) {
      this.loadContent(lastPage);
    } else {
      // Jika benar-benar baru buka web, muat Beranda
      this.loadContent("sumber-konten/beranda.html");
    }
  },

  initRouter() {
    // Gunakan capturing phase agar preventDefault lebih kuat
    document.addEventListener(
      "click",
      (e) => {
        const link = e.target.closest(".nav-link-ajax");

        if (link) {
          e.preventDefault();
          e.stopPropagation();

          const targetUrl = link.getAttribute("href");

          // Simpan ke memory agar jika refresh tidak hilang
          sessionStorage.setItem("lontara_last_page", targetUrl);

          // Update UI Aktif
          document
            .querySelectorAll(".nav-link-ajax")
            .forEach((el) => el.classList.remove("active"));
          link.classList.add("active");

          this.loadContent(targetUrl);
        }
      },
      true,
    );
  },

  async loadContent(url) {
    if (!url) return;

    this.renderArea.innerHTML = `
            <div class="loader-placeholder">
                <div class="spinner"></div>
                <p>Sinkronisasi Data...</p>
            </div>
        `;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Gagal memuat ${url}`);

      const htmlContent = await response.text();
      this.renderArea.innerHTML = htmlContent;

      window.scrollTo({ top: 0, behavior: "smooth" });

      // Jalankan ulang fungsi animasi jika ada
      if (typeof window.reinitAnimations === "function") {
        window.reinitAnimations();
      }
    } catch (error) {
      console.error("Router Error:", error);
      this.renderArea.innerHTML = `<div class="container" style="padding: 100px 0; text-align:center;">
                <h2>Modul Tidak Ditemukan</h2>
                <p>Gagal memuat: ${url}</p>
                <button onclick="sessionStorage.clear(); location.reload();" class="btn-primary">Kembali ke Home</button>
            </div>`;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => AppShell.init());
