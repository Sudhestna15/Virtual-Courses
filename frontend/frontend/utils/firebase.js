// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "logintrainix.firebaseapp.com",
  projectId: "logintrainix",
  storageBucket: "logintrainix.firebasestorage.app",
  messagingSenderId: "90353309323",
  appId: "1:90353309323:web:3d373c113dc4cf7c2c668e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth=getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider} 
