auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const params = new URLSearchParams(window.location.search);
const bulanIndex = parseInt(params.get("bulan"));
const container = document.getElementById("tanggalContainer");
if (!container || isNaN(bulanIndex)) return;

const tahun = new Date().getFullYear();
const lastDay = new Date(tahun, bulanIndex + 1, 0).getDate();

for (let tgl = 1; tgl <= lastDay; tgl++) {
  const date = new Date(tahun, bulanIndex, tgl);

  if (date.getDay() === 0) {
    const iso = date.toISOString().split("T")[0];

    const btn = document.createElement("button");
    btn.innerText = `Minggu, ${tgl}`;
    btn.style.marginBottom = "8px";

    btn.onclick = () => {
      window.location.href = `petugas-absen.html?tanggal=${iso}`;
    };

    container.appendChild(btn);
  }
}
