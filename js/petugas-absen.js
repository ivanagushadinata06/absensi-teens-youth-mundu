/************************************************
 * PROTEKSI LOGIN
 ************************************************/
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

/************************************************
 * AMBIL PARAMETER URL
 ************************************************/
const params = new URLSearchParams(window.location.search);
const tanggalISO = params.get("tanggal");
const tanggalLabel = params.get("label");

if (!tanggalISO) {
  alert("Tanggal tidak valid");
}

/************************************************
 * TAMPILKAN JUDUL
 ************************************************/
document.getElementById("judulTanggal").innerText =
  "Absensi Ibadah: " + (tanggalLabel || tanggalISO);

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
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

/************************************************
 * TAMPILKAN DAFTAR ABSENSI (INI KUNCI)
 ************************************************/
db.collection("members").onSnapshot(snapshot => {
  const container = document.getElementById("listAbsensi");
  if (!container) return;

  // ambil & urutkan jemaat
  const members = [];
  snapshot.forEach(doc => {
    members.push({ id: doc.id, ...doc.data() });
  });

  members.sort((a, b) =>
    formatNama(a.name).localeCompare(formatNama(b.name))
  );

  // render tabel
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

    // ambil status absensi tanggal ini
    db.collection("attendance")
      .doc(tanggalISO)
      .get()
      .then(att => {
        if (att.exists && att.data()[member.id] === true) {
          checkbox.checked = true;
        }
      });

    // simpan absensi
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(tanggalISO)
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

/************************************************
 * LOGOUT
 ************************************************/
function logout() {
  // tandai bahwa user sudah logout
  sessionStorage.setItem("isLogout", "1");

  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}
