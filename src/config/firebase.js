import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlT3fP_ZDSNWtmbz2I7ClV8cB6GSc2HHk",
  authDomain: "my-project-d8cb0.firebaseapp.com",
  projectId: "my-project-d8cb0",
  storageBucket: "my-project-d8cb0.firebasestorage.app",
  messagingSenderId: "247085766840",
  appId: "1:247085766840:web:4ca21cb33ccf6bb0ca7c4d",
  measurementId: "G-N9YQJB7RYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const  auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()