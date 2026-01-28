document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bulanContainer");

  if (!container) {
    console.error("bulanContainer tidak ditemukan");
    return;
  }

  const daftarBulan = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
  ];

  daftarBulan.forEach((nama, index) => {
    const btn = document.createElement("button");
    btn.textContent = nama;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.marginBottom = "10px";

    btn.onclick = () => {
      window.location.href = `petugas-tanggal.html?bulan=${index}`;
    };

    container.appendChild(btn);
  });
});

function logout() {
  window.location.replace("index.html");
}
