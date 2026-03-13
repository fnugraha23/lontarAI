/* ==========================================================================
   LontaraGeo Engine - API Controller
   Folder: frontend/js/api.js
   Fungsi: Menangani HTTP Request ke Backend Python (Google Earth Engine)
   Kontributor: Fajar Nugraha - Lontara Environmental Studio
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // --- KONFIGURASI API ---
    // Menggunakan URL Produksi dari Koyeb
    const API_URL = "https://historical-eleanor-lontara-2cc788bd.koyeb.app/api/process-image";
    
    // Matikan mode Mock jika sudah siap terhubung ke backend asli
    const USE_MOCK_API = false;

    // Referensi Elemen UI
    const btnProcess = document.getElementById("btnProcess");
    const btnText = document.getElementById("btnText");
    const processLoader = document.getElementById("processLoader");
    const resultPanel = document.getElementById("resultPanel");

    /**
     * Listener untuk tombol analisis
     */
    btnProcess.addEventListener("click", async function () {
        // 1. Validasi Area of Interest (AOI)
        if (!window.currentAOI) {
            alert("⚠️ Area Belum Ditentukan: Silakan gambar poligon (AOI) di peta terlebih dahulu.");
            return;
        }

        // 2. Persiapkan Data Payload untuk dikirim ke Python/GEE
        const payloadData = {
            aoi: window.currentAOI.geometry.coordinates,
            satellite: document.getElementById("satelliteSelect").value,
            startDate: document.getElementById("startDate").value,
            endDate: document.getElementById("endDate").value,
            cloudCover: parseInt(document.getElementById("cloudCover").value) || 20,
            indexType: document.getElementById("indexSelect").value,
            cloudMask: document.getElementById("cloudMask") ? document.getElementById("cloudMask").checked : true,
            waterMask: document.getElementById("waterMask") ? document.getElementById("waterMask").checked : false,
        };

        // 3. Validasi Logika Tanggal
        if (new Date(payloadData.startDate) > new Date(payloadData.endDate)) {
            alert("❌ Kesalahan Tanggal: Tanggal mulai tidak boleh melebihi tanggal akhir.");
            return;
        }

        setLoadingState(true);

        try {
            let responseData;

            if (USE_MOCK_API) {
                // Simulasi delay server untuk mode pengembangan
                console.log("⚙️ [MOCK MODE] Mengirim data:", payloadData);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                responseData = generateMockResponse(payloadData);
            } else {
                console.log("🚀 LontaraGeo: Mengirim request ke Backend Koyeb...", API_URL);

                // --- PROSES FETCH KE BACKEND ---
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(payloadData),
                });

                // Menangani error HTTP (404, 500, dll)
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("❌ Response Server Error:", errorText);
                    throw new Error(`Server merespons dengan status ${response.status}`);
                }

                responseData = await response.json();
            }

            // 4. Penanganan Respon Sukses
            if (responseData.status === "success") {
                console.log("✅ Analisis GEE Berhasil!", responseData);

                // Render Tile URL dari Google ke peta Leaflet
                if (window.renderGEELayer && responseData.tile_url) {
                    window.renderGEELayer(responseData.tile_url);
                }

                // Update Metadata di Panel Hasil
                updateResultPanel(responseData.metadata || {
                    satelliteName: getSatelliteNameUI(payloadData.satellite),
                    acquisitionDate: "Real-time GEE Composite",
                    cloudCoverActual: payloadData.cloudCover + "% (Max)",
                    crs: "EPSG:4326"
                });
            } else {
                throw new Error(responseData.error || responseData.message || "Gagal memproses data.");
            }

        } catch (error) {
            console.error("❌ Fatal Error:", error);
            
            // Penjelasan khusus untuk error "Failed to fetch" (CORS/Network Issue)
            if (error.message === "Failed to fetch") {
                alert("❌ Terjadi kesalahan sistem: Failed to fetch.\n\nHal ini biasanya disebabkan oleh masalah CORS pada backend atau koneksi internet. Pastikan backend Koyeb sudah mengizinkan request dari domain website Anda.");
            } else {
                alert("❌ Kesalahan Analisis:\n" + error.message);
            }
        } finally {
            setLoadingState(false);
        }
    });

    /**
     * Mengatur tampilan UI saat proses loading
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            btnProcess.disabled = true;
            if (processLoader) processLoader.style.display = "block";
            btnText.innerText = "Komputasi Earth Engine...";
            if (resultPanel) resultPanel.style.display = "none";
        } else {
            btnProcess.disabled = false;
            if (processLoader) processLoader.style.display = "none";
            btnText.innerText = "JALANKAN ANALISIS";
        }
    }

    /**
     * Memperbarui Panel Metadata di UI
     */
    function updateResultPanel(metadata) {
        const resSat = document.getElementById("resSatellite");
        const resDate = document.getElementById("resDate");
        const resCloud = document.getElementById("resCloud");
        const resCRS = document.getElementById("resCRS");

        if (resSat) resSat.innerText = metadata.satelliteName || "-";
        if (resDate) resDate.innerText = metadata.acquisitionDate || "-";
        if (resCloud) resCloud.innerText = metadata.cloudCoverActual || "-";
        if (resCRS) resCRS.innerText = metadata.crs || "EPSG:4326";

        if (resultPanel) resultPanel.style.display = "block";
    }

    /**
     * Helper untuk format nama satelit agar lebih rapi di UI
     */
    function getSatelliteNameUI(value) {
        if (value.includes("S2")) return "Sentinel-2 MSI";
        if (value.includes("LC08")) return "Landsat 8 OLI/TIRS";
        if (value.includes("LC09")) return "Landsat 9 OLI-2";
        return "Satelit GEE";
    }

    /**
     * Helper untuk Mock Response (untuk testing)
     */
    function generateMockResponse(payload) {
        return {
            status: "success",
            tile_url: "https://earthengine.googleapis.com/v1alpha/mock-tiles/{z}/{x}/{y}",
            metadata: {
                satelliteName: getSatelliteNameUI(payload.satellite),
                acquisitionDate: "Mode Demo (Offline)",
                cloudCoverActual: "0.0%",
                crs: "EPSG:4326",
            },
        };
    }
});
