let dataJemaat = [];
let filteredJemaat = [];
let editId = null;

/* ================= AUTH CHECK ================= */
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists || doc.data().role !== "admin") {
      window.location.replace("index.html");
      return;
    }

    loadJemaat();
  });
});

/* ================= LOAD DATA ================= */
function loadJemaat() {
  db.collection("members")
    .orderBy("name")
    .onSnapshot(snapshot => {
      dataJemaat = [];
      snapshot.forEach(doc => {
        dataJemaat.push({
          id: doc.id,
          name: doc.data().name,
          ranting: doc.data().ranting || ""
        });
      });

      filteredJemaat = [...dataJemaat];
      renderList();
      updateCounter();
    });
}

/* ================= RENDER LIST ================= */
function renderList() {
  const list = document.getElementById("listJemaat");
  list.innerHTML = "";

  filteredJemaat.forEach(jemaat => {
    const row = document.createElement("div");
    row.className = "row-jemaat";

    row.innerHTML = `
      <span class="col-nama">
        ${capitalizeNama(jemaat.name)}
      </span>

      <span class="col-ranting">
        ${jemaat.ranting || "-"}
      </span>

      <span class="col-aksi aksi-jemaat">
        <button onclick="editJemaat('${jemaat.id}')">Edit</button>
        <button onclick="hapusJemaat('${jemaat.id}')" class="btn-hapus">
          Hapus
        </button>
      </span>
    `;

    list.appendChild(row);
  });
}

/* ================= SEARCH ================= */
function filterJemaat() {
  const keyword = document
    .getElementById("searchJemaat")
    .value
    .toLowerCase();

  filteredJemaat = dataJemaat.filter(j =>
    j.name.toLowerCase().includes(keyword)
  );

  renderList();
  updateCounter();
}

/* ================= COUNTER ================= */
function updateCounter() {
  const counter = document.getElementById("jumlahJemaat");
  const total = dataJemaat.length;
  const tampil = filteredJemaat.length;

  counter.innerText =
    tampil === total
      ? `Total jemaat: ${total}`
      : `Menampilkan ${tampil} dari ${total} jemaat`;
}

/* ================= TAMBAH / UPDATE ================= */
function tambahJemaat() {
  const inputNama = document.getElementById("inputNama");
  const inputRanting = document.getElementById("inputRanting");
  const errorEl = document.getElementById("error");

  const nama = inputNama.value.trim();
  const ranting = inputRanting.value.trim();

  errorEl.innerText = "";

  if (!nama) {
    errorEl.innerText = "Nama jemaat tidak boleh kosong";
    return;
  }

  const duplikat = dataJemaat.some(j =>
    j.name.toLowerCase() === nama.toLowerCase() &&
    j.id !== editId
  );

  if (duplikat) {
    errorEl.innerText = "Nama jemaat sudah ada";
    return;
  }

  const payload = {
    name: nama,
    ranting: ranting
  };

  if (editId) {
    db.collection("members").doc(editId).update(payload);
    editId = null;
  } else {
    db.collection("members").add(payload);
  }

  inputNama.value = "";
  inputRanting.value = "";
}

/* ================= EDIT ================= */
function editJemaat(id) {
  const jemaat = dataJemaat.find(j => j.id === id);
  if (!jemaat) return;

  document.getElementById("inputNama").value = jemaat.name;
  document.getElementById("inputRanting").value = jemaat.ranting || "";
  editId = id;
}

/* ================= HAPUS ================= */
function hapusJemaat(id) {
  if (!confirm("Hapus nama jemaat ini?")) return;
  db.collection("members").doc(id).delete();
}

/* ================= UTIL ================= */
function capitalizeNama(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

/* ================= LOGOUT ================= */
function logout() {
  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}
