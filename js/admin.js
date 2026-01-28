auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists || doc.data().role !== "admin") {
      window.location.replace("index.html");
    }
  });
});

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
 * TAMBAH NAMA JEMAAT (ADMIN – ANTI DUPLIKAT)
 ************************************************/
function tambahJemaat() {
  const input = document.getElementById("namaJemaat");
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
 * TAMPILKAN DAFTAR JEMAAT (URUT A–Z, TABEL)
 ************************************************/
db.collection("members").onSnapshot(snapshot => {
  const container = document.getElementById("listJemaat");
  if (!container) return;

  const members = [];
  snapshot.forEach(doc => {
    members.push(doc.data());
  });

  members.sort((a, b) =>
    formatNama(a.name).localeCompare(formatNama(b.name))
  );

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Nama Jemaat</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  const tbody = container.querySelector("tbody");

  members.forEach(member => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.innerText = formatNama(member.name);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
});

