const params = new URLSearchParams(window.location.search);
const bulan = parseInt(params.get("bulan"));
const container = document.getElementById("tanggalContainer");

const tahun = new Date().getFullYear();
const lastDay = new Date(tahun, bulan + 1, 0).getDate();

for (let tgl = 1; tgl <= lastDay; tgl++) {
  const date = new Date(tahun, bulan, tgl);

  if (date.getDay() === 0) { // Minggu
    const iso = date.toISOString().split("T")[0];

    const btn = document.createElement("button");
    btn.innerText = `Minggu, ${tgl}`;
    btn.onclick = () => {
      window.location.href = `petugas-absen.html?tanggal=${iso}`;
    };

    container.appendChild(btn);
  }
}
