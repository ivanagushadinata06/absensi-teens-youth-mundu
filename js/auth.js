function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorEl = document.getElementById("error");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // reset pesan error
  errorEl.innerText = "";

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {

      // 🔑 reset status logout
      sessionStorage.removeItem("isLogout");

      const uid = userCredential.user.uid;

      return db.collection("users").doc(uid).get();
    })
    .then(doc => {
      if (!doc.exists) {
        errorEl.innerText = "Akun tidak terdaftar";
        return;
      }

      const role = doc.data().role;

      if (role === "admin") {
        window.location.replace("./admin.html");
      } else {
        window.location.replace("./petugas-bulan.html");
      }
    })
    .catch(() => {
      // pesan error disederhanakan (UX friendly)
      errorEl.innerText = "Email / Password Salah";
    });
}
