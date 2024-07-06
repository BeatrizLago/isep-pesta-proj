import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendEmailVerification,
  applyActionCode,
  updateProfile,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";

export const signIn = (email, password) => async (dispatch) => {
  try {
    const response = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    
    const updatedUser = response.user;

    dispatch({ type: "SIGN_IN_SUCCESS", payload: updatedUser });
  } catch (error) {
    dispatch({ type: "SIGN_IN_FAILURE", error });
  }
};

export const signUp =
  (email, password, firstName, lastName) => async (dispatch) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

      const displayName =
        firstName && lastName ? `${firstName} ${lastName}` : email;

      await updateProfile(user, { displayName });

      await sendEmailVerification(user, {
        handleCodeInApp: true,
        url: "https://test-6cb63.firebaseapp.com",
      });

      dispatch({ type: "SIGN_UP_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "SIGN_UP_FAILURE", error });
    }
  };

export const signInAnonymous = () => async (dispatch) => {
  try {
    const response = await signInAnonymously(FIREBASE_AUTH);
    dispatch({ type: "SIGN_IN_ANONYMOUS_SUCCESS", payload: response.user });
  } catch (error) {
    dispatch({ type: "SIGN_IN_ANONYMOUS_FAILURE", error });
  }
};

export const getCurrentUser = () => async (dispatch) => {
  try {
    const response = FIREBASE_AUTH.currentUser;
    dispatch({ type: "GET_CURRENT_USER_SUCCESS", payload: response.user });
  } catch (error) {
    dispatch({ type: "GET_CURRENT_USER_FAILURE", error });
  }
};
