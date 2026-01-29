let dataJemaat = [];
let editId = null;

// ================= AUTH CHECK =================
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  // Cek role admin
  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists || doc.data().role !== "admin") {
      window.location.replace("index.html");
      return;
    }

    loadJemaat();
  });
});

// ================= LOAD DATA =================
function loadJemaat() {
  db.collection("members")
    .orderBy("name")
    .onSnapshot(snapshot => {
      dataJemaat = [];
      snapshot.forEach(doc => {
        dataJemaat.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      renderList();
    });
}

// ================= RENDER LIST =================
function renderList() {
  const list = document.getElementById("listJemaat");
  list.innerHTML = "";

  dataJemaat.forEach(jemaat => {
    const li = document.createElement("li");
    li.style.marginBottom = "8px";

    li.innerHTML = `
      <strong>${capitalizeNama(jemaat.name)}</strong><br>
      <button onclick="editJemaat('${jemaat.id}')">Edit</button>
      <button onclick="hapusJemaat('${jemaat.id}')"
              style="background:#e74c3c;">Hapus</button>
    `;

    list.appendChild(li);
  });
}

// ================= TAMBAH / UPDATE =================
function tambahJemaat() {
  const input = document.getElementById("inputNama");
  const errorEl = document.getElementById("error");
  const nama = input.value.trim();

  errorEl.innerText = "";

  if (!nama) {
    errorEl.innerText = "Nama tidak boleh kosong";
    return;
  }

  const namaLower = nama.toLowerCase();

  const duplikat = dataJemaat.some(j =>
    j.name.toLowerCase() === namaLower &&
    j.id !== editId
  );

  if (duplikat) {
    errorEl.innerText = "Nama sudah ada";
    return;
  }

  if (editId) {
    // update
    db.collection("members").doc(editId).update({
      name: nama
    });
    editId = null;
  } else {
    // tambah
    db.collection("members").add({
      name: nama
    });
  }

  input.value = "";
}

// ================= EDIT =================
function editJemaat(id) {
  const jemaat = dataJemaat.find(j => j.id === id);
  if (!jemaat) return;

  document.getElementById("inputNama").value = jemaat.name;
  editId = id;
}

// ================= HAPUS =================
function hapusJemaat(id) {
  if (!confirm("Hapus nama jemaat ini?")) return;

  db.collection("members").doc(id).delete();
}

// ================= UTIL =================
function capitalizeNama(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

// ================= LOGOUT =================
function logout() {
  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}
