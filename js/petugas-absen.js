auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");
if (!tanggal) return;

document.getElementById("judulTanggal").innerText =
  "Absensi Ibadah: " + tanggal;

function formatNama(nama) {
  return nama
    .toString()
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

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

    checkbox.onchange = () => {
      db.collection("attendance")
        .doc(tanggal)
        .set(
          { [member.id]: checkbox.checked },
          { merge: true }
        );
    };

    tdCheck.appendChild(checkbox);
    tr.appendChild(tdNama);
    tr.appendChild(tdCheck);
    tbody.appendChild(tr);
  });
});
