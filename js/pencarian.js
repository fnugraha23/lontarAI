/**
 * LONTARA — SPATIAL SEARCH RADAR
 * Sistem pencarian internal untuk arsitektur SPA Lontara.
 */

const SearchRadar = {
  // 1. DATA INDEKS (Database lokal untuk pencarian)
  // Tambahkan keyword di sini jika ingin hasil lebih akurat
  database: [
    [
      // Layanan
      {
        title: "Pemodelan Hidrologi & DAS",
        desc: "Analisis respon hidrologis, prediksi debit, dan manajemen sub-DAS.",
        url: "sumber-konten/layanan/layanan.html",
        category: "Layanan",
        keywords: [
          "air",
          "sungai",
          "banjir",
          "tanralili",
          "hujan",
          "pemodelan",
          "prediksi",
          "klasifikasi",
          "hidrologi",
          "das",
          "daerah aliran sungai",
          "aliran sungai",
          "sungai",
          "area tangkapan",
        ],
      },
      {
        title: "Evaluasi Kesesuaian Lahan",
        desc: "Analisis spasial untuk penentuan komoditas pertanian dan tata ruang.",
        url: "sumber-konten/layanan/layanan.html",
        category: "Layanan",
        keywords: [
          "tanah",
          "pertanian",
          "tata ruang",
          "land suitability",
          "kesesuaian lahan",
          "kemampuan lahan",
          "kesesuaian",
          "kemampuan",
          "mce",
          "mdcm",
          "matching",
        ],
      },
      {
        title: "Machine Learning Spasial",
        desc: "Implementasi algoritma RF, SVM, dan CNN untuk klasifikasi tutupan lahan.",
        url: "sumber-konten/layanan/layanan.html",
        category: "Layanan",
        keywords: [
          "python",
          "random forest",
          "sentinel",
          "citra satelit",
          "ml",
          "machine learning",
          "deep learning",
          "deeplearning",
          "deeplearning",
          "artificial neural network",
          "svm",
          "rf",
          "ann",
        ],
      },
      {
        title: "Pengembangan WebGIS",
        desc: "Pembuatan WebGIS statis dan dinamis menggunakan berbagai bahasa pemrograman seperti HTML, CSS, JavaScript, NodeJS.",
        url: "sumber-konten/layanan/layanan.html",
        category: "Layanan",
        keywords: [
          "html",
          "python",
          "webgis",
          "css",
          "javascript",
          "java script",
          "web gis",
          "statis",
          "dinamis",
        ],
      },
      // Portofolio
      {
        title: "Dashboard WebGIS Interaktif",
        desc: "Visualisasi interaktif data geologi dan penutupan lahan Sub-DAS Tanralili secara statis.",
        url: "sumber-konten/portofolio/proyek-1-webgis/overview-proyek-1.html",
        category: "Portofolio",
        keywords: [
          "webgis",
          "web gis",
          "dashboard",
          "interaktif",
          "Tanralili",
          "sub das",
          "geologi",
          "penutupan lahan",
          "lahan",
          "penutupan",
          "penggunaan",
          "statis",
        ],
      },
      {
        title: "Dashboard WebGIS World Bank",
        desc: "Dashboard WebGIS statis dan menarik untuk menyajikan data spasial World Bank.",
        url: "sumber-konten/portofolio/proyek-1-webgis/overview-proyek-2.html",
        category: "Portofolio",
        keywords: [
          "webgis",
          "web gis",
          "dashboard",
          "interaktif",
          "world",
          "bank",
          "menarik",
          "wb",
          "statis",
        ],
      },
      {
        title: "WebGIS Analisis Indeks Spektral",
        desc: "Analisis dinamis indeks spektral citra satelit Sentinel dan Landsat menggunakan Google Earth Engine.",
        url: "sumber-konten/portofolio/proyek-1-webgis/overview-proyek-3.html",
        category: "Portofolio",
        keywords: [
          "webgis",
          "web gis",
          "dashboard",
          "interaktif",
          "dinamis",
          "sentinel",
          "landsat",
          "indeks",
          "index",
          "spektral",
          "gee",
          "google earth engine",
          "big",
          "data",
          "citra",
          "satelit",
        ],
      },
      {
        title: "WebGIS Analisis Erosi USLE",
        desc: "Platform interaktif untuk perhitungan laju erosi metode USLE berdasarkan faktor tanah, hidrologi, dan lereng.",
        url: "sumber-konten/portofolio/proyek-1-webgis/overview-proyek-4.html",
        category: "Portofolio",
        keywords: [
          "webgis",
          "web gis",
          "dashboard",
          "interaktif",
          "dinamis",
          "sentinel",
          "landsat",
          "indeks",
          "index",
          "spektral",
          "gee",
          "google earth engine",
          "big",
          "data",
          "citra",
          "satelit",
          "usle",
          "erosi",
          "erosivitas",
          "erodibilitas",
          "lereng",
          "panjang lereng",
          "tanah",
          "air",
          "hidrologi",
        ],
      },
      {
        title: "WebGIS Kalkulator Ilmu Tanah",
        desc: "Kalkulator dinamis untuk perhitungan sifat fisik, kimia tanah, dan evaluasi kesesuaian lahan berbasis big data.",
        url: "sumber-konten/portofolio/proyek-1-webgis/overview-proyek-5.html",
        category: "Portofolio",
        keywords: [
          "interaktif",
          "dinamis",
          "big",
          "data",
          "usle",
          "erosi",
          "erosivitas",
          "erodibilitas",
          "lereng",
          "panjang lereng",
          "fisika",
          "tanah",
          "air",
          "hidrologi",
          "karbon",
          "evaluasi",
          "kesuaian",
          "kemampuan",
          "lahan",
          "kimia",
          "panjang lereng",
          "database",
        ],
      },
      // Artikel
      {
        title: "Pengantar Sistem Informasi Geografis (GIS)",
        desc: "Mempelajari konsep dasar, pengertian, dan pengenalan awal mengenai Sistem Informasi Geografis (GIS).",
        url: "sumber-konten/artikel/gis-dasar.html",
        category: "Artikel",
        keywords: [
          "gis",
          "pendahuluan",
          "pengantar",
          "spasial",
          "dasar",
          "pengertian",
          "artikel",
        ],
      },
      {
        title: "Memahami Format Data Spasial: Vektor vs Raster",
        desc: "Penjelasan karakteristik dan perbedaan format data spasial vektor (shapefile) dan raster (pixel/citra).",
        url: "sumber-konten/artikel/data-spasial.html",
        category: "Artikel",
        keywords: [
          "gis",
          "spasial",
          "artikel",
          "data",
          "vector",
          "raster",
          "dem",
          "shapefile",
          "pixel",
          "citra",
          "satelit",
        ],
      },
      {
        title: "Panduan Sistem Koordinat & Proyeksi Peta (CRS)",
        desc: "Panduan komprehensif memahami sistem koordinat, garis lintang-bujur, dan proyeksi peta seperti UTM dan Mercator.",
        url: "sumber-konten/artikel/proyeksi.html",
        category: "Artikel",
        keywords: [
          "gis",
          "spasial",
          "artikel",
          "data",
          "sistem koordinat",
          "crs",
          "bujur",
          "lintang",
          "latitude",
          "longitude",
          "utm",
          "mercator",
        ],
      },
      {
        title: "Alur Kerja (Workflow) Standar Analisis Spasial",
        desc: "Tahapan dan alur kerja (workflow) terstruktur yang digunakan dalam melakukan analisis data spasial.",
        url: "sumber-konten/artikel/workflow.html",
        category: "Artikel",
        keywords: ["gis", "spasial", "artikel", "data", "workflow", "analisis"],
      },
      // Publikasi
      {
        title: "Tesis: Arahan Lahan Sub-DAS Tanralili",
        desc: "Riset penggunaan ML untuk perbaikan kinerja DAS di Sulawesi Selatan.",
        url: "sumber-konten/publikasi/publikasi.html",
        category: "Publikasi",
        keywords: [
          "ipb",
          "tesis",
          "fajar nugraha",
          "machine learning",
          "arahan",
          "das",
          "tanralili",
          "penggunaan",
          "penutupan",
          "lahan",
          "ml",
          "machinelearning",
          "kinerja",
          "klasifikasi",
          "prediksi",
          "qgis",
        ],
      },
      {
        title: "Skripsi: Dampak Perubahan LULC Sub-DAS Tanralili",
        desc: "Kajian hidrologi mengenai dampak perubahan penutupan dan penggunaan lahan terhadap debit aliran sungai.",
        url: "sumber-konten/publikasi/publikasi.html",
        category: "Publikasi",
        keywords: [
          "unhas",
          "skripsi",
          "fajar nugraha",
          "hidrologi",
          "debit",
          "tanralili",
          "das",
          "penutupan",
          "penggunaan",
          "lahan",
        ],
      },
      {
        title: "Artikel: Klasifikasi dan Prediksi Penggunaan Lahan",
        desc: "Penelitian pemanfaatan Machine Learning dan QGIS untuk klasifikasi serta prediksi penutupan lahan secara otomatis.",
        url: "sumber-konten/publikasi/publikasi.html",
        category: "Publikasi",
        keywords: [
          "ipb",
          "jurnal",
          "fajar nugraha",
          "machine learning",
          "artikel",
          "machinelearning",
          "ml",
          "penggunaan",
          "penutupan",
          "lahan",
          "qgis",
        ],
      },
      {
        title:
          "Artikel: Hidrograf untuk Menilai Dampak Perubahan LULC Sub-DAS Tanralili",
        desc: "Analisis pemodelan hidrograf untuk mengevaluasi dampak pergeseran penggunaan lahan terhadap ketersediaan air.",
        url: "sumber-konten/publikasi/publikasi.html",
        category: "Publikasi",
        keywords: [
          "unhas",
          "jurnal",
          "fajar nugraha",
          "hidrologi",
          "debit",
          "tanralili",
          "das",
          "penutupan",
          "penggunaan",
          "lahan",
          "hidrograf",
        ],
      },
      // Aset Digital
      {
        title: "Toolbox Klasifikasi Lereng",
        desc: "Aset premium untuk ArcGIS 10.4 - 10.8 guna klasifikasi lereng otomatis.",
        url: "sumber-konten/aset-digital/aset-digital.html",
        category: "Aset Digital",
        keywords: [
          "toolbox",
          "arcgis",
          "slope",
          "lereng",
          "otomasi",
          "arcpy",
          "premium",
          "berbayar",
          "lisensi",
        ],
      },
      {
        title: "Batas Administrasi Indonesia",
        desc: "Dataset SHP batas wilayah administrasi terstandarisasi.",
        url: "sumber-konten/aset-digital/aset-digital.html",
        category: "Aset Digital",
        keywords: [
          "shp",
          "peta",
          "administrasi",
          "gratis",
          "big",
          "gratis",
          "shapefile",
          "dasar",
          "basemap",
          "download",
        ],
      },
      // Tentang
      {
        title: "Visi dan Misi Kami",
        desc: "Profil founder Lontara, alumni Unhas & IPB University.",
        url: "sumber-konten/tentang/tentang.html",
        category: "Profil",
        keywords: ["visi", "misi", "lontara", "profil"],
      },
      {
        title: "Tentang Fajar Nugraha",
        desc: "Mengenal lebih dekat profil Fajar Nugraha, engineer dan ahli ilmu tanah di balik Lontara.",
        url: "sumber-konten/tentang/tentang.html",
        category: "Profil",
        keywords: ["founder", "engineer", "ilmu tanah", "makassar"],
      },
      {
        title: "Teknologi Lontara",
        desc: "Penerapan teknologi komputasi, geospasial, dan IoT, dari WebGIS hingga Machine Learning.",
        url: "sumber-konten/tentang/tentang.html",
        category: "Profil",
        keywords: [
          "geospasial",
          "data",
          "komputasi",
          "iot",
          "internet of things",
          "kreatif",
          "ui",
          "ux",
          "ui/ux",
          "arcgis",
          "qgis",
          "google earth engine",
          "gee",
          "python",
          "R language",
          "machine learning",
          "ml",
          "arduino",
        ],
      },
      // Kontak
      {
        title: "Lokasi Studio",
        desc: "Informasi lengkap mengenai alamat dan titik lokasi studio Lontara di Makassar, Sulawesi Selatan.",
        url: "sumber-konten/kontak/kontak.html",
        category: "Kontak",
        keywords: ["lokasi", "studio", "makassar", "sulawesi", "selatan"],
      },
      {
        title: "Sosial Media",
        desc: "Terhubung dan berdiskusi dengan kami melalui LinkedIn, Instagram, WhatsApp, atau Email.",
        url: "sumber-konten/kontak/kontak.html",
        category: "Kontak",
        keywords: ["linkedin", "instagram", "wa", "whatsapp", "mail", "email"],
      },
      {
        title: "Formulir Pertanyaan",
        desc: "Kirimkan pertanyaan, feedback, atau penawaran kerja sama Anda langsung melalui formulir kontak kami.",
        url: "sumber-konten/kontak/kontak.html",
        category: "Kontak",
        keywords: ["form", "pertanyaan", "pesan"],
      },
    ],
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
