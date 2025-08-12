// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ7kHUFlwQ4b_KAYJHqsOnNvnbbExEVK4",
  authDomain: "sutcundev.firebaseapp.com",
  projectId: "sutcundev",
  storageBucket: "sutcundev.firebasestorage.app",
  messagingSenderId: "556247586808",
  appId: "1:556247586808:web:d12d81eeea1a4acec6280d",
  measurementId: "G-16LG9MJ009"
};

// Initialize Firebase

// Prevent re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

console.log("Firebase initialized:", getApps().length);


export { auth };