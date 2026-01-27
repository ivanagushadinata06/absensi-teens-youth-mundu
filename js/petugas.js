/************************************************
 * LOGOUT
 ************************************************/
function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}

/************************************************
 * FORMAT NAMA
 * Huruf besar di awal setiap kata
 ************************************************/
function formatNama(nama) {
  if (!nama) return "";

  return nama
    .toString()
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(
      kata => kata.charAt(0).toUpperCase() + kata.slice(1)
    )
    .join(" ");
}

/************************************************
 * TANGGAL HARI INI
 ************************************************/
const today = new Date().toISOString().split("T")[0];
const elTanggal = document.getElementById("tanggalHariIni");
if (elTanggal) {
  elTanggal.innerText = "Tanggal: " + today;
}

/************************************************
 * TAMBAH NAMA JEMAAT (PETUGAS)
 * - Anti duplikat total
 * - Nama otomatis rapi
 ************************************************/
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
    .then(snapshot => {
      let sudahAda = false;

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name && data.name.toLowerCase() === namaLower) {
          sudahAda = true;
        }
      });

      if (sudahAda) {
        alert("⚠️ Nama sudah ada, tidak boleh duplikat");
        return;
      }

      return db.collection("members").add({
        name: nama,
        name_lower: namaLower
      });
    })
    .then(() => {
      input.value = "";
      alert("✅ Nama berhasil ditambahkan");
    })
    .catch(err => {
      console.error(err);
      alert("Terjadi kesalahan saat menambah nama");
    });
}

/************************************************
 * TAMPILKAN ABSENSI HARI INI
 ************************************************/
db.collection("members").onSnapshot(snapshot => {
  const list = document.getElementById("listAbsensi");
  if (!list) return;

  list.innerHTML = "";

  snapshot.forEach(doc => {
    const member = doc.data();
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Ambil status absensi hari ini
    db.collection("attendance")
      .doc(today)
      .get()
      .then(att => {
        if (att.exists && att.data()[doc.id] === true) {
          checkbox.checked = true;
        }
      });

    // Simpan absensi (boolean)
    checkbox.addEventListener("change", () => {
      db.collection("attendance")
        .doc(today)
        .set(
          { [doc.id]: checkbox.checked },
          { merge: true }
        );
    });

    // Paksa format nama saat tampil
    const namaTampil = formatNama(member.name);

    li.appendChild(checkbox);
    li.appendChild(
      document.createTextNode(" " + namaTampil)
    );
    list.appendChild(li);
  });
});
