/************************************************
 * LOGOUT
 ************************************************/
function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
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
    .map(
      kata => kata.charAt(0).toUpperCase() + kata.slice(1)
    )
    .join(" ");
}

/************************************************
 * TAMBAH NAMA JEMAAT (ADMIN)
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
 * TAMPILKAN DAFTAR JEMAAT
 ************************************************/
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listJemaat");
  if (!list) return;

  list.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");

    li.innerText = formatNama(data.name);
    list.appendChild(li);
  });
});
