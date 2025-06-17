import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendEmailVerification,
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

    const userName = response.user.displayName || response.user.email;

    dispatch({
      type: "SIGN_IN_SUCCESS",
      payload: {
        uid: response.user.uid,
        email: response.user.email,
        name: userName,
        isAnonymous: false, // Este utilizador está logado, NÃO é anónimo
      },
    });
  } catch (error) {
    let errorMessage = "Erro desconhecido ao fazer login.";
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Utilizador desativado.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Email ou palavra-passe incorretos.';
          break;
        default:
          errorMessage = 'Erro ao fazer login. Tente novamente.';
      }
    }
    dispatch({ type: "SIGN_IN_FAILURE", payload: errorMessage });
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

        dispatch({
          type: "SIGN_UP_SUCCESS",
          payload: {
            uid: user.uid,
            email: user.email,
            name: displayName,
            isAnonymous: false, // Este utilizador registou-se, NÃO é anónimo
          },
        });
      } catch (error) {
        let errorMessage = "Erro desconhecido durante o registo.";
        if (error.code) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'Este email já está em uso.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Email inválido.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Palavra-passe muito fraca.';
              break;
            default:
              errorMessage = 'Erro ao registar. Tente novamente.';
          }
        }
        dispatch({ type: "SIGN_UP_FAILURE", payload: errorMessage });
      }
    };

export const signInAnonymous = () => async (dispatch) => {
  try {
    const response = await signInAnonymously(FIREBASE_AUTH);
    dispatch({
      type: "SIGN_IN_ANONYMOUS_SUCCESS",
      payload: {
        uid: response.user.uid,
        email: null,
        name: "Utilizador Anónimo", // Nome padrão para anónimos
        isAnonymous: true, // ESTA é a flag crucial: true para anónimo
      },
    });
  } catch (error) {
    let errorMessage = "Erro desconhecido durante o login anónimo.";
    if (error.code) {
      errorMessage = `Erro de Autenticação Anónima: ${error.code}`;
    }
    dispatch({ type: "SIGN_IN_ANONYMOUS_FAILURE", payload: errorMessage });
  }
};

export const getCurrentUser = () => async (dispatch) => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      dispatch({
        type: "GET_CURRENT_USER_SUCCESS",
        payload: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email || (user.isAnonymous ? "Utilizador Anónimo" : "Desconhecido"),
          isAnonymous: user.isAnonymous, // Obtém a flag diretamente do Firebase
        },
      });
    } else {
      dispatch({ type: "GET_CURRENT_USER_FAILURE", payload: "Nenhum utilizador logado." });
    }
  } catch (error) {
    dispatch({ type: "GET_CURRENT_USER_FAILURE", payload: "Erro ao obter utilizador atual." });
  }
};

export const signOut = () => async (dispatch) => {
  try {
    await FIREBASE_AUTH.signOut();
    dispatch({ type: "SIGN_OUT_SUCCESS" });
  } catch (error) {
    dispatch({ type: "SIGN_OUT_FAILURE", payload: "Erro ao fazer logout." });
  }
};