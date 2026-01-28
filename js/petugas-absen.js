/************************************
 * AMBIL PARAMETER TANGGAL
 ************************************/
const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");
const label = params.get("label");

if (!tanggal || !label) {
  // kalau URL tidak valid
  window.location.replace("index.html");
}

document.getElementById("judulTanggal").innerText = label;

/************************************
 * CEK LOGIN (AMAN & MINIMAL)
 ************************************/
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
  }
});

/************************************
 * TAMPILKAN DAFTAR ABSENSI
 ************************************/
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.marginBottom = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // ambil status absensi hari ini
    db.collection("attendance").doc(tanggal).get().then(att => {
      if (att.exists && att.data()[doc.id] === true) {
        checkbox.checked = true;
      }
    });

    // simpan absensi
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(tanggal)
        .set(
          { [doc.id]: checkbox.checked },
          { merge: true }
        );
    });

    const nama = document.createElement("span");
    nama.innerText = data.name;

    row.appendChild(checkbox);
    row.appendChild(nama);
    list.appendChild(row);
  });
});

/************************************
 * LOGOUT (BACK DIBLOKIR SETELAH INI)
 ************************************/
function logout() {
  // tandai logout
  sessionStorage.setItem("isLogout", "1");

  auth.signOut().then(() => {
    // replace = hapus halaman dari history
    window.location.replace("index.html");
  });
}
