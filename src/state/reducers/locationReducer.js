const initialState = {
  locationInfo: null,
  locations: [],
  error: null,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_LOCATIONS_SUCCESS":
      return { ...state, locations: action.payload, error: null };
    case "FETCH_LOCATIONS_FAILURE":
      return { ...state, locations: [], error: action.error };
    default:
      return state;
  }
};

export default locationReducer;
