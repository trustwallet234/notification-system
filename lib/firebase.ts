// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOhvRHwwOKtcn_kcSb1lkhe9tPMDbKlJs",
  authDomain: "assignment-system-164f3.firebaseapp.com",
  projectId: "assignment-system-164f3",
  storageBucket: "assignment-system-164f3.firebasestorage.app",
  messagingSenderId: "196694616236",
  appId: "1:196694616236:web:d948622decd2644aa05709"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
