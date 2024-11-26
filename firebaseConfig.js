// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVTy2m1kbtI7Xxi1vmu4YEeUuOpLcGEoU",
  authDomain: "synergy-2a320.firebaseapp.com",
  projectId: "synergy-2a320",
  storageBucket: "synergy-2a320.firebasestorage.app",
  messagingSenderId: "506688955206",
  appId: "1:506688955206:web:2193b153dd3d9a5276fb47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)