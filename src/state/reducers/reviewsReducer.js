const initialState = {
  reviewInfo: null,
  reviews: [],
  error: null,
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_REVIEW_SUCCESS":
      return { ...state, reviewInfo: action.payload, error: null };
    case "FETCH_REVIEW_SUCCESS":
      return { ...state, reviews: action.payload, error: null };
    case "ADD_REVIEW_FAILURE":
      return { ...state, reviewInfo: null, error: action.error };
    case "FETCH_REVIEW_FAILURE":
      return { ...state, reviews: [], error: action.error };
    default:
      return state;
  }
};

export default reviewsReducer;
