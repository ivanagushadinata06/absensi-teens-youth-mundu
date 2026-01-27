/********************
 * LOGOUT
 ********************/
function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

/********************
 * FORMAT NAMA
 * Selalu huruf besar di awal kata
 ********************/
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

/********************
 * TAMBAH NAMA (ADMIN + ANTI DOBEL)
 ********************/
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

      db.collection("members").add({
        name: nama,
        name_lower: namaLower
      }).then(() => {
        input.value = "";
        alert("✅ Nama berhasil ditambahkan");
      });
    });
}

/********************
 * TAMPILKAN DAFTAR JEMAAT (FORMAT DIPAKSA)
 ********************/
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listJemaat");
  if (!list) return;

  list.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");

    // 🔥 FORMAT DIPAKSA SAAT TAMPIL
    li.innerText = formatNama(data.name);

    list.appendChild(li);
  });
});
