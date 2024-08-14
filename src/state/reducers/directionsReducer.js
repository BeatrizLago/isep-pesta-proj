const initialState = {
  directions: null,
  error: null,
};

const directionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DIRECTIONS_SUCCESS":
      return {
        ...state,
        directions: action.payload, 
        error: null,
      };
    case "GET_DIRECTIONS_FAILURE":
      return {
        ...state,
        directions: null,
        error: action.payload, 
      };
    default:
      return state;
  }
};

export default directionsReducer;
