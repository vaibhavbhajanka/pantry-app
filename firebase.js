// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD654cDvFpx21oCBIQm2igPx5rplcYzsW8",
  authDomain: "pantryapp-a3602.firebaseapp.com",
  projectId: "pantryapp-a3602",
  storageBucket: "pantryapp-a3602.appspot.com",
  messagingSenderId: "132042224692",
  appId: "1:132042224692:web:c188a2aa77f9077c098661"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}