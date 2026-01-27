document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const bulanIndex = parseInt(params.get("bulan"));

  if (isNaN(bulanIndex)) {
    alert("Bulan tidak valid");
    return;
  }

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tahun = 2026; // bisa diganti sesuai kebutuhan
  const judul = document.getElementById("judulBulan");
  const container = document.getElementById("tanggalContainer");

  judul.innerText = `Pilih Tanggal Ibadah – ${namaBulan[bulanIndex]} ${tahun}`;

  const lastDay = new Date(tahun, bulanIndex + 1, 0).getDate();

  for (let tgl = 1; tgl <= lastDay; tgl++) {
    const date = new Date(tahun, bulanIndex, tgl);

    // TETAP hanya hari Minggu (0)
    if (date.getDay() === 0) {
      const dd = String(tgl).padStart(2, "0");
      const namaBln = namaBulan[bulanIndex];
      const tanggalLabel = `${dd} ${namaBln} ${tahun}`;
      const tanggalISO =
        `${tahun}-${String(bulanIndex + 1).padStart(2, "0")}-${dd}`;

      const btn = document.createElement("button");
      btn.innerText = tanggalLabel; // ✅ TANPA KATA "MINGGU"
      btn.style.marginBottom = "10px";

      btn.onclick = () => {
        window.location.href =
          `petugas-absen.html?tanggal=${tanggalISO}&label=${encodeURIComponent(tanggalLabel)}`;
      };

      container.appendChild(btn);
    }
  }
});
