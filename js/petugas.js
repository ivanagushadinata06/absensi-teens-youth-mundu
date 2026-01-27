function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

// tanggal hari ini
const today = new Date().toISOString().split("T")[0];
document.getElementById("tanggalHariIni").innerText =
  "Tanggal: " + today;

// tampilkan daftar jemaat + absensi
db.collection("members").onSnapshot((snapshot) => {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  snapshot.forEach((doc) => {
    const member = doc.data();
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // ambil status absensi hari ini
    db.collection("attendance")
      .doc(today)
      .get()
      .then((att) => {
        if (att.exists && att.data()[doc.id]) {
          checkbox.checked = true;
        }
      });

    // simpan absensi
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(today)
        .set(
          { [doc.id]: checkbox.checked },
          { merge: true }
        );
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + member.name));
    list.appendChild(li);
