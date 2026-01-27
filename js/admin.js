function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

// Tambah jemaat
function tambahJemaat() {
  const nama = document.getElementById("namaJemaat").value;
  if (!nama) return alert("Nama tidak boleh kosong");

  db.collection("members").add({
    name: nama
  }).then(() => {
    document.getElementById("namaJemaat").value = "";
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
