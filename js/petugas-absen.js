/* 🔐 AUTH CHECK HALUS */
if (!auth.currentUser) {
  window.location.replace("index.html");
}

/* PARAMETER */
const params = new URLSearchParams(location.search);
const tanggal = params.get("tanggal");
const label = params.get("label");

document.getElementById("judulTanggal").innerText = label;

/* DAFTAR ABSENSI */
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";

    const chk = document.createElement("input");
    chk.type = "checkbox";

    db.collection("attendance").doc(tanggal).get().then(att => {
      if (att.exists && att.data()[doc.id]) chk.checked = true;
    });

    chk.onchange = () => {
      db.collection("attendance")
        .doc(tanggal)
        .set({ [doc.id]: chk.checked }, { merge: true });
    };

    const name = document.createElement("span");
    name.innerText = doc.data().name;

    row.append(chk, name);
    list.appendChild(row);
  });
});

/* LOGOUT */
function logout() {
  auth.signOut().then(() => location.replace("index.html"));
}
