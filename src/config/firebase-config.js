// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVMredXfpa1hWDrzQrkehKwk6C8hI9R1I",
  authDomain: "it-sysarch32-store-alber-28eb4.firebaseapp.com",
  projectId: "it-sysarch32-store-alber-28eb4",
  storageBucket: "it-sysarch32-store-alber-28eb4.appspot.com",
  messagingSenderId: "1041988415807",
  appId: "1:1041988415807:web:e236a00555697edd96638a",
  measurementId: "G-G0H88QNW5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app); 