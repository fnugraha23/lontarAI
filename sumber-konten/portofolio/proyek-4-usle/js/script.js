/**
 * =========================================================
 * LONTARA-USLE v2.2: Master Controller Logic
 * Author: Fajar Nugraha (Master of Soil Science)
 * Feature: GEE Integration, AOI Analytics, & PDF Reporting
 * =========================================================
 */

// 1. KONFIGURASI API (URL BACKEND KOYEB)
const API_URL = "https://additional-beilul-ipb-a5dd39e7.koyeb.app";

// Inisialisasi variabel global agar bisa diakses antar fungsi
let map, tiles, drawnItems, drawControl, activeGeeLayer;
let selectedAOI = null;

// Memastikan DOM dan Library (Leaflet) sudah siap sebelum skrip berjalan
document.addEventListener("DOMContentLoaded", function () {
  // 2. INISIALISASI PETA
  map = L.map("map", {
    center: [-2.5, 118.0], // Fokus Indonesia
    zoom: 5,
    zoomControl: false,
  });

  // 3. DEFINISI BASEMAP LAYERS
  tiles = {
    satellite: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Esri &copy; Lontara-USLE" },
    ),
    street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap",
    }),
    light: L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: "CartoDB" },
    ),
    terrain: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Esri Terrain Base" },
    ),
  };

  // Pasang Basemap Awal & Kontrol Zoom
  tiles.satellite.addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // 5. KONFIGURASI DRAWING AOI (Area of Interest)
  drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  drawControl = new L.Control.Draw({
    edit: { featureGroup: drawnItems },
    draw: {
      polygon: { shapeOptions: { color: "#00b8a9", fillOpacity: 0.2 } },
      rectangle: { shapeOptions: { color: "#00b8a9", fillOpacity: 0.2 } },
      circle: false,
      circlemarker: false,
      polyline: false,
      marker: false,
    },
  });
  map.addControl(drawControl);

  // EVENT: Saat Wilayah Selesai Digambar
  map.on(L.Draw.Event.CREATED, function (e) {
    drawnItems.clearLayers();
    const layer = e.layer;
    drawnItems.addLayer(layer);
    selectedAOI = layer.toGeoJSON().geometry;
    map.fitBounds(layer.getBounds());

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Wilayah Berhasil Ditentukan!",
      showConfirmButton: false,
      timer: 2000,
    });
  });

  // 6. IDENTIFY TOOL: KLIK PETA UNTUK CEK NILAI PIKSEL
  map.on("click", async (e) => {
    if (!activeGeeLayer) return;

    const { lat, lng } = e.latlng;
    const factor = document.getElementById("factorSelect").value;

    const loadingPopup = L.popup()
      .setLatLng(e.latlng)
      .setContent(
        '<div style="text-align:center;"><i class="fas fa-sync fa-spin"></i> Mengambil nilai...</div>',
      )
      .openOn(map);

    try {
      const response = await fetch(`${API_URL}/api/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, factor }),
      });
      const data = await response.json();

      loadingPopup.setContent(`
                <div style="text-align:center; min-width:120px;">
                    <b style="color:#123b3a; font-size:0.7rem;">NILAI ${factor.toUpperCase()}:</b><br>
                    <span style="font-size:1.2rem; font-weight:700; color:#00b8a9;">${data.value.toFixed(4)}</span>
                </div>
            `);
    } catch (err) {
      loadingPopup.setContent("Gagal mengambil data piksel.");
    }
  });
});

// 4. LOGIKA BASEMAP GALLERY (Didaftarkan ke window agar bisa dipanggil onclick dari HTML)
window.toggleBasemapGallery = function () {
  const gallery = document.getElementById("basemapGallery");
  if (gallery) {
    gallery.style.display =
      gallery.style.display === "none" || gallery.style.display === ""
        ? "flex"
        : "none";
  }
};

window.changeBasemap = function (type, element) {
  if (!tiles || !map) return;

  Object.values(tiles).forEach((layer) => map.removeLayer(layer));
  tiles[type].addTo(map);

  document
    .querySelectorAll(".basemap-item")
    .forEach((item) => item.classList.remove("active"));
  element.classList.add("active");

  setTimeout(() => {
    window.toggleBasemapGallery();
  }, 500);
};

// 7. FUNGSI ANALISIS UTAMA (RUN ANALYSIS)
window.runAnalysis = async function () {
  if (!selectedAOI) {
    return Swal.fire({
      icon: "warning",
      title: "AOI Belum Digambar",
      text: "Silakan gunakan alat gambar di peta untuk memilih wilayah analisis.",
      confirmButtonColor: "#00b8a9",
    });
  }

  const factor = document.getElementById("factorSelect").value;
  const year = document.getElementById("yearInput").value;
  const btn = document.getElementById("btnRun");

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES GEE...';

  try {
    const response = await fetch(`${API_URL}/api/process-${factor}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aoi: selectedAOI, year: year }),
    });

    const data = await response.json();

    if (data.status === "success") {
      if (activeGeeLayer) map.removeLayer(activeGeeLayer);
      activeGeeLayer = L.tileLayer(data.tile_url).addTo(map);

      document.getElementById("infoBox").style.display = "block";
      document.getElementById("legendBox").style.display = "block";

      document.getElementById("valMin").innerText = data.stats.min.toFixed(4);
      document.getElementById("valMax").innerText = data.stats.max.toFixed(4);

      updateLegendVisuals(factor);
      if (factor === "a") updateErosionClassification(data.stats.max);
      else document.getElementById("valClass").innerText = "-";

      Swal.fire({
        icon: "success",
        title: "Analisis Selesai!",
        text: `Data ${factor.toUpperCase()} berhasil diproses via GEE Cloud.`,
        confirmButtonColor: "#123b3a",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Menghubungkan Backend",
      text: "Pastikan service di Koyeb dalam status 'Healthy'.",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-play"></i> JALANKAN ANALISIS';
  }
};

// 8. HELPER: SINKRONISASI LEGENDA & KLASIFIKASI EROSI
function updateLegendVisuals(factor) {
  const ramp = document.getElementById("colorRamp");
  const title = document.getElementById("legendTitle");

  const configs = {
    r: {
      name: "Erosivitas (R)",
      gradient: "linear-gradient(to right, #eff3ff, #08519c)",
    },
    k: {
      name: "Erodibilitas (K)",
      gradient: "linear-gradient(to right, #f7fcf5, #006d2c)",
    },
    ls: {
      name: "Topografi (LS)",
      gradient: "linear-gradient(to right, #fff5f0, #99000d)",
    },
    c: {
      name: "Tutupan Lahan (C)",
      gradient: "linear-gradient(to right, #1a9850, #d73027)",
    },
    a: {
      name: "Erosi Total (A)",
      gradient: "linear-gradient(to right, #ffffb2, #bd0026)",
    },
  };

  if (ramp && title) {
    title.innerText = configs[factor].name;
    ramp.style.background = configs[factor].gradient;
  }
}

function updateErosionClassification(maxErosion) {
  let category = "Sangat Ringan";
  if (maxErosion > 480) category = "Sangat Berat";
  else if (maxErosion > 180) category = "Berat";
  else if (maxErosion > 60) category = "Sedang";
  else if (maxErosion > 15) category = "Ringan";

  document.getElementById("valClass").innerText = category;
}

// 9. FUNGSI CETAK LAPORAN
window.prepareAndPrint = function () {
  const now = new Date();
  const printDateElement = document.getElementById("printDate");
  if (printDateElement) {
    printDateElement.innerText = now.toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });
  }
  window.print();
};
