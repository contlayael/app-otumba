// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
// Asegúrate de importar initializeAuth y getReactNativePersistence
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Importa ReactNativeAsyncStorage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getStorage } from 'firebase/storage';

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
// const app = initializeApp(firebaseConfig);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// Aquí es donde necesitas usar initializeAuth y pasarle la persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app); // 👈 Agregado
const storage = getStorage(app); 


export { auth, db, app, storage }; // 👈 Exporta ambos