// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7wgAjikB0mBuIo1ddVQneKkVsgH0oj9E",
    authDomain: "study-buddy-db7e9.firebaseapp.com",
    projectId: "study-buddy-db7e9",
    storageBucket: "study-buddy-db7e9.firebasestorage.app",
    messagingSenderId: "991590616276",
    appId: "1:991590616276:web:ecec8da5663c60dd2aff41",
    measurementId: "G-PLXLY8ZR0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
// auth.languageCode = 'it'



