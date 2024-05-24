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

export const fetchLocations = () => async (dispatch) => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "locations"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    dispatch({ type: "FETCH_LOCATIONS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_LOCATIONS_FAILURE", error });
  }
};
