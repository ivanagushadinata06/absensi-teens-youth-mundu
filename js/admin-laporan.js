const bulanSelect = document.getElementById("bulanSelect");
const tanggalSelect = document.getElementById("tanggalSelect");
const laporanDiv = document.getElementById("laporan");

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const tahun = 2026; // bisa disesuaikan
let dataExport = [];

/* ================================
   INIT BULAN
================================ */
namaBulan.forEach((nama, index) => {
  const opt = document.createElement("option");
  opt.value = index;
  opt.innerText = nama;
  bulanSelect.appendChild(opt);
});

/* ================================
   SAAT BULAN DIPILIH → ISI TANGGAL
================================ */
bulanSelect.addEventListener("change", () => {
  tanggalSelect.innerHTML = `<option value="">-- pilih tanggal --</option>`;

  const bulanIndex = parseInt(bulanSelect.value);
  if (isNaN(bulanIndex)) return;

  const lastDay = new Date(tahun, bulanIndex + 1, 0).getDate();

  for (let tgl = 1; tgl <= lastDay; tgl++) {
    const date = new Date(tahun, bulanIndex, tgl);

    // hanya hari Minggu
    if (date.getDay() === 0) {
      const dd = String(tgl).padStart(2, "0");
      const label = `${dd} ${namaBulan[bulanIndex]} ${tahun}`;
      const iso =
        `${tahun}-${String(bulanIndex + 1).padStart(2, "0")}-${dd}`;

      const opt = document.createElement("option");
      opt.value = iso;
      opt.innerText = label;
      tanggalSelect.appendChild(opt);
    }
  }
});

/* ================================
   TAMPILKAN LAPORAN
================================ */
function tampilkanLaporan() {
  const tanggal = tanggalSelect.value;
  if (!tanggal) {
    alert("Pilih tanggal ibadah");
    return;
  }

  Promise.all([
    db.collection("members").get(),
    db.collection("attendance").doc(tanggal).get()
  ]).then(([membersSnap, attDoc]) => {
    const attData = attDoc.exists ? attDoc.data() : {};
    dataExport = [];

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Nama Jemaat</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    membersSnap.forEach(doc => {
      const nama = doc.data().name;
      const hadir = attData[doc.id] === true;

      html += `
        <tr>
          <td>${nama}</td>
          <td>${hadir ? "Hadir" : "Tidak Hadir"}</td>
        </tr>
      `;

      dataExport.push({
        Nama: nama,
        Status: hadir ? "Hadir" : "Tidak Hadir"
      });
    });

    html += "</tbody></table>";
    laporanDiv.innerHTML = html;
  });
}

/* ================================
   EXPORT EXCEL
================================ */
function exportExcel() {
  if (dataExport.length === 0) {
    alert("Tidak ada data untuk diexport");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(dataExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Absensi");

  XLSX.writeFile(wb, "laporan-absensi.xlsx");
}
