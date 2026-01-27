function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

// Ambil tanggal hari ini (YYYY-MM-DD)
const today = new Date().toISOString().split("T")[0];
document.getElementById("tanggalHariIni").innerText =
  "Tanggal: " + today;

// Tambah jemaat (petugas boleh)
function tambahJemaatPetugas() {
  const nama = document.getElementById("namaBaru").value;
  if (!nama) return alert("Nama tidak boleh kosong");

  db.collection("members").add({ name: nama }).then(() => {
    document.getElementById("namaBaru").value = "";
  });
}

// Tampilkan absensi hari ini
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // ambil status absensi hari ini
    db.collection("attendance")
      .doc(today)
      .get()
      .then(attDoc => {
        if (attDoc.exists && attDoc.data()[doc.id]) {
          checkbox.checked = true;
        }
      });

    // simpan checklist
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(today)
        .set(
          { [doc.id]: checkbox.checked },
          { merge: true }
        );
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + data.name));
    list.appendChild(li);
  });
});
