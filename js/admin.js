function logout() {
  auth.signOut().then(() => {
    window.location.href = "./index.html";
  });
}