import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./Firebase.config";

// Function to fetch locations from Firestore
export const fetchLocationsFromFirestore = async (name) => {
  const querySnapshot = await getDocs(collection(FIREBASE_DB, name));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

// Function to add data to Firestore
export const addLocationsToFirestore = async (data) => {
  try {
    const docRef = await addDoc(collection(FIREBASE_DB, "locations"), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};
