/* ========================================================
    LONTARA DASHBOARD - MAP ENGINE
    Fungsi: Manajemen Spasial Sub-DAS Tanralili
    Integrasi: Leaflet.js & Lontara Intelligence API
   ======================================================== */

// 1. KONFIGURASI JALUR DATA (Keluar dari js/ -> proyek/ -> portofolio/ -> konten/ -> root)
const DATA_PATH_P2 = "../../../../aset/data/proyek-2/";

// 2. INISIALISASI PETA
// Fokus pada koordinat outlet Sub-DAS Tanralili, Sulawesi Selatan
const map = L.map("map", {
  scrollWheelZoom: false,
}).setView([-5.15, 119.55], 11);

// UX Zoom Management
map.on("focus", () => map.scrollWheelZoom.enable());
map.on("blur", () => map.scrollWheelZoom.disable());

// 3. PILIHAN BASEMAP (WB Standard)
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors | Lontara",
});

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 18,
    attribution: "Tiles &copy; Esri &mdash; Watershed Analytics",
  },
);

satellite.addTo(map); // Default basemap Satelit

const baseMaps = {
  OpenStreetMap: osm,
  "Citra Satelit": satellite,
};
L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

// 4. LOGIKA PEWARNAAN (Berdasarkan Hasil Prediksi Machine Learning)
function getColor(kelasLahan) {
  switch (kelasLahan) {
    case "Hutan":
      return "#123b3a"; // Lontara Green
    case "Pertanian Campuran":
      return "#ca8a04"; // Mustard
    case "Pemukiman":
      return "#dc2626"; // Red Danger
    case "Semak Belukar":
      return "#00b8a9"; // Lontara Teal
    case "Sawah":
      return "#22c55e"; // Light Green
    default:
      return "#94a3b8"; // Slate Gray
  }
}

// 5. STYLE POLIGON
function stylePoligon(feature) {
  return {
    fillColor: getColor(feature.properties.kelas_lahan),
    weight: 1.5,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.65,
  };
}

// 6. INTERAKSI & POPUP
let geojsonLayer;

function onEachFeature(feature, layer) {
  if (feature.properties) {
    let popupContent = `
            <div style="font-family: 'Manrope', sans-serif; min-width: 200px;">
                <h4 style="color: #123b3a; border-bottom: 2px solid #00b8a9; padding-bottom: 5px; margin-bottom: 10px; font-weight: 800; font-size: 0.9rem;">
                    ANALISIS AREA [ML-READY]
                </h4>
                <table style="width: 100%; font-size: 0.8rem; line-height: 1.6;">
                    <tr><td style="font-weight: 700; color: #64748b;">Land Use:</td><td style="text-align: right;">${feature.properties.kelas_lahan}</td></tr>
                    <tr><td style="font-weight: 700; color: #64748b;">Luas (Ha):</td><td style="text-align: right;">${feature.properties.luas}</td></tr>
                    <tr><td style="font-weight: 700; color: #64748b;">Limpasan (C):</td><td style="text-align: right; color: #00b8a9; font-weight: 800;">${feature.properties.koefisien_limpasan}</td></tr>
                </table>
            </div>
        `;
    layer.bindPopup(popupContent);
  }

  layer.on({
    mouseover: function (e) {
      let l = e.target;
      l.setStyle({
        weight: 3,
        color: "#123b3a",
        fillOpacity: 0.85,
      });
      l.bringToFront();
    },
    mouseout: function (e) {
      geojsonLayer.resetStyle(e.target);
    },
    click: function (e) {
      map.fitBounds(e.target.getBounds());

      // INTEGRASI DENGAN charts.js
      // Memperbarui grafik secara dinamis saat area diklik
      if (typeof window.updateDashboardCharts === "function") {
        window.updateDashboardCharts(feature.properties);
      }
    },
  });
}

// 7. LOAD DATA SPASIAL (GeoJSON)
fetch(DATA_PATH_P2 + "batas_subdas.geojson")
  .then((response) => {
    if (!response.ok) throw new Error("Gagal memuat batas_subdas.geojson");
    return response.json();
  })
  .then((data) => {
    geojsonLayer = L.geoJSON(data, {
      style: stylePoligon,
      onEachFeature: onEachFeature,
    }).addTo(map);

    // Menyesuaikan zoom ke seluruh wilayah Sub-DAS Tanralili secara otomatis
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch((error) => {
    console.warn("Sistem menggunakan marker fallback. Detail:", error);

    // Marker Fallback di Outlet Sub-DAS Tanralili
    L.marker([-5.15, 119.55])
      .addTo(map)
      .bindPopup(
        "<b>Outlet Sub-DAS Tanralili</b><br>Menunggu unggahan data spasial.",
      )
      .openPopup();
  });
