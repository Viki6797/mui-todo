// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoJRQ2dg9U5_f5lvPcQE93nSC0ooUKOBs",
  authDomain: "mui-todo-d6135.firebaseapp.com",
  projectId: "mui-todo-d6135",
  storageBucket: "mui-todo-d6135.firebasestorage.app",
  messagingSenderId: "201973716228",
  appId: "1:201973716228:web:44f8e37afd64a30277ec51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
