// authActions.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged, // <--- NOVO: Para subscrever mudanças de autenticação do Firebase
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- NOVO: Importe o AsyncStorage

// --- AÇÃO DE LOGIN ---
export const signIn = (email, password) => async (dispatch) => {
  try {
    const response = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
    );

    const userName = response.user.displayName || response.user.email;
    const userData = { // Crie um objeto com os dados que deseja guardar
      uid: response.user.uid,
      email: response.user.email,
      name: userName,
      isAnonymous: false,
    };

    // --- CORREÇÃO: GUARDAR DADOS NO ASYNCSTORAGE APÓS LOGIN BEM SUCEDIDO ---
    await AsyncStorage.setItem('userAuthData', JSON.stringify(userData));
    // ----------------------------------------------------------------------

    dispatch({
      type: "SIGN_IN_SUCCESS",
      payload: userData, // Use o objeto userData completo
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

// --- AÇÃO DE REGISTO ---
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

        const userData = { // Crie um objeto com os dados que deseja guardar
          uid: user.uid,
          email: user.email,
          name: displayName,
          isAnonymous: false,
        };

        // --- CORREÇÃO: GUARDAR DADOS NO ASYNCSTORAGE APÓS REGISTO BEM SUCEDIDO ---
        await AsyncStorage.setItem('userAuthData', JSON.stringify(userData));
        // ------------------------------------------------------------------------

        dispatch({
          type: "SIGN_UP_SUCCESS",
          payload: userData, // Use o objeto userData completo
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

// --- AÇÃO DE LOGIN ANÓNIMO (não persiste no AsyncStorage, pois não é um login "real") ---
export const signInAnonymous = () => async (dispatch) => {
  try {
    const response = await signInAnonymously(FIREBASE_AUTH);
    dispatch({
      type: "SIGN_IN_ANONYMOUS_SUCCESS",
      payload: {
        uid: response.user.uid,
        email: null,
        name: "Utilizador Anónimo",
        isAnonymous: true,
      },
    });
    // Não guardamos utilizadores anónimos no AsyncStorage para não persistir sessões temporárias
  } catch (error) {
    let errorMessage = "Erro desconhecido durante o login anónimo.";
    if (error.code) {
      errorMessage = `Erro de Autenticação Anónima: ${error.code}`;
    }
    dispatch({ type: "SIGN_IN_ANONYMOUS_FAILURE", payload: errorMessage });
  }
};

// --- AÇÃO ORIGINAL GET_CURRENT_USER (pode ser usada, mas a loadUserFromStorage é mais para o Redux) ---
// Esta ação é mais para obter o estado atual do Firebase Auth, que já tem sua própria persistência.
// Para popular o Redux state ao iniciar a app, use 'loadUserFromStorage'.
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
          isAnonymous: user.isAnonymous,
        },
      });
    } else {
      dispatch({ type: "GET_CURRENT_USER_FAILURE", payload: "Nenhum utilizador logado no Firebase." });
    }
  } catch (error) {
    dispatch({ type: "GET_CURRENT_USER_FAILURE", payload: "Erro ao obter utilizador atual do Firebase." });
  }
};

// --- NOVA AÇÃO: CARREGAR UTILIZADOR DO ASYNCSTORAGE ---
// Esta ação deve ser despachada no início da sua aplicação (ex: App.js)
export const loadUserFromStorage = () => async (dispatch) => {
  try {
    const storedUserData = await AsyncStorage.getItem('userAuthData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      // Despacha a ação de sucesso para atualizar o Redux state com os dados guardados
      dispatch({
        type: "GET_CURRENT_USER_SUCCESS", // Reutilize esta ação
        payload: user,
      });
      console.log("Utilizador carregado do AsyncStorage:", user.email);
    } else {
      console.log("Nenhum utilizador encontrado no AsyncStorage.");
      // Se não houver dados no storage, garanta que o estado Redux está limpo
      dispatch({ type: "SIGN_OUT_SUCCESS" }); // Limpa o estado Redux
    }
  } catch (error) {
    console.error("Erro ao carregar utilizador do AsyncStorage:", error);
    // Em caso de erro, limpe o estado para evitar dados inconsistentes
    dispatch({ type: "GET_CURRENT_USER_FAILURE", payload: "Erro ao carregar utilizador do AsyncStorage." });
  }
};

// --- AÇÃO DE LOGOUT ---
export const signOut = () => async (dispatch) => {
  try {
    await FIREBASE_AUTH.signOut();
    // --- CORREÇÃO: REMOVER DADOS DO ASYNCSTORAGE AO FAZER LOGOUT ---
    await AsyncStorage.removeItem('userAuthData');
    // -----------------------------------------------------------
    dispatch({ type: "SIGN_OUT_SUCCESS" });
  } catch (error) {
    dispatch({ type: "SIGN_OUT_FAILURE", payload: "Erro ao fazer logout." });
  }
};

// --- NOVA AÇÃO: SUBSCREVER A MUDANÇAS DE AUTENTICAÇÃO DO FIREBASE ---
// Esta é uma boa prática para manter o estado Redux sincronizado com o Firebase Auth
// se o utilizador for autenticado ou desautenticado por outros meios (ex: expiração de sessão).
export const subscribeToAuthChanges = () => (dispatch) => {
  const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email || (user.isAnonymous ? "Utilizador Anónimo" : "Desconhecido"),
        isAnonymous: user.isAnonymous,
      };
      dispatch({
        type: "GET_CURRENT_USER_SUCCESS",
        payload: userData,
      });
      // Se um utilizador logar via Firebase mas não via a nossa ação (ex: sessão reaberta automaticamente),
      // garantir que também guardamos no AsyncStorage se não for anónimo.
      if (!user.isAnonymous) {
        await AsyncStorage.setItem('userAuthData', JSON.stringify(userData));
      }
    } else {
      // Se não houver utilizador no Firebase Auth, garantir que o nosso Redux e AsyncStorage estão limpos
      dispatch({ type: "SIGN_OUT_SUCCESS" });
      await AsyncStorage.removeItem('userAuthData');
    }
  });
  return unsubscribe; // Retorna a função de unsubscribe para que possa ser limpa no useEffect
};