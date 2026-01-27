function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) return;

        const role = doc.data().role;
       if (role === "admin") {
  window.location.href = "./admin.html";
} else {
  window.location.href = "./petugas.html";
}
      });
    })
    .catch(err => {
      document.getElementById("error").innerText = err.message;
    });

}
