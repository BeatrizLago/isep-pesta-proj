import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "./Firebase.config";

// Function to fetch from Firestore
export const fetchFromFirestore = async (name) => {
  const querySnapshot = await getDocs(collection(FIREBASE_DB, name));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

// Function to add data to Firestore
export const addToFirestore = async (name, data) => {
  try {
    const docRef = await addDoc(collection(FIREBASE_DB, name), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

// Function to update an existing user document in Firestore
export const updateUserInFirestore = async (user) => {
  try {
    const { uid, displayName, email } = user;

    // Get a reference to the user document in Firestore
    const userRef = doc(collection(FIREBASE_DB, "users"), uid);

    // Check if the user document exists
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user document
      await updateDoc(userRef, {
        displayName,
        email,
      });

      return userRef.id; // Return the ID of the updated user document
    } else {
      console.error("User document does not exist for UID: ", uid);
      return null;
    }
  } catch (error) {
    console.error("Error updating user document: ", error);
    return null;
  }
};

// Function to create a new user document in Firestore
export const createUserInFirestore = async (user) => {
  try {
    const { uid, displayName, email } = user;

    // Get a reference to the user document in Firestore
    const userRef = doc(collection(FIREBASE_DB, "users"), uid);

    // Check if the user document already exists
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        displayName,
        email,
      });

      return userRef.id; // Return the ID of the newly created user document
    } else {
      console.error("User document already exists for UID: ", uid);
      return null;
    }
  } catch (error) {
    console.error("Error creating user document: ", error);
    return null;
  }
};
