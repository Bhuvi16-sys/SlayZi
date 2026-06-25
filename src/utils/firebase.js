import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Slayzi's Web Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8UeaRotxV04Byzw7f40XJX0UQNyFUhzw",
  authDomain: "slayzi-e45cc.firebaseapp.com",
  projectId: "slayzi-e45cc",
  storageBucket: "slayzi-e45cc.firebasestorage.app",
  messagingSenderId: "547975922493",
  appId: "1:547975922493:web:0ca12eb7d4d6379fbf7b54",
  measurementId: "G-0R04Z2LZBD"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
