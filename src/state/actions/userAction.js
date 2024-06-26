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
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import { FIREBASE_STORAGE } from "../../services/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const fetchUsers = () => async (dispatch) => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "users"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    dispatch({ type: "FETCH_USERS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_USERS_FAILURE", error });
  }
};

export const createUser = () => async (dispatch) => {
  try {
    const { uid, displayName, email, photoURL } = FIREBASE_AUTH.currentUser;
    const userRef = doc(collection(FIREBASE_DB, "users"), uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        wheelchair: { width: null, height: null },
      });
      dispatch({
        type: "CREATE_USER_SUCCESS",
        payload: { id: userRef.id, displayName, email, photoURL },
      });
    } else {
      console.error("User document already exists for UID: ", uid);
      dispatch({
        type: "CREATE_USER_EXISTS",
        error: "User document already exists",
      });
    }
  } catch (error) {
    dispatch({ type: "CREATE_USER_FAILURE", error });
  }
};

export const fetchUser = () => async (dispatch) => {
  try {
    const userRef = doc(
      collection(FIREBASE_DB, "users"),
      FIREBASE_AUTH.currentUser.uid
    );
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      dispatch({
        type: "FETCH_USER_SUCCESS",
        payload: { id: userDoc.id, ...userDoc.data() },
      });
    } else {
      console.error("User document does not exist for UID: ", uid);
      dispatch({ type: "FETCH_USER_NOT_FOUND", error: "User not found" });
    }
  } catch (error) {
    dispatch({ type: "FETCH_USER_FAILURE", error });
  }
};

export const updateUser = (uid, user) => async (dispatch) => {
  try {
    const { displayName, email, wheelchair } = user;
    const userRef = doc(collection(FIREBASE_DB, "users"), uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, { displayName, email, wheelchair });
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: { id: uid, displayName, email, wheelchair },
      });
    } else {
      console.error("User document does not exist for UID: ", uid);
      dispatch({ type: "UPDATE_USER_NOT_FOUND", error: "User not found" });
    }
  } catch (error) {
    dispatch({ type: "UPDATE_USER_FAILURE", error });
  }
};

export const uploadImageToFirebase = async (uri) => {
  if (!uri) return null;

  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const storageRef = ref(FIREBASE_STORAGE, filename);

  try {
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    console.log("Uploaded image URL: ", url);
    return url;
  } catch (e) {
    console.error("Error uploading image: ", e);
    throw e;
  }
};

export const updateUserPhotoURL = (url) => async (dispatch) => {
  try {
    const userRef = doc(
      collection(FIREBASE_DB, "users"),
      FIREBASE_AUTH.currentUser.uid
    );
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        photoURL: url,
      });

      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: { id: userDoc.id, photoURL: url, ...userDoc.data() },
      });
    } else {
      console.error("User document does not exist for UID: ", uid);
      dispatch({ type: "UPDATE_USER_NOT_FOUND", error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user document: ", error);
    dispatch({ type: "UPDATE_USER_FAILURE", error });
  }
};

export const updateUserWheelchair = (user) => async (dispatch) => {
  try {
    const { wheelchair } = user;
    const { width, height } = wheelchair;
    const userRef = doc(
      collection(FIREBASE_DB, "users"),
      FIREBASE_AUTH.currentUser.uid
    );
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        wheelchair: {
          width,
          height,
        },
      });
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: { id: userDoc.id, ...userDoc.data() },
      });
    } else {
      console.error("User document does not exist for UID: ", uid);
      dispatch({ type: "UPDATE_USER_NOT_FOUND", error: "User not found" });
    }
  } catch (error) {
    dispatch({ type: "UPDATE_USER_FAILURE", error });
  }
};
