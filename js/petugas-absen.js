let dataMembers = [];
let tanggal = "";
let bolehAbsen = false;

/* =============================
   CEK TANGGAL HARI INI (WIB)
============================= */
async function isHariIniWIB() {
  try {
    const res = await fetch(
      "https://worldtimeapi.org/api/timezone/Asia/Jakarta"
    );
    const data = await res.json();

    const todayWIB = data.datetime.slice(0, 10);

    const params = new URLSearchParams(location.search);
    const tanggalURL = params.get("tanggal");

    return tanggalURL === todayWIB;
  } catch (err) {
    alert("Gagal memverifikasi tanggal. Periksa koneksi internet.");
    return false;
  }
}

/* =============================
   AUTH CHECK + INIT
============================= */
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  // cek hari ini (WIB)
  bolehAbsen = await isHariIniWIB();
  if (!bolehAbsen) tampilkanInfoReadonly();

  // ambil parameter
  const params = new URLSearchParams(location.search);
  tanggal = params.get("tanggal");
  const label = params.get("label");

  document.getElementById("judulTanggal").innerText = label;

  // listen members
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

/* =============================
   RENDER TABEL
============================= */
function renderTable(members) {
  const list = document.getElementById("listAbsensi");
  list.innerHTML = "";

  members.forEach(member => {
    const tr = document.createElement("tr");

    const tdNama = document.createElement("td");
    tdNama.innerText = capitalizeNama(member.name);

    const tdCheck = document.createElement("td");
    const chk = document.createElement("input");
    chk.type = "checkbox";

    if (!bolehAbsen) chk.disabled = true;

    db.collection("attendance")
      .doc(tanggal)
      .get()
      .then(att => {
        if (att.exists && att.data()[member.id]) {
          chk.checked = true;
        }
      });

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

/* =============================
   SEARCH
============================= */
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

/* =============================
   UTIL
============================= */
function capitalizeNama(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(" ");
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

function logout() {
  auth.signOut().then(() => location.replace("index.html"));
}
