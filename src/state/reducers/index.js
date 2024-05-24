import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import locationReducer from "./locationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
});

export default rootReducer;
