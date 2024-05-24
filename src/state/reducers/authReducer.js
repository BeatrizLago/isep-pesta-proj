const initialState = {
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN_SUCCESS":
    case "SIGN_UP_SUCCESS":
    case "SIGN_IN_ANONYMOUS_SUCCESS":
    case "GET_CURRENT_USER_SUCCESS":
      return { ...state, user: action.payload, error: null };
    case "SIGN_IN_FAILURE":
    case "SIGN_UP_FAILURE":
    case "SIGN_IN_ANONYMOUS_FAILURE":
    case "GET_CURRENT_USER_FAILURE":
      return { ...state, user: null, error: action.error };
    default:
      return state;
  }
};

export default authReducer;
