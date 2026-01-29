let dataMembers = [];   // simpan semua anggota (global)
let tanggal = "";      // supaya bisa dipakai lintas fungsi

// =============================
// CEK APAKAH TANGGAL HARI INI (WIB)
// =============================
async function isHariIniWIB() {
  try {
    const res = await fetch(
      "https://worldtimeapi.org/api/timezone/Asia/Jakarta"
    );
    const data = await res.json();

    // tanggal hari ini WIB (YYYY-MM-DD)
    const todayWIB = data.datetime.slice(0, 10);

    // tanggal dari URL
    const params = new URLSearchParams(location.search);
    const tanggalURL = params.get("tanggal");

    return tanggalURL === todayWIB;
  } catch (err) {
    alert("Gagal memverifikasi tanggal. Periksa koneksi internet.");
    return false;
  }
}

let bolehAbsen = false;

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  // 🔒 cek apakah hari ini (WIB)
  bolehAbsen = await isHariIniWIB();

  // jika bukan hari ini, tampilkan info
  if (!bolehAbsen) {
    tampilkanInfoReadonly();
  }

  // ===== LANJUTKAN LOGIC ABSENSI DI BAWAH =====
});

  // ===== PARAM =====
  const params = new URLSearchParams(location.search);
  tanggal = params.get("tanggal");
  const label = params.get("label");

  document.getElementById("judulTanggal").innerText = label;

  // ===== LISTEN MEMBERS =====
  db.collection("members")
    .orderBy("name")
    .onSnapshot(snapshot => {
      dataMembers = [];
      snapshot.forEach(doc => {
        dataMembers.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      renderTable(dataMembers);
    });
});

// ================= RENDER TABEL =================
function renderTable(members) {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  members.forEach(member => {
    const tr = document.createElement("tr");

    // Kolom Nama
    const tdNama = document.createElement("td");
    tdNama.innerText = capitalizeNama(member.name);

    // Kolom Checkbox
    const tdCheck = document.createElement("td");
    const chk = document.createElement("input");
    chk.type = "checkbox";

    // jika bukan hari ini → disable
      if (!bolehAbsen) {
      chk.disabled = true;
      }
    
    // Ambil status absensi
    db.collection("attendance")
      .doc(tanggal)
      .get()
      .then(att => {
        if (att.exists && att.data()[member.id]) {
          chk.checked = true;
        }
      });

    // Update saat dicentang
  chk.onchange = () => {
  if (!bolehAbsen) return;

  db.collection("attendance")
    .doc(tanggal)
    .set({ [member.id]: chk.checked }, { merge: true });
};

    tdCheck.appendChild(chk);
    tr.append(tdNama, tdCheck);
    list.appendChild(tr);
  });
}

// ================= SEARCH REALTIME =================
function filterNama() {
  const keyword = document
    .getElementById("searchNama")
    .value
    .toLowerCase();

  const hasil = dataMembers.filter(m =>
    m.name.toLowerCase().includes(keyword)
  );

  renderTable(hasil);
}

// ================= TAMBAH ANGGOTA =================
function tambahAnggota() {
  const input = document.getElementById("inputNamaBaru");
  const namaBaru = input.value.trim();

  if (!namaBaru) {
    alert("Nama tidak boleh kosong");
    return;
  }

  const sudahAda = dataMembers.some(
    m => m.name.toLowerCase() === namaBaru.toLowerCase()
  );

  if (sudahAda) {
    alert("Nama sudah ada di daftar anggota!");
    return;
  }

  db.collection("members").add({
    name: namaBaru
  });

  input.value = "";
}

// ================= UTIL =================
function capitalizeNama(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(kata => kata.charAt(0).toUpperCase() + kata.slice(1))
    .join(" ");
}

function logout() {
  auth.signOut().then(() => location.replace("index.html"));
}

function tampilkanInfoReadonly() {
  const info = document.createElement("div");
  info.innerText = "ℹ️ Absensi hanya bisa diisi pada tanggal hari ini";
  info.style.color = "#e67e22";
  info.style.fontSize = "14px";
  info.style.margin = "8px 0";

  const judul = document.getElementById("judulTanggal");
  judul.after(info);
}
