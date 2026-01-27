const bulan = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

const container = document.getElementById("bulanContainer");

bulan.forEach((nama, index) => {
  const btn = document.createElement("button");
  btn.innerText = nama;
  btn.style.marginBottom = "10px";

  btn.onclick = () => {
    window.location.href = `petugas-tanggal.html?bulan=${index}`;
  };

  container.appendChild(btn);
});
