let dataMembers = [];   // simpan semua anggota (global)
let tanggal = "";      // supaya bisa dipakai lintas fungsi

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  // ===== PARAM =====
  const params = new URLSearchParams(location.search);
  tanggal = params.get("tanggal");
  const label = params.get("label");

  document.getElementById("judulTanggal").innerText = label;

  // ===== LISTEN MEMBERS =====
  db.collection("members")
    .orderBy("name")
    .onSnapshot(snapshot => {
      dataMembers = [];
      snapshot.forEach(doc => {
        dataMembers.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      renderTable(dataMembers);
    });
});

// ================= RENDER TABEL =================
function renderTable(members) {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  members.forEach(member => {
    const tr = document.createElement("tr");

    // Kolom Nama
    const tdNama = document.createElement("td");
    tdNama.innerText = capitalizeNama(member.name);

    // Kolom Checkbox
    const tdCheck = document.createElement("td");
    const chk = document.createElement("input");
    chk.type = "checkbox";

    // Ambil status absensi
    db.collection("attendance")
      .doc(tanggal)
      .get()
      .then(att => {
        if (att.exists && att.data()[member.id]) {
          chk.checked = true;
        }
      });

    // Update saat dicentang
    chk.onchange = () => {
      db.collection("attendance")
        .doc(tanggal)
        .set({ [member.id]: chk.checked }, { merge: true });
    };

    tdCheck.appendChild(chk);
    tr.append(tdNama, tdCheck);
    list.appendChild(tr);
  });
}

// ================= SEARCH REALTIME =================
function filterNama() {
  const keyword = document
    .getElementById("searchNama")
    .value
    .toLowerCase();

  const hasil = dataMembers.filter(m =>
    m.name.toLowerCase().includes(keyword)
  );

  renderTable(hasil);
}

// ================= TAMBAH ANGGOTA =================
function tambahAnggota() {
  const input = document.getElementById("inputNamaBaru");
  const namaBaru = input.value.trim();

  if (!namaBaru) {
    alert("Nama tidak boleh kosong");
    return;
  }

  const sudahAda = dataMembers.some(
    m => m.name.toLowerCase() === namaBaru.toLowerCase()
  );

  if (sudahAda) {
    alert("Nama sudah ada di daftar anggota!");
    return;
  }

  db.collection("members").add({
    name: namaBaru
  });

  input.value = "";
}

// ================= UTIL =================
function capitalizeNama(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(kata => kata.charAt(0).toUpperCase() + kata.slice(1))
    .join(" ");
}

function logout() {
  auth.signOut().then(() => location.replace("index.html"));
}
