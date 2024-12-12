import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlA2q1ngxHJW_IhwnpdcYcB7K2bRdOfsI",
  authDomain: "tripwebsite-8a2bb.firebaseapp.com",
  projectId: "tripwebsite-8a2bb",
  storageBucket: "tripwebsite-8a2bb.firebasestorage.app",
  messagingSenderId: "505286745404",
  appId: "1:505286745404:web:79835ff53861dc2e51d239",
  measurementId: "G-B60WB01X4E",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
