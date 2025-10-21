import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKjp5hcPlHkkW1V6f-knhui_TL_Jn4Pzg",
  authDomain: "interviewforge-306d9.firebaseapp.com",
  projectId: "interviewforge-306d9",
  storageBucket: "interviewforge-306d9.firebasestorage.app",
  messagingSenderId: "767970551333",
  appId: "1:767970551333:web:1ed24486dd8ac1cc5701cc",
  measurementId: "G-MZY1NTQ7KP",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
