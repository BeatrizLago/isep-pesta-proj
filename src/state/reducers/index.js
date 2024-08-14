import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import locationReducer from "./locationReducer";
import reviewsReducer from "./reviewsReducer";
import directionsReducer from "./directionsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  review: reviewsReducer,
  direction: directionsReducer,
});

export default rootReducer;
