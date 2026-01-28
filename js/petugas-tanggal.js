document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const bulanIndex = parseInt(params.get("bulan"));

  if (isNaN(bulanIndex)) {
    document.getElementById("judulBulan").innerText =
      "Bulan tidak valid";
    return;
  }

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tahun = 2026; // bisa diubah nanti
  const container = document.getElementById("tanggalContainer");
  const judul = document.getElementById("judulBulan");

  judul.innerText = `Pilih Tanggal Ibadah – ${namaBulan[bulanIndex]} ${tahun}`;

  const lastDay = new Date(tahun, bulanIndex + 1, 0).getDate();

  for (let tgl = 1; tgl <= lastDay; tgl++) {
    const date = new Date(tahun, bulanIndex, tgl);

    // HANYA hari Minggu
    if (date.getDay() === 0) {
      const dd = String(tgl).padStart(2, "0");
      const label = `${dd} ${namaBulan[bulanIndex]} ${tahun}`;
      const iso =
        `${tahun}-${String(bulanIndex + 1).padStart(2, "0")}-${dd}`;

      const btn = document.createElement("button");
      btn.textContent = label;
      btn.style.display = "block";
      btn.style.width = "100%";
      btn.style.marginBottom = "10px";

      btn.onclick = () => {
        window.location.href =
          `petugas-absen.html?tanggal=${iso}&label=${encodeURIComponent(label)}`;
      };

      container.appendChild(btn);
    }
  }
});

function logout() {
  window.location.replace("index.html");
}
