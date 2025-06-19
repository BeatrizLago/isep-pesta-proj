// authReducer.js
const initialState = {
  user: null, // Pode conter { uid, email, name, isAnonymous }
  isAuthenticated: false, // Será 'true' apenas para utilizadores logados (não anónimos)
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN_SUCCESS":
    case "SIGN_UP_SUCCESS":
    case "GET_CURRENT_USER_SUCCESS": // Esta ação será usada para carregar dados do storage
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !action.payload.isAnonymous, // Se 'isAnonymous' for false, então 'isAuthenticated' é true
        error: null,
      };
    case "SIGN_IN_ANONYMOUS_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: false, // Utilizador anónimo NÃO é considerado "autenticado" para restrições
        error: null,
      };
    case "SIGN_IN_FAILURE":
    case "SIGN_UP_FAILURE":
    case "SIGN_IN_ANONYMOUS_FAILURE":
    case "GET_CURRENT_USER_FAILURE":
      return { ...state, user: null, isAuthenticated: false, error: action.payload };
    case "SIGN_OUT_SUCCESS":
      return { ...state, user: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

export default authReducer;