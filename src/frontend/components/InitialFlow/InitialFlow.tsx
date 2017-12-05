// InitialFlow shows tabs to either register or login
import * as React from "React";
import {connect} from "react-redux";
import Register from "../Register/Register";
import Login from "../Login/Login";
import {IState} from "../../../common/constant/interfaces/state/IState";

const mapStateToProps = (state: IState) => ({
    ...state
});

const mapDispatchToProps = (dispatch) => ({});

class InitialFlow extends React.Component<any, any> {
    constructor() {
        super();
        // initially highlight register tab
        this.state = {
            activeTab: "Register"
        };
        this.makeTabActive = this.makeTabActive.bind(this);
    }

    makeTabActive(activeTab) {
        this.setState((state) => ({
            ...state,
            activeTab: activeTab
        }));
    }

    render() {
        return (
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-half">
                            <div className="tabs is-medium">
                                <ul>
                                    <li onClick={(e) => this.makeTabActive(e.currentTarget.getAttribute("value"))}
                                        className={(this.state.activeTab === "Register") ? "is-active" : "is-inactive"}
                                        value="Register"><a>Register</a></li>

                                    <li onClick={(e) => this.makeTabActive(e.currentTarget.getAttribute("value"))}
                                        className={(this.state.activeTab === "Login") ? "is-active" : "is-inactive"}
                                        value="Login"><a>Login</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-half">
                            {/*properly show the active tab*/}
                            {(this.state.activeTab === "Register" && <Register/>)}
                            {(this.state.activeTab === "Login" && <Login/>)}
                        </div>
                    </div>
                </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialFlow);
