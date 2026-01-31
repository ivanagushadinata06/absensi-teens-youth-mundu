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
const hasilDiv = document.getElementById("hasilFollowUp");

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const tahun = 2026;

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

    if (date.getDay() === 0) {
      const dd = String(tgl).padStart(2, "0");
      const iso =
        `${tahun}-${String(bulanIndex + 1).padStart(2, "0")}-${dd}`;

      const label = `${dd} ${namaBulan[bulanIndex]} ${tahun}`;

      const opt = document.createElement("option");
      opt.value = iso;
      opt.innerText = label;
      tanggalSelect.appendChild(opt);
    }
  }
});

/**************************************
 * TAMPILKAN FOLLOW UP
 **************************************/
async function tampilkanFollowUp() {
  const tanggal = tanggalSelect.value;
  hasilDiv.innerHTML = "";

  if (!tanggal) {
    alert("Pilih tanggal ibadah");
    return;
  }

  const [membersSnap, attDoc] = await Promise.all([
    db.collection("members").get(),
    db.collection("attendance").doc(tanggal).get()
  ]);

  const attData = attDoc.exists ? attDoc.data() : {};

  // kelompokkan by ranting
  const group = {};

  membersSnap.forEach(doc => {
    const hadir = attData[doc.id] === true;
    if (hadir) return; // hanya yang TIDAK HADIR

    const ranting = doc.data().ranting || "Tanpa Ranting";
    const nama = formatNama(doc.data().name);

    if (!group[ranting]) group[ranting] = [];
    group[ranting].push(nama);
  });

  if (Object.keys(group).length === 0) {
    hasilDiv.innerHTML = "<p>Semua jemaat hadir 🎉</p>";
    return;
  }

  // render per ranting
  let html = "";

  Object.keys(group).sort().forEach(ranting => {
    html += `
      <h3 style="margin-top:16px;">Ranting ${ranting}</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width:50px;">No</th>
            <th>Nama Jemaat</th>
          </tr>
        </thead>
        <tbody>
    `;

    group[ranting].sort().forEach((nama, i) => {
      html += `
        <tr>
          <td style="text-align:center;">${i + 1}</td>
          <td>${nama}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;
  });

  hasilDiv.innerHTML = html;
}

/**************************************
 * UTIL
 **************************************/
function formatNama(nama) {
  return nama
    .toLowerCase()
    .split(/\s+/)
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

/**************************************
 * LOGOUT
 **************************************/
function logout() {
  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}
