
const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN_SUCCESS":
    case "SIGN_UP_SUCCESS":
    case "GET_CURRENT_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !action.payload.isAnonymous,
        error: null,
      };
    case "SIGN_IN_ANONYMOUS_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: false,
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