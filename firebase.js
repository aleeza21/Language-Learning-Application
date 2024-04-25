// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRskcdXPKKuILw5eu419l8lD3y4SxlFcU",
  authDomain: "madquiz2-4c644.firebaseapp.com",
  projectId: "madquiz2-4c644",
  storageBucket: "madquiz2-4c644.appspot.com",
  messagingSenderId: "132161492956",
  appId: "1:132161492956:web:6fda710b82436bb7dd2119",
  measurementId: "G-ZSVK7F10F3"
};

const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase authentication with React Native persistence
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase Storage
const storage = getStorage(firebaseApp);

export { auth, storage };