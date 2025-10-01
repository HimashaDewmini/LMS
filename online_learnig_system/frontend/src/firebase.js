// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6Q1_YIKiOYYkiyvCNUbZ1vKe6krdyLNI",
  authDomain: "onlinecourse-55749.firebaseapp.com",
  projectId: "onlinecourse-55749",
  storageBucket: "onlinecourse-55749.firebasestorage.app",
  messagingSenderId: "236440393716",
  appId: "1:236440393716:web:6e2d261cb16af30efc0ba1",
  measurementId: "G-JVVR7HBRH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

