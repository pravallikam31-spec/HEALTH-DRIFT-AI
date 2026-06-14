import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEQFeL_z-uBEjHKPp00Yuqo85ZOZxfcus",
  authDomain: "health-drift-ai.firebaseapp.com",
  projectId: "health-drift-ai",
  storageBucket: "health-drift-ai.firebasestorage.app",
  messagingSenderId: "486925716486",
  appId: "1:486925716486:web:2ecfb81205a02495d0c787",
  measurementId: "G-FYHTCWE3S9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
