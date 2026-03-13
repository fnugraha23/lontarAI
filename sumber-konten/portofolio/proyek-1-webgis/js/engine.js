/* =====================================================
    WEBGIS DAS - ENGINE LOGIC (Leaflet Implementation)
    Fokus Wilayah: Sub DAS Tanralili, Sulawesi Selatan
   ===================================================== */

// 1. KONFIGURASI JALUR DATA
const DATA_PATH = "../../../aset/data/proyek-1/";

// 2. INISIALISASI PETA
var map = L.map("map", {
  scrollWheelZoom: false,
}).setView([-5.15, 119.8], 11);

map.on("focus", function () {
  map.scrollWheelZoom.enable();
});
map.on("blur", function () {
  map.scrollWheelZoom.disable();
});

// 3. DEFINISI BASEMAP
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
});

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles &copy; Esri" },
);

// Basemap satelit tetap aktif sebagai dasar
satellite.addTo(map);

var baseMaps = {
  OpenStreetMap: osm,
  "Satelit (Esri)": satellite,
};

var overlayMaps = {};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// 4. SISTEM LEGENDA OTOMATIS
var activeLegends = {};

function renderLegend() {
  var legend = document.getElementById("legend");
  legend.innerHTML = "";

  for (var layerName in activeLegends) {
    legend.innerHTML += `<h4>${layerName}</h4>`;

    activeLegends[layerName].forEach((item) => {
      legend.innerHTML += `
        <div class="legend-item">
          <span class="legend-color" style="background:${item.color}"></span>
          ${item.label}
        </div>
      `;
    });
  }
}

// 5. GENERATOR WARNA UNIK
function generateColors(values) {
  var palette = [
    "#1b9e77",
    "#d95f02",
    "#7570b3",
    "#e7298a",
    "#66a61e",
    "#e6ab02",
    "#a6761d",
    "#666666",
    "#1f78b4",
    "#b2df8a",
    "#fb9a99",
    "#fdbf6f",
  ];

  var colors = {};
  values.forEach((val, i) => {
    colors[val] = palette[i % palette.length];
  });

  return colors;
}

// 6. UPDATE PANEL INFORMASI
function updateInfo(properties) {
  var content = "<ul>";
  for (var key in properties) {
    content += `<li><b>${key}</b>: ${properties[key]}</li>`;
  }
  content += "</ul>";
  document.getElementById("info-content").innerHTML = content;
}

// 7. FUNGSI LOAD LAYER (GeoJSON Handler)
function loadUniqueLayer(path, fieldName, layerName) {
  fetch(path)
    .then((res) => {
      if (!res.ok) throw new Error("Gagal memuat data spasial: " + path);
      return res.json();
    })
    .then((data) => {
      var uniqueSet = {};
      data.features.forEach((f) => {
        uniqueSet[f.properties[fieldName]] = true;
      });

      var uniqueValues = Object.keys(uniqueSet);
      var colors = generateColors(uniqueValues);

      var layer = L.geoJSON(data, {
        style: function (feature) {
          return {
            fillColor: colors[feature.properties[fieldName]],
            color: "#333",
            weight: 1,
            fillOpacity: 0.7,
          };
        },

        onEachFeature: function (feature, layerObj) {
          layerObj.on({
            mouseover: function (e) {
              e.target.setStyle({ weight: 3, color: "#000" });
            },
            mouseout: function (e) {
              layer.resetStyle(e.target);
            },
            click: function (e) {
              updateInfo(feature.properties);
              map.fitBounds(e.target.getBounds());
            },
          });
        },
      });

      overlayMaps[layerName] = layer;
      layerControl.addOverlay(layer, layerName);

      layer.on("add", function () {
        activeLegends[layerName] = uniqueValues.map((val) => ({
          label: val,
          color: colors[val],
        }));
        renderLegend();
      });

      layer.on("remove", function () {
        delete activeLegends[layerName];
        renderLegend();
      });

      /* PERBAIKAN: Baris "layer.addTo(map)" dihapus agar layer 
         tidak aktif secara otomatis saat awal dibuka.
      */
    })
    .catch((err) => console.error(err));
}

// 8. EKSEKUSI PEMUATAN DATA
loadUniqueLayer(
  DATA_PATH + "PL_KLHK_2024.geojson",
  "PL_2024",
  "Tutupan Lahan (LULC)",
);
loadUniqueLayer(
  DATA_PATH + "Geologi_Regional_ESDM.geojson",
  "FORMASI",
  "Geologi Regional",
);
