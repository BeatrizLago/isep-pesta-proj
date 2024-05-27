import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import locationReducer from "./locationReducer";
import reviewsReducer from "./reviewsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  review: reviewsReducer,
});

export default rootReducer;
