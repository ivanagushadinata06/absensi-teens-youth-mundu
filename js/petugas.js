/************************************************
 * LOGOUT
 ************************************************/
function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

/************************************************
 * FORMAT NAMA (Kapital Awal Kata)
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
 * TANGGAL HARI INI
 ************************************************/
const today = new Date().toISOString().split("T")[0];
const elTanggal = document.getElementById("tanggalHariIni");
if (elTanggal) elTanggal.innerText = "Tanggal: " + today;

/************************************************
 * TAMBAH NAMA JEMAAT (PETUGAS – ANTI DUPLIKAT)
 ************************************************/
function tambahJemaatPetugas() {
  const input = document.getElementById("namaBaru");
  const namaInput = input.value.trim();

  if (!namaInput) {
    alert("Nama tidak boleh kosong");
    return;
  }

  const nama = formatNama(namaInput);
  const namaLower = nama.toLowerCase();

  db.collection("members")
    .get()
    .then(snapshot => {
      let sudahAda = false;

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name && data.name.toLowerCase() === namaLower) {
          sudahAda = true;
        }
      });

      if (sudahAda) {
        alert("⚠️ Nama sudah ada, tidak boleh duplikat");
        return;
      }

      return db.collection("members").add({
        name: nama,
        name_lower: namaLower
      });
    })
    .then(() => {
      input.value = "";
      alert("✅ Nama berhasil ditambahkan");
    })
    .catch(err => {
      console.error(err);
      alert("Terjadi kesalahan");
    });
}

/************************************************
 * TAMPILKAN ABSENSI (URUT A–Z, TABEL)
 ************************************************/
db.collection("members").onSnapshot(snapshot => {
  const container = document.getElementById("listAbsensi");
  if (!container) return;

  const members = [];
  snapshot.forEach(doc => {
    members.push({ id: doc.id, ...doc.data() });
  });

  members.sort((a, b) =>
    formatNama(a.name).localeCompare(formatNama(b.name))
  );

  container.innerHTML = `
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

  const tbody = container.querySelector("tbody");

  members.forEach(member => {
    const tr = document.createElement("tr");

    const tdNama = document.createElement("td");
    tdNama.innerText = formatNama(member.name);

    const tdCheck = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    db.collection("attendance")
      .doc(today)
      .get()
      .then(att => {
        if (att.exists && att.data()[member.id] === true) {
          checkbox.checked = true;
        }
      });

    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(today)
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
