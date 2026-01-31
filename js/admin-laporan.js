/**************************************
 * PROTEKSI ADMIN
 **************************************/
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists || doc.data().role !== "admin") {
      alert("Akses ditolak");
      window.location.replace("index.html");
    }
  });
});

/**************************************
 * KONFIGURASI
 **************************************/
const bulanSelect = document.getElementById("bulanSelect");
const tanggalSelect = document.getElementById("tanggalSelect");
const laporanDiv = document.getElementById("laporan");
const ringkasanDiv = document.getElementById("ringkasanLaporan");

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const tahun = 2026;
let dataExport = [];

/**************************************
 * FORMAT NAMA
 **************************************/
function formatNama(nama) {
  return nama
    .toString()
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

/**************************************
 * INIT BULAN
 **************************************/
namaBulan.forEach((nama, index) => {
  const opt = document.createElement("option");
  opt.value = index;
  opt.innerText = nama;
  bulanSelect.appendChild(opt);
});

/**************************************
 * SAAT BULAN DIPILIH → ISI TANGGAL MINGGU
 **************************************/
bulanSelect.addEventListener("change", () => {
  tanggalSelect.innerHTML =
    `<option value="">-- pilih tanggal --</option>`;

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

/**************************************
 * TAMPILKAN LAPORAN
 **************************************/
function tampilkanLaporan() {
  const tanggal = tanggalSelect.value;
  laporanDiv.innerHTML = "";
  ringkasanDiv.innerHTML = "";

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

    let rows = [];
    let jumlahHadir = 0;

    membersSnap.forEach(doc => {
      const nama = formatNama(doc.data().name);
      const hadir = attData[doc.id] === true;

      if (hadir) jumlahHadir++;

      rows.push({ nama, hadir });
    });

    // Urutkan: Hadir dulu, lalu A–Z
    rows.sort((a, b) => {
      if (a.hadir !== b.hadir) {
        return a.hadir ? -1 : 1;
      }
      return a.nama.localeCompare(b.nama);
    });

    // Ringkasan
    ringkasanDiv.innerText = `Jumlah Hadir: ${jumlahHadir} orang`;

    // Tabel
    let html = `
      <table class="table">
        <thead>
          <tr>
            <th style="width:50px;">No</th>
            <th>Nama Jemaat</th>
            <th style="width:120px;">Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    rows.forEach((row, index) => {
      html += `
        <tr>
          <td style="text-align:center;">${index + 1}</td>
          <td>${row.nama}</td>
          <td style="text-align:center;">
            ${row.hadir ? "Hadir" : "Tidak Hadir"}
          </td>
        </tr>
      `;

      dataExport.push({
        Nama: row.nama,
        Status: row.hadir ? "Hadir" : "Tidak Hadir"
      });
    });

    html += `
        </tbody>
      </table>
    `;

    laporanDiv.innerHTML = html;
  });
}

/**************************************
 * EXPORT EXCEL
 **************************************/
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
