import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
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


// Function to update an existing user document in Firestore
export const updateUserInFirestore = async (uid, user) => {
  try {
    const { displayName, email, wheelchair } = user;
    const { width, height } = wheelchair;

    // Get a reference to the user document in Firestore
    const userRef = doc(collection(FIREBASE_DB, "users"), uid);

    // Check if the user document exists
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user document
      await updateDoc(userRef, {
        displayName,
        email,
        wheelchair: {
          width,
          height,
        },
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

/*
export const addReviewToFirestore = async (placeId, userId, review) => {
  try {
    const reviewRef = doc(FIREBASE_DB, `reviews/${placeId}/${userId}`);
    await setDoc(reviewRef, review);
    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review: ", error);
    return null;
  }
};*/

export const addToFirestore = async (name, data) => {
  try {
    const docRef = await addDoc(collection(FIREBASE_DB, name), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

export const fetchReviewsFromFirestore = async (locationUUID) => {
  try {
    const reviewsRef = collection(FIREBASE_DB, "reviews");
    const q = query(reviewsRef, where("locationUUID", "==", locationUUID));
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

// Function to update an existing wheelchair user document in Firestore
export const updateUserWheelchairInFirestore = async (uid, user) => {
  try {
    const { wheelchair } = user;
    const { width, height } = wheelchair;

    // Get a reference to the user document in Firestore
    const userRef = doc(collection(FIREBASE_DB, "users"), uid);

    // Check if the user document exists
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user document
      await updateDoc(userRef, {
        wheelchair: {
          width,
          height,
        },
      });

      return userRef.id; // Return the ID of the updated user document
    } else {
      console.error("User document does not exist for UID: ", uid);
      return null;
    }
  } catch (error) {
    console.error("Error updating user wheelchair document: ", error);
    return null;
  }
};

// Function to fetch a specific user document from Firestore
export const fetchUserFromFirestore = async (uid) => {
  const userRef = doc(collection(FIREBASE_DB, "users"), uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  } else {
    console.error("User document does not exist for UID: ", uid);
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
        wheelchair: {
          width: null,
          height: null,
        },
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
