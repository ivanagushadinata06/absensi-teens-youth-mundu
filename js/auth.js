function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {

      // 🔑 INI BARIS PENTING (RESET STATUS LOGOUT)
      sessionStorage.removeItem("isLogout");

      const uid = userCredential.user.uid;

      db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) return;

        const role = doc.data().role;

        if (role === "admin") {
          window.location.replace("./admin.html");
        } else {
          window.location.replace("./petugas-bulan.html");
        }
      });
    })
    .catch(err => {
      document.getElementById("error").innerText = err.message;
    });
}
