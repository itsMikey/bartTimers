import {combineReducers} from "redux";
import userReducer from "./UserReducer";
import bartReducer from "./BartReducer";

export default combineReducers({
    bart: bartReducer,
    user: userReducer
});
