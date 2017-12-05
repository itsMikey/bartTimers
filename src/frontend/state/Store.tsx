import {applyMiddleware, createStore} from "redux";
import {promiseMiddleware} from "./middleware/PromiseMiddleware";
import Reducer from "./reducers/Reducer";

// our middleware handles promises
const middleware = applyMiddleware(promiseMiddleware);
const store = createStore(Reducer, middleware);

export default store;
