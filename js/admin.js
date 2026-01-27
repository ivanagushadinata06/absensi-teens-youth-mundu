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

  db.collection("members")
    .add({ name: nama })
    .then(() => {
      input.value = "";
      alert("Nama berhasil ditambahkan");
    })
    .catch((err) => {
      alert("Gagal: " + err.message);
      console.error(err);
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

