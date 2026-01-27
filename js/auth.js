function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) {
          document.getElementById("error").innerText =
            "Role user tidak ditemukan";
          return;
        }

        const role = doc.data().role;

        // =========================
        // REDIRECT SESUAI ROLE
        // =========================
        if (role === "admin") {
          window.location.href = "./admin.html";
        } else if (role === "petugas") {
          // 🔥 INI KUNCI PEMISAHAN HALAMAN
          window.location.href = "./petugas-bulan.html";
        } else {
          document.getElementById("error").innerText =
            "Role tidak dikenali";
        }
      });
    })
    .catch(err => {
      document.getElementById("error").innerText = err.message;
    });
}
