// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // 👈 Agregado
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfRuTiT3P3o-K46X74Leu32_UO0pa0HNg",
  authDomain: "login-negocios-otumba.firebaseapp.com",
  projectId: "login-negocios-otumba",
  storageBucket: "login-negocios-otumba.firebasestorage.app",
  messagingSenderId: "750810432088",
  appId: "1:750810432088:web:1b0545438bc6982b99002d",
  measurementId: "G-5QRKYJSJ4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 👈 Agregado

export { auth, db }; // 👈 Exporta ambos