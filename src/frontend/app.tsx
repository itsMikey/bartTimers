import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router} from "react-router-dom";
import Routes from "./routes/Routes";
import store from "./state/Store";
import { Provider } from "react-redux";

const App = () => (
    <Provider store={store}>
        <Router>
            <div>
                <Routes />
            </div>
        </Router>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById("app"));
