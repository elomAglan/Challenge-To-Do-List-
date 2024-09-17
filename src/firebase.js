// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVDB3Q9bPvcdzon__9KEWkx7awoxoQ31k",
  authDomain: "todolist-67074.firebaseapp.com",
  projectId: "todolist-67074",
  storageBucket: "todolist-67074.appspot.com",
  messagingSenderId: "838489062665",
  appId: "1:838489062665:web:050645f467f5565a7127d8",
  measurementId: "G-0RCMDZ82E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
