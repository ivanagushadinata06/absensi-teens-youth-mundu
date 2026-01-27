// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrLotz8GbxB1IEFeKxs4AHocKYQ54075o",
  authDomain: "absensi-teensyouth-mundu.firebaseapp.com",
  projectId: "absensi-teensyouth-mundu",
  storageBucket: "absensi-teensyouth-mundu.firebasestorage.app",
  messagingSenderId: "907886050098",
  appId: "1:907886050098:web:370b3b70f48e6260cfb52b"
};

// Initialize Firebase (VERSI SCRIPT TAG)
firebase.initializeApp(firebaseConfig);

// Init Auth & Firestore
const auth = firebase.auth();
const db = firebase.firestore();