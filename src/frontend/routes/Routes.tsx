import * as React from "react";
import {Route} from "react-router-dom";
import Home from "../components/Home/Home";
import BartUserSettings from "../components/Bart/BartUserSettings";

const Routes = () => {
    return (
        <div>
            <Route exact path="/" component={Home}/>
            <Route exact path="/bart-user-settings" component={BartUserSettings}/>
        </div>
    );
};
export default Routes;
