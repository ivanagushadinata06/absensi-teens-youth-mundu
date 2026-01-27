/********************
 * LOGOUT
 ********************/
function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

/********************
 * FORMAT NAMA
 * Selalu huruf besar di awal kata
 ********************/
function formatNama(nama) {
  if (!nama) return "";
  return nama
    .toString()
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(
      kata => kata.charAt(0).toUpperCase() + kata.slice(1)
    )
    .join(" ");
}

/********************
 * TANGGAL HARI INI
 ********************/
const today = new Date().toISOString().split("T")[0];
document.getElementById("tanggalHariIni").innerText =
  "Tanggal: " + today;

/********************
 * TAMBAH NAMA (ANTI DOBEL TOTAL)
 ********************/
function tambahJemaatPetugas() {
  const input = document.getElementById("namaBaru");
  const namaInput = input.value.trim();

  if (!namaInput) {
    alert("Nama tidak boleh kosong");
    return;
  }

  const nama = formatNama(namaInput);
  const namaLower = nama.toLowerCase();

  db.collection("members")
    .get()
    .then((snapshot) => {
      let sudahAda = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.name &&
          data.name.toLowerCase() === namaLower
        ) {
          sudahAda = true;
        }
      });

      if (sudahAda) {
        alert("⚠️ Nama sudah ada, tidak boleh duplikat");
        return;
      }

      db.collection("members")
        .add({
          name: nama,            // DISIMPAN SUDAH RAPI
          name_lower: namaLower
        })
        .then(() => {
          input.value = "";
          alert("✅ Nama berhasil ditambahkan");
        });
    })
    .catch((err) => {
      console.error(err);
      alert("Terjadi kesalahan saat menambah nama");
    });
}

/********************
 * TAMPILKAN ABSENSI HARI INI
 ********************/
db.collection("members").onSnapshot((snapshot) => {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  snapshot.forEach((doc) => {
    const member = doc.data();
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Ambil status absensi hari ini
    db.collection("attendance")
      .doc(today)
      .get()
      .then((att) => {
        if (att.exists && att.data()[doc.id] === true) {
          checkbox.checked = true;
        }
      });

    // Simpan absensi
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(today)
        .set(
          { [doc.id]: checkbox.checked },
          { merge: true }
        );
    });

    // 🔥 PAKSA FORMAT SAAT DITAMPILKAN
    const namaTampil = formatNama(member.name);

    li.appendChild(checkbox);
    li.appendChild(
      document.createTextNode(" " + namaTampil)
    );
    list.appendChild(li);
  });
});
