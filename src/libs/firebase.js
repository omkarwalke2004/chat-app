import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage" 

const firebaseConfig = {
  apiKey: "AIzaSyCGRtiWgwOPg6DI-Fmw3g3cKah4F8pXp6Q",
  authDomain: "reactchat-3ddde.firebaseapp.com",
  projectId: "reactchat-3ddde",
  storageBucket: "reactchat-3ddde.appspot.com",
  messagingSenderId: "656454467446",
  appId: "1:656454467446:web:2187835013e177d9cc0457",
  measurementId: "G-QH1S4C1JPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
