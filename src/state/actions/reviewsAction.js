import { FIREBASE_DB } from "../../services/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const addReviewToFirestore = async (data) => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "reviews"), data);
      dispatch({ type: "ADD_REVIEW_SUCCESS", payload: docRef });
    } catch (error) {
      dispatch({ type: "ADD_REVIEW_FAILURE", error });
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
      dispatch({ type: "FETCH_REVIEW_SUCCESS", payload: reviews });
    } catch (error) {
      dispatch({ type: "FETCH_REVIEW_FAILURE", error });
    }
  };