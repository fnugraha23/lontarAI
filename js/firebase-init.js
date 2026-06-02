// File: firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js"; // MODUL INI WAJIB ADA
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTCodMO2Nya0KucIGooCotQD-Aa3UzE0c",
  authDomain: "lontara-e562e.firebaseapp.com",
  projectId: "lontara-e562e",
  storageBucket: "lontara-e562e.firebasestorage.app",
  messagingSenderId: "955288117210",
  appId: "1:955288117210:web:0b96dac548d5185bf32ae3",
  measurementId: "G-CQMJ8MP14J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // KITA EXPORT AGAR BISA DIPAKAI DI FILE LAIN
export const analytics = getAnalytics(app);