/************************************************
 * PROTEKSI LOGIN
 ************************************************/
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

/************************************************
 * DATA BULAN
 ************************************************/
const daftarBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

/************************************************
 * TAMPILKAN BULAN
 ************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bulanContainer");

  // kalau elemen tidak ada, hentikan dengan aman
  if (!container) {
    console.error("bulanContainer tidak ditemukan");
    return;
  }

  daftarBulan.forEach((namaBulan, index) => {
    const btn = document.createElement("button");
    btn.innerText = namaBulan;
    btn.style.marginBottom = "10px";

    btn.onclick = () => {
      window.location.href = `petugas-tanggal.html?bulan=${index}`;
    };

    container.appendChild(btn);
  });
});
