/**
 * LONTARA v2.0 - Data Exporter Utility
 * Logic: Table Scraper to CSV (GIS-Ready Export)
 */

const DataExporter = {
  /**
   * Mengekspor tabel yang sedang aktif ke file CSV
   * @param {string} fileName - Nama file yang diinginkan
   */
  exportActiveTable(fileName = "LONTARA_Report") {
    const table = document.querySelector("table");
    if (!table) {
      alert("Tidak ada tabel data yang dapat diekspor!");
      return;
    }

    const rows = Array.from(table.querySelectorAll("tr"));
    const csvContent = rows
      .map((row) => {
        // Ambil teks dari header (th) atau nilai dari input di dalam sel (td)
        const cells = Array.from(row.querySelectorAll("th, td"));
        return cells
          .map((cell) => {
            const input = cell.querySelector("input, select");
            let value = input ? input.value : cell.innerText;

            // Bersihkan karakter koma agar tidak merusak format CSV
            value = value.replace(/,/g, ".").trim();
            return `"${value}"`;
          })
          .join(",");
      })
      .join("\n");

    this.downloadCSV(csvContent, fileName);
  },

  /**
   * Trigger unduhan file di browser
   */
  downloadCSV(csvString, fileName) {
    const timestamp = new Date().toISOString().split("T")[0];
    const fullFileName = `${fileName}_${timestamp}.csv`;
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fullFileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  /**
   * Fitur khusus: Ekspor State Global (Semua Modul)
   * Berguna untuk backup database riset
   */
  exportFullState(state) {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "LONTARA_Full_State.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },
};

export default DataExporter;
