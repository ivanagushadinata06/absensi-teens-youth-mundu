/************************************
 * AMBIL PARAMETER URL
 ************************************/
const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");
const label = params.get("label");

if (!tanggal || !label) {
  window.location.replace("index.html");
}

document.getElementById("judulTanggal").innerText = label;

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

    // Ambil status absensi
    db.collection("attendance").doc(tanggal).get().then(att => {
      if (att.exists && att.data()[doc.id] === true) {
        checkbox.checked = true;
      }
    });

    // Simpan absensi
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(tanggal)
        .set({ [doc.id]: checkbox.checked }, { merge: true });
    });

    const nama = document.createElement("span");
    nama.innerText = data.name;

    row.appendChild(checkbox);
    row.appendChild(nama);
    list.appendChild(row);
  });
});

/************************************
 * LOGOUT (SATU-SATUNYA REDIRECT KE LOGIN)
 ************************************/
function logout() {
  sessionStorage.setItem("isLogout", "1");

  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}
