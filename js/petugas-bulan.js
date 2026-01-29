document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bulanContainer");

  if (!container) {
    console.error("bulanContainer tidak ditemukan");
    return;
  }

  // 🔐 Cek login
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.replace("index.html");
      return;
    }

    const daftarBulan = [
      "Januari", "Februari", "Maret", "April",
      "Mei", "Juni", "Juli", "Agustus",
      "September", "Oktober", "November", "Desember"
    ];

    container.innerHTML = "";

    daftarBulan.forEach((nama, index) => {
      const item = document.createElement("div");
      item.className = "bulan-item";

      item.innerHTML = `
        <div class="bulan-angka">${index + 1}</div>
        <div class="bulan-nama">${nama}</div>
      `;

      item.onclick = () => {
        window.location.href = `petugas-tanggal.html?bulan=${index}`;
      };

      container.appendChild(item);
    });
  });
});

// 🚪 Logout aman
function logout() {
  auth.signOut().then(() => {
    window.location.replace("index.html");
  });
}
