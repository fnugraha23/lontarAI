/**
 * LONTARA v2.0 - Data Parser Utility
 * Logic: CSV to Table Mapper for Mass Data Import
 */

const DataParser = {
  /**
   * Membaca file CSV dan mengonversinya ke Array
   * @param {File} file - File objek dari input type file
   * @param {string} targetModule - Nama modul (physics, chemistry, etc)
   */
  async processCSV(file, targetModule) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        const data = this.csvToArray(text);

        if (data.length > 0) {
          this.mapToTable(data, targetModule);
          resolve(data);
        } else {
          reject("File CSV kosong atau format tidak valid.");
        }
      };

      reader.onerror = () => reject("Gagal membaca file.");
      reader.readAsText(file);
    });
  },

  /**
   * Helper: String CSV ke Array 2D
   */
  csvToArray(strData, strDelimiter = ",") {
    const objPattern = new RegExp(
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi",
    );

    const arrData = [[]];
    let arrMatches = null;

    while ((arrMatches = objPattern.exec(strData))) {
      const strMatchedDelimiter = arrMatches[1];
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        arrData.push([]);
      }

      const strMatchedValue = arrMatches[2]
        ? arrMatches[2].replace(new RegExp('""', "g"), '"')
        : arrMatches[3];

      arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
  },

  /**
   * Mapping data ke UI Table secara dinamis
   */
  mapToTable(data, module) {
    const tableBody = document.querySelector("tbody");
    if (!tableBody) return;

    // Bersihkan tabel saat ini (opsional)
    tableBody.innerHTML = "";

    // Lewati header (index 0) dan loop data
    data.slice(1).forEach((row) => {
      if (row.length < 2) return; // Lewati baris kosong

      const newRow = document.createElement("tr");

      if (module === "physics_ui") {
        newRow.innerHTML = this.templatePhysics(row);
      } else if (module === "chemistry_ui") {
        newRow.innerHTML = this.templateChemistry(row);
      }

      tableBody.appendChild(newRow);
    });

    console.log(
      `LONTARA Parser: ${data.length - 1} data sampel berhasil dimuat ke ${module}.`,
    );
  },

  /**
   * Template baris untuk Modul Fisika
   * Urutan CSV: ID, Berat Kering, Diameter, Tinggi
   */
  templatePhysics(row) {
    return `
            <td><input type="text" class="form-control form-control-sm border-0 bg-light" value="${row[0] || ""}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[1] || 0}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[2] || 5}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[3] || 5}"></td>
            <td><input type="text" class="form-control form-control-sm border-0 bg-light text-primary fw-bold" readonly value="-"></td>
            <td><input type="text" class="form-control form-control-sm border-0 bg-light text-success fw-bold" readonly value="-"></td>
            <td><button class="btn btn-link text-danger p-0"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
  },

  /**
   * Template baris untuk Modul Kimia
   * Urutan CSV: ID, pH, C-Org, N-Total, P2O5, K2O, KTK
   */
  templateChemistry(row) {
    return `
            <td><input type="text" class="form-control form-control-sm border-0 bg-light" value="${row[0] || ""}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[1] || 0}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[2] || 0}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[3] || 0}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[4] || 0}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light" value="${row[5] || 0}"></td>
            <td><input type="number" class="form-control form-control-sm border-0 bg-light text-info fw-bold" value="${row[6] || 0}"></td>
            <td><button class="btn btn-link text-danger p-0"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
  },
};

export default DataParser;
