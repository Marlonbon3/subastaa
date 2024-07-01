import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKBnZqnACO_ef_AeKtRa21o_ufzYCX_kY",
  authDomain: "ibai-8e176.firebaseapp.com",
  databaseURL: "https://ibai-8e176-default-rtdb.firebaseio.com",
  projectId: "ibai-8e176",
  storageBucket: "ibai-8e176.appspot.com",
  messagingSenderId: "603717739940",
  appId: "1:603717739940:web:4efaf10710c43d40edcd31",
  measurementId: "G-9DHT5YCN95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
