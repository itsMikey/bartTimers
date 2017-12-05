// component to register user
import * as React from "react";
import {isValidEmail, isValidPassword} from "../../../common/HelperFunctions";
import {ERROR_CODES} from "../../../common/constant/error-codes";
import {userMethods} from "../User/UserMethods";
import {SUCCESS_CODES} from "../../../common/constant/success-codes";
import {connect} from "react-redux";
import {USER_ACTIONS} from "../../state/actions/UserActions";
import {IUser} from "../../../models/User/User";

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
    } as IUser
});

const mapDispatchToProps = (dispatch) => ({
    populateUser: (payload) =>
        dispatch({type: USER_ACTIONS.POPULATE_USER, payload})
});


class Register extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            registerReq: {
                email: "",
                password: ""
            },
            errorMessage: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        // form validation
        if (!isValidEmail(this.state.registerReq.email)) {
            this.handleMessage(ERROR_CODES.REGISTER.EMAIL_INVALID);
        } else if (!isValidPassword(this.state.registerReq.password)) {
            this.handleMessage(ERROR_CODES.REGISTER.PASSWORD_INVALID);
        } else {
            this.handleMessage("");
            // upon registration, populate user ( will be redirected)
            userMethods.registerUser({data: {...this.state.registerReq}})
                .then((res) => {
                    if (res.code === 200) {
                        this.handleMessage(SUCCESS_CODES.USER.REGISTERED);
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

    handleMessage(newError) {
        this.setState((state) => ({
            ...state,
            errorMessage: newError
        }));
    }

    handleInputChange(newInput) {
        this.setState((state) => ({
            ...state,
            registerReq: {
                ...state.registerReq,
                ...newInput
            }
        }));
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
                                       value={this.state.registerReq.email}
                                       onChange={(e) => this.handleInputChange({email: e.target.value})}/>
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <label className="label">Password</label>
                                <input className="input" type="password" placeholder="*******"
                                       value={this.state.registerReq.password}
                                       onChange={(e) => this.handleInputChange({password: e.target.value})}/>
                            </div>
                        </div>
                        <button className="button is-primary" type="submit">Submit</button>
                        {(this.state.errorMessage !== "" &&
                            <p className="has-text-danger">{this.state.errorMessage}</p>)}
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);



