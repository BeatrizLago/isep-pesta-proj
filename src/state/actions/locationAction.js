import { FIREBASE_DB } from "../../services/firebase/firebaseConfig";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export const fetchLocations = () => async (dispatch) => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "locations"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    dispatch({ type: "FETCH_LOCATIONS_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error fetching locations:", error);
    dispatch({ type: "FETCH_LOCATIONS_FAILURE", error });
  }
};
