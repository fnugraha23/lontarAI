/* ==========================================================================
   LONTARA GEO-INTELLIGENCE — MAP ENGINE (GEE EDITION)
   Folder: sumber-konten/portofolio/proyek-3-geengine/js/map.js
   Fungsi: Inisiasi Leaflet, Drawing AOI, & Rendering Cloud Computing Tiles
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. INISIASI PETA & DARK BASEMAPS
  // ==========================================

  // Koordinat fokus: Sub-DAS Tanralili, Sulawesi Selatan
  const map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true,
  }).setView([-5.15, 119.55], 11);

  // Re-posisi Zoom Control agar tidak mengganggu panel sidebar
  L.control.zoom({ position: "topright" }).addTo(map);

  // Basemap 1: CartoDB Dark Matter (Optimal untuk kontras Citra Satelit)
  const darkMatter = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OSM &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 20,
    },
  );

  // Basemap 2: Citra Satelit Esri (Referensi Visual Lapangan)
  const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri &mdash; Lontara Environmental Studio",
      maxZoom: 19,
    },
  );

  // Basemap 3: OpenStreetMap (Standard)
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap",
    },
  );

  // Set Default Layer
  darkMatter.addTo(map);

  const baseMaps = {
    "Technical Dark": darkMatter,
    "Satellite Imagery": satellite,
    "Standard Map": osm,
  };

  L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

  // ==========================================
  // 2. KONTROL MENGGAMBAR (LEAFLET.DRAW)
  // ==========================================

  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    position: "topleft",
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
    draw: {
      polygon: {
        allowIntersection: false, // Penting: GEE membutuhkan poligon bersih (tidak melilit)
        shapeOptions: {
          color: "#00b8a9", // Lontara Teal
          weight: 3,
          fillOpacity: 0.1,
        },
      },
      rectangle: {
        shapeOptions: {
          color: "#00b8a9",
          weight: 3,
          fillOpacity: 0.1,
        },
      },
      // Fitur garis/titik dinonaktifkan karena GEE diprogram untuk AOI Poligon
      polyline: false,
      circle: false,
      marker: false,
      circlemarker: false,
    },
  });
  map.addControl(drawControl);

  // ==========================================
  // 3. VARIABEL GLOBAL (INTEGRASI API.JS)
  // ==========================================
  window.currentAOI = null;
  window.geeResultLayer = null;

  // ==========================================
  // 4. FUNGSI UPDATE UI SIDEBAR
  // ==========================================
  function updateSidebarUI(hasAOI) {
    const btnProcess = document.getElementById("btnProcess");
    const btnText = document.getElementById("btnText");
    const hintBox = document.getElementById("aoiStatus");
    const resultPanel = document.getElementById("resultPanel");

    if (hasAOI) {
      if (btnProcess) btnProcess.disabled = false;
      if (btnText) btnText.innerText = "JALANKAN ANALISIS";
      if (hintBox) {
        hintBox.classList.add("active");
        hintBox.innerHTML =
          "<strong>✅ AOI TERDETEKSI</strong><br>Area siap dikirim ke Cloud Engine.";
      }
    } else {
      if (btnProcess) btnProcess.disabled = true;
      if (btnText) btnText.innerText = "TENTUKAN AOI DULU";
      if (hintBox) {
        hintBox.classList.remove("active");
        hintBox.innerHTML =
          "<strong>1. Tentukan Area (AOI)</strong><br>Gunakan alat poligon di pojok kiri atas.";
      }
      if (resultPanel) resultPanel.style.display = "none";
    }
  }

  // ==========================================
  // 5. EVENT LISTENERS (DRAWING INTERACTION)
  // ==========================================

  map.on(L.Draw.Event.CREATED, function (e) {
    // Reset AOI lama (Hanya mengizinkan 1 AOI aktif untuk efisiensi backend)
    drawnItems.clearLayers();

    const layer = e.layer;
    drawnItems.addLayer(layer);

    // Ekspor ke GeoJSON untuk dikirim ke Koyeb
    window.currentAOI = layer.toGeoJSON();
    updateSidebarUI(true);

    console.log("📍 LontaraGeo: AOI Terdaftar.");
  });

  map.on(L.Draw.Event.EDITED, function (e) {
    drawnItems.eachLayer(function (layer) {
      window.currentAOI = layer.toGeoJSON();
    });
    // Sembunyikan panel metadata lama jika area diubah
    const resPanel = document.getElementById("resultPanel");
    if (resPanel) resPanel.style.display = "none";
  });

  map.on(L.Draw.Event.DELETED, function (e) {
    if (drawnItems.getLayers().length === 0) {
      window.currentAOI = null;
      // Hapus visualisasi citra satelit jika AOI dihapus
      if (window.geeResultLayer) {
        map.removeLayer(window.geeResultLayer);
        window.geeResultLayer = null;
      }
      updateSidebarUI(false);

      // Sembunyikan legenda
      const legend = document.getElementById("mapLegend");
      if (legend) legend.style.display = "none";
    }
  });

  // ==========================================
  // 6. RENDER GEE TILES (DIPANGGIL OLEH API.JS)
  // ==========================================
  window.renderGEELayer = function (tileUrl) {
    // Bersihkan hasil analisis sebelumnya
    if (window.geeResultLayer) {
      map.removeLayer(window.geeResultLayer);
    }

    // Buat layer baru dari URL yang dikirim oleh backend Koyeb
    window.geeResultLayer = L.tileLayer(tileUrl, {
      attribution:
        'Satelit &copy; <a href="https://earthengine.google.com/">Google Earth Engine</a>',
      maxZoom: 19,
      opacity: 0.85,
    }).addTo(map);

    // Pastikan layer hasil berada di tumpukan paling atas
    window.geeResultLayer.bringToFront();

    // Tampilkan Legenda Berdasarkan Indeks yang Dipilih
    const select = document.getElementById("indexSelect");
    const colors = select.options[select.selectedIndex].dataset.colors;
    const legend = document.getElementById("mapLegend");
    const legendBar = document.getElementById("legendBar");

    if (colors && legend && legendBar) {
      legendBar.style.background = `linear-gradient(to right, ${colors})`;
      legend.style.display = "block";
    }

    console.log("🛰️ LontaraGeo: Citra GEE Berhasil Dirender.");
  };
});
