const initialState = {
  userInfo: null,
  users: [],
  error: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_USER_SUCCESS":
    case "FETCH_USER_SUCCESS":
    case "UPDATE_USER_SUCCESS":
    case "UPDATE_USER_WHEELCHAIR_SUCCESS":
      return { ...state, userInfo: action.payload, error: null };
    case "CREATE_USER_FAILURE":
    case "FETCH_USER_FAILURE":
    case "UPDATE_USER_FAILURE":
    case "UPDATE_USER_WHEELCHAIR_FAILURE":
    case "CREATE_USER_EXISTS":
    case "FETCH_USER_NOT_FOUND":
    case "UPDATE_USER_NOT_FOUND":
      return { ...state, userInfo: null, error: action.error };
    case "FETCH_USERS_SUCCESS":
      return { ...state, users: action.payload, error: null };
    case "FETCH_USERS_FAILURE":
      return { ...state, users: [], error: action.error };
    default:
      return state;
  }
};

export default userReducer;
