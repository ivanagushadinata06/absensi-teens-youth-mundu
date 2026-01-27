function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

// Tambah jemaat
function tambahJemaat() {
  const input = document.getElementById("namaJemaat");
  const nama = input.value.trim();

  if (!nama) {
    alert("Nama tidak boleh kosong");
    return;
  }

  // Samakan format nama (hindari Andi vs andi)
  const namaLower = nama.toLowerCase();

  // Cek apakah nama sudah ada
  db.collection("members")
    .where("name_lower", "==", namaLower)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        alert("⚠️ Nama sudah ada, tidak boleh duplikat");
        return;
      }

      // Kalau belum ada, baru simpan
      db.collection("members")
        .add({
          name: nama,
          name_lower: namaLower
        })
        .then(() => {
          input.value = "";
          alert("✅ Nama berhasil ditambahkan");
        });
    })
    .catch((err) => {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data");
    });
}

// Tampilkan jemaat
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listJemaat");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.innerText = doc.data().name;
    list.appendChild(li);
  });
});


