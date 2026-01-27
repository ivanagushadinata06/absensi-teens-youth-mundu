/************************************************
 * PROTEKSI LOGIN
 ************************************************/
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

/************************************************
 * AMBIL TANGGAL DARI URL
 ************************************************/
const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");

document.getElementById("judulTanggal").innerText =
  "Absensi Ibadah: " + tanggal;

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
 * TAMPILKAN ABSENSI (TABEL, URUT A–Z)
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
