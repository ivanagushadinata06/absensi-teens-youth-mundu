const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");

document.getElementById("judulTanggal").innerText =
  "Absensi Ibadah: " + tanggal;

function formatNama(nama) {
  return nama.toLowerCase().split(" ")
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
}

db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const tr = document.createElement("div");

    const label = document.createElement("span");
    label.innerText = formatNama(doc.data().name);

    const check = document.createElement("input");
    check.type = "checkbox";

    db.collection("attendance").doc(tanggal).get()
      .then(att => {
        if (att.exists && att.data()[doc.id]) check.checked = true;
      });

    check.onchange = () => {
      db.collection("attendance")
        .doc(tanggal)
        .set({ [doc.id]: check.checked }, { merge: true });
    };

    tr.appendChild(label);
    tr.appendChild(check);
    list.appendChild(tr);
  });
});
