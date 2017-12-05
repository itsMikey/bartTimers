import * as React from "react";
import {connect} from "react-redux";
import {userMethods} from "../User/UserMethods";
import BartUserSettings from "../Bart/BartUserSettings";
import InitialFlow from "../InitialFlow/InitialFlow";
import Dashboard from "../Dashboard/Dashboard";
import NavBar from "../../controls/Navbar/NavBar";
import {USER_ACTIONS} from "../../state/actions/UserActions";

const mapStateToProps = (state) => ({
    user: {
        loggedIn: false,
        devices: [],
        stations: {
            homeStation: null,
            homeStationArrival: null,
            destinationArrival: null,
            destinationStation: null
        },
        ...state.user
    }
});

const mapDispatchToProps = (dispatch) => ({
    onLoad: (payload) =>
        dispatch({type:  USER_ACTIONS.GET_USER_SETTINGS, payload}),
    isUserLoggedIn: (payload) =>
        dispatch({type:  USER_ACTIONS.IS_USER_LOGGED_IN, payload})
});


class Home extends React.Component<any, any> {

    componentWillMount() {
        // get user login status so we can display proper component
        this.props.isUserLoggedIn(userMethods.checkLogin());
    }
    render() {

        return (
            <div>
                <NavBar
                    dropDown={this.props.user.loggedIn ?
                        {
                            dropDownTitle: "Settings",
                            dropDownLinks: [
                                {
                                    name: "Bart User Settings",
                                    link: "/bart-user-settings"
                                }
                            ]
                        } : null}    />
                {/*Not logged in, show initialFlow page*/}
                {(!this.props.user.loggedIn && <InitialFlow/>)}

                {/*/!*Logged in, no user settings for station, show bart user settings*!/*/}
                { (this.props.user.loggedIn && !userMethods.userHasSettings(this.props.user.stations) && <BartUserSettings/>)}

                {/*/!*logged in and has bart stations*!/*/}
                {this.props.user.loggedIn && userMethods.userHasSettings(this.props.user.stations) && <Dashboard/>}
                {/*<Dashboard/>*/}
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
