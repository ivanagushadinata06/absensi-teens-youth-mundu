/************************************************
 * LOGOUT
 ************************************************/
function logout() {
  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}

/************************************************
 * FORMAT NAMA
 ************************************************/
function formatNama(nama) {
  if (!nama) return "";
  return nama
    .toString()
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(kata => kata.charAt(0).toUpperCase() + kata.slice(1))
    .join(" ");
}

/************************************************
 * VARIABEL GLOBAL TANGGAL TERPILIH
 ************************************************/
let tanggalDipilih = null;

/************************************************
 * BULAN & TANGGAL IBADAH (HARI MINGGU)
 ************************************************/
const namaBulan = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

const bulanContainer = document.getElementById("bulanContainer");
const tanggalContainer = document.getElementById("tanggalContainer");
const listAbsensi = document.getElementById("listAbsensi");
const judulTanggal = document.getElementById("judulTanggal");
const judulAbsensi = document.getElementById("judulAbsensi");

/************************************************
 * TAMPILKAN PILIHAN BULAN
 ************************************************/
namaBulan.forEach((bulan, index) => {
  const btn = document.createElement("button");
  btn.innerText = bulan;
  btn.style.marginBottom = "8px";

  btn.onclick = () => tampilkanTanggalIbadah(index);
  bulanContainer.appendChild(btn);
});

/************************************************
 * HITUNG & TAMPILKAN HARI MINGGU
 ************************************************/
function tampilkanTanggalIbadah(bulanIndex) {
  tanggalContainer.innerHTML = "";
  listAbsensi.innerHTML = "";
  judulAbsensi.style.display = "none";

  judulTanggal.style.display = "block";
  judulTanggal.innerText =
    "Pilih Tanggal Ibadah - " + namaBulan[bulanIndex];

  const tahun = new Date().getFullYear();
  const lastDay = new Date(tahun, bulanIndex + 1, 0).getDate();

  for (let tgl = 1; tgl <= lastDay; tgl++) {
    const date = new Date(tahun, bulanIndex, tgl);

    // hanya hari Minggu (0)
    if (date.getDay() === 0) {
      const tanggalISO = date.toISOString().split("T")[0];
      const btn = document.createElement("button");

      btn.innerText = "Minggu, " + tgl;
      btn.style.marginBottom = "6px";

      btn.onclick = () => {
        tanggalDipilih = tanggalISO;
        tampilkanAbsensi(tanggalISO);
      };

      tanggalContainer.appendChild(btn);
    }
  }
}

/************************************************
 * TAMPILKAN ABSENSI PER TANGGAL
 ************************************************/
function tampilkanAbsensi(tanggal) {
  judulAbsensi.style.display = "block";
  judulAbsensi.innerText = "Absensi Tanggal: " + tanggal;

  db.collection("members").onSnapshot(snapshot => {
    const members = [];
    snapshot.forEach(doc => {
      members.push({ id: doc.id, ...doc.data() });
    });

    members.sort((a, b) =>
      formatNama(a.name).localeCompare(formatNama(b.name))
    );

    listAbsensi.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Nama Jemaat</th>
            <th>Hadir</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;

    const tbody = listAbsensi.querySelector("tbody");

    members.forEach(member => {
      const tr = document.createElement("tr");

      const tdNama = document.createElement("td");
      tdNama.innerText = formatNama(member.name);

      const tdCheck = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      db.collection("attendance")
        .doc(tanggal)
        .get()
        .then(att => {
          if (att.exists && att.data()[member.id] === true) {
            checkbox.checked = true;
          }
        });

      checkbox.addEventListener("change", () => {
        db.collection("attendance")
          .doc(tanggal)
          .set(
            { [member.id]: checkbox.checked },
            { merge: true }
          );
      });

      tdCheck.appendChild(checkbox);
      tr.appendChild(tdNama);
      tr.appendChild(tdCheck);
      tbody.appendChild(tr);
    });
  });
}

