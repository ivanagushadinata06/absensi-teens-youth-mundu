auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  // ===== LOGIC ABSEN DIMULAI =====
  const params = new URLSearchParams(location.search);
  const tanggal = params.get("tanggal");
  const label = params.get("label");

  document.getElementById("judulTanggal").innerText = label;

  const list = document.getElementById("listAbsensi");

  db.collection("members").onSnapshot(snapshot => {
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const tr = document.createElement("tr");

      // ===== KOLOM NAMA =====
      const tdNama = document.createElement("td");
     tdNama.innerText = capitalizeNama(doc.data().name);

      // ===== KOLOM CHECKBOX =====
      const tdCheck = document.createElement("td");

      const chk = document.createElement("input");
      chk.type = "checkbox";

      // Ambil data absensi
      db.collection("attendance")
        .doc(tanggal)
        .get()
        .then(att => {
          if (att.exists && att.data()[doc.id]) {
            chk.checked = true;
          }
        });

      // Saat checkbox diklik
      chk.onchange = () => {
        db.collection("attendance")
          .doc(tanggal)
          .set(
            { [doc.id]: chk.checked },
            { merge: true }
          );
      };

      tdCheck.appendChild(chk);
      tr.append(tdNama, tdCheck);
      list.appendChild(tr);
    });
  });
});

function logout() {
  auth.signOut().then(() => location.replace("index.html"));
}

function capitalizeNama(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(kata => kata.charAt(0).toUpperCase() + kata.slice(1))
    .join(" ");
}
