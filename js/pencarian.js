/**
 * LONTARA — SPATIAL SEARCH RADAR
 * Sistem pencarian internal untuk arsitektur SPA Lontara.
 */

const SearchRadar = {
  // 1. DATA INDEKS (Database lokal untuk pencarian)
  // Tambahkan keyword di sini jika ingin hasil lebih akurat
  database: [
    {
      title: "Pemodelan Hidrologi & DAS",
      desc: "Analisis respon hidrologis, prediksi debit, dan manajemen sub-DAS.",
      url: "sumber-konten/layanan/layanan.html",
      category: "Layanan",
      keywords: ["air", "sungai", "banjir", "tanralili", "hujan"],
    },
    {
      title: "Evaluasi Kesesuaian Lahan",
      desc: "Analisis spasial untuk penentuan komoditas pertanian dan tata ruang.",
      url: "sumber-konten/layanan/layanan.html",
      category: "Layanan",
      keywords: ["tanah", "pertanian", "tata ruang", "land suitability"],
    },
    {
      title: "Machine Learning Spasial",
      desc: "Implementasi algoritma RF, SVM, dan CNN untuk klasifikasi tutupan lahan.",
      url: "sumber-konten/layanan/layanan.html",
      category: "Layanan",
      keywords: ["python", "random forest", "sentinel", "citra satelit"],
    },
    {
      title: "Tesis: Arahan Lahan Sub-DAS Tanralili",
      desc: "Riset penggunaan ML untuk perbaikan kinerja DAS di Sulawesi Selatan.",
      url: "sumber-konten/publikasi/publikasi.html",
      category: "Publikasi",
      keywords: ["ipb", "tesis", "fajar nugraha", "machine learning"],
    },
    {
      title: "Toolbox Klasifikasi Lereng",
      desc: "Aset premium untuk ArcGIS 10.4 - 10.8 guna klasifikasi lereng otomatis.",
      url: "sumber-konten/aset-digital/aset-digital.html",
      category: "Aset Digital",
      keywords: ["toolbox", "arcgis", "slope", "lereng", "otomasi"],
    },
    {
      title: "Batas Administrasi Indonesia",
      desc: "Dataset SHP batas wilayah administrasi terstandarisasi.",
      url: "sumber-konten/aset-digital/aset-digital.html",
      category: "Aset Digital",
      keywords: ["shp", "peta", "administrasi", "gratis"],
    },
    {
      title: "Tentang Fajar Nugraha",
      desc: "Profil founder Lontara, alumni Unhas & IPB University.",
      url: "sumber-konten/tentang/tentang.html",
      category: "Profil",
      keywords: ["founder", "engineer", "ilmu tanah", "makassar"],
    },
  ],

  init() {
    console.log("Lontara Search Radar: Online");
    this.searchForm = document.getElementById("search-form");
    this.renderArea = document.getElementById("render-konten");

    if (this.searchForm) {
      this.searchForm.addEventListener("submit", (e) => this.handleSearch(e));
    }
  },

  handleSearch(e) {
    e.preventDefault();
    const query = e.target.querySelector("input").value.toLowerCase().trim();

    if (query.length < 2) return;

    // Update URL secara virtual tanpa reload
    window.history.pushState({}, "", `?q=${encodeURIComponent(query)}`);

    // Lakukan pencarian
    const results = this.database.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.keywords.some((k) => k.includes(query))
      );
    });

    this.renderResults(results, query);
  },

  renderResults(results, query) {
    let html = `
            <section class="hero" style="min-height: 30vh; padding-bottom: 40px;">
                <div class="container hero-content">
                    <h1>Hasil Radar: "${query}"</h1>
                    <p>Ditemukan ${results.length} referensi intelijen spasial yang relevan.</p>
                </div>
            </section>
            <section class="section">
                <div class="container" style="max-width: 800px;">
        `;

    if (results.length > 0) {
      results.forEach((item) => {
        html += `
                    <div class="card reveal-init" style="margin-bottom: 20px; border-left: 4px solid var(--primary); padding: 1.5rem 2rem;">
                        <span style="font-size: 0.7rem; font-weight: 800; color: var(--accent); text-transform: uppercase;">${item.category}</span>
                        <h3 style="margin: 10px 0;">${item.title}</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 15px;">${item.desc}</p>
                        <a href="${item.url}" class="nav-link-ajax" style="color: var(--primary); font-weight: 700; text-decoration: none; font-size: 0.9rem;">
                            Buka Modul &rarr;
                        </a>
                    </div>
                `;
      });
    } else {
      html += `
                <div style="text-align: center; padding: 50px 0;">
                    <i class="fa-solid fa-satellite-dish" style="font-size: 3rem; color: var(--border); margin-bottom: 20px;"></i>
                    <h3>Sinyal Tidak Terdeteksi</h3>
                    <p style="color: var(--text-muted);">Coba gunakan kata kunci lain seperti "hidrologi", "tanah", atau "python".</p>
                </div>
            `;
    }

    html += `</div></section>`;

    // Suntikkan hasil ke area render utama
    this.renderArea.innerHTML = html;

    // Reset animasi scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof window.reinitAnimations === "function") {
      window.reinitAnimations();
    }
  },
};

// Jalankan radar
document.addEventListener("DOMContentLoaded", () => SearchRadar.init());
