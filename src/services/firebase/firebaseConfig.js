import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGg5WnuPzXTPL9cH3USltUtcBg5omanAk",
  authDomain: "test-6cb63.firebaseapp.com",
  projectId: "test-6cb63",
  storageBucket: "test-6cb63.appspot.com",
  messagingSenderId: "151618180338",
  appId: "1:151618180338:web:ad14d848e0be8afa82ac6b",
  measurementId: "G-V5HSS82B9H",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});