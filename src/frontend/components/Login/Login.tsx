import * as React from "react";
import {connect} from "react-redux";
import {isValidEmail, isValidPassword} from "../../../common/HelperFunctions";
import {ERROR_CODES} from "../../../common/constant/error-codes";
import {userMethods} from "../User/UserMethods";
import {SUCCESS_CODES} from "../../../common/constant/success-codes";
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
    loginUser: (payload) =>
        dispatch({type:  USER_ACTIONS.LOGIN_USER, payload}),
    populateUser: (payload) =>
        dispatch({type:  USER_ACTIONS.POPULATE_USER, payload})
});


class Login extends React.Component<any, any> {

    constructor() {
        super();
        this.state = {
            loginReq: {
                email: "",
                password: ""
            },
            errorMessage: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(newError) {
        this.setState((state) => ({
            ...state,
            errorMessage: newError
        }));
    }

    handleInputChange(newInput) {
        this.setState((state) => ({
            ...state,
            loginReq: {
                ...state.loginReq,
                ...newInput
            }
        }));
    }

    handleFormSubmit(event) {
        event.preventDefault();
        // form validation
        if (!isValidEmail(this.state.loginReq.email)) {
            this.handleMessage(ERROR_CODES.REGISTER.EMAIL_INVALID);
        } else if (!isValidPassword(this.state.loginReq.password)) {
            this.handleMessage(ERROR_CODES.REGISTER.PASSWORD_INVALID);
        } else {
            this.handleMessage("");
            userMethods.loginUser(this.state.loginReq)
                .then((res) => {
                    if (res.code === 200) {
                        this.handleMessage(SUCCESS_CODES.USER.LOGIN);
                        // login user and store in redux
                        this.props.populateUser(res.data);
                    } else {
                        this.handleMessage(res.message);
                    }
                })
                .catch((fatalErr) => {
                    console.log(fatalErr);
                    return Promise.reject(fatalErr);
                });
        }
    }

    render() {
        return (
            <div className="columns is-centered">
                <div className="column">
                    <br/>
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="field">
                            <div className="control">
                                <label className="label">Email</label>
                                <input className="input" type="email" placeholder="Email"
                                       value={this.state.loginReq.email}
                                       onChange={(e) => this.handleInputChange({email: e.target.value})}/>
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <label className="label">Password</label>
                                <input className="input" type="password" placeholder="*******"
                                       value={this.state.loginReq.password}
                                       onChange={(e) => this.handleInputChange({password: e.target.value})}/>
                            </div>
                        </div>
                        <button className="button is-primary" type="submit">LOGIN</button>
                        {(this.state.errorMessage !== "" &&
                            <p className="has-text-danger">{this.state.errorMessage}</p>)}
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
