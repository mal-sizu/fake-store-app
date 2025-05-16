// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsKSrIYSRxy_gvwkQ2OPjDeohWkwgMLUA",
  authDomain: "project18-d882c.firebaseapp.com",
  projectId: "project18-d882c",
  storageBucket: "project18-d882c.firebasestorage.app",
  messagingSenderId: "474905081877",
  appId: "1:474905081877:web:37c2386a0afc4642d5b61c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  // You can also use sessionStorage or localStorage
});