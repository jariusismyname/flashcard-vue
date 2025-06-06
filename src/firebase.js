// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
   apiKey: "AIzaSyCNoKobGbeYDsKCI94D2Ph_edKedFYL6xE",
  authDomain: "flashcard-98d73.firebaseapp.com",
  projectId: "flashcard-98d73",
  storageBucket: "flashcard-98d73.firebasestorage.app",
  messagingSenderId: "207797974839",
  appId: "1:207797974839:web:03e5f878d60083be3bccb2",
  measurementId: "G-N539CM5MLT"  // ...other keys from your Firebase config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // <-- This is the missing part


export { auth, db }; // ✅ Export both
