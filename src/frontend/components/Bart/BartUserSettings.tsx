// component to update a User's bart settings (stations, arrival time, etc.
import * as React from "react";
import {bartMethods} from "./BartMethods";
import {connect} from "react-redux";
import {dateIntervals} from "../../../common/HelperFunctions";
import {userMethods} from "../User/UserMethods";
import {withRouter} from "react-router";
import {USER_ACTIONS} from "../../state/actions/UserActions";
import {BART_ACTIONS} from "../../state/actions/BartActions";
import {IState} from "../../../common/constant/interfaces/state/IState";

const mapStateToProps = (state: IState) => ({
    bart: state.bart,
    user: null,
    ...state
} as IState);

const mapDispatchToProps = (dispatch) => ({
    getStations: (payload) =>
        dispatch({type: BART_ACTIONS.GET_ALL_BART_STATIONS, payload}),
    populateUserStations: (payload) =>
        dispatch({type:  USER_ACTIONS.POPULATE_USER_BART_STATIONS, payload}),
    populateUser: (payload) =>
        dispatch({type:  USER_ACTIONS.POPULATE_USER, payload})
});

class BartUserSettings extends React.Component<any, any> {
    dateInterval: any;

    constructor() {
        super();
        // get intervals of available bart times
        const startTime: Date = new Date();
        const endTime: Date = new Date();
        startTime.setHours(4, 0);
        endTime.setHours(24, 0);
        this.dateInterval = dateIntervals(startTime, endTime) as string[];

        // set base state to Embarcadero & Fremont
        this.state = {
            errorMessage: "",
            stations: {
                destinationStation: "EMBR",
                destinationArrival: this.dateInterval[12],
                homeStation: "FRMT",
                homeStationArrival: this.dateInterval[52]
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillMount() {
        // before mount, get user stations
        this.props.getStations(bartMethods.getBartStations());

        // set form to match user's settings if available
        this.handleInputChange({
            homeStation: (this.props.user.stations.homeStation.abbr) || "FRMT",
            homeStationArrival: (this.props.user.stations.homeStationArrival) || this.dateInterval[52],
            destinationArrival: (this.props.user.stations.destinationArrival) || this.dateInterval[12],
            destinationStation: (this.props.user.stations.destinationStation.abbr) || "EMBR"
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();

        // send addStationRequest to be added to DB
        userMethods.addUserStations({
            data: {
                stations: {
                    homeStation: this.state.stations.homeStation,
                    homeStationArrival: this.state.stations.homeStationArrival,
                    destinationArrival: this.state.stations.destinationArrival,
                    destinationStation: this.state.stations.destinationStation
                }
            }
        })
            .then(() => {
                if (this.props.user.loggedIn) {
                    // populate user object
                    this.props.populateUser(userMethods.checkLogin());
                    // redirect home
                    this.props.history.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    }

    handleInputChange(newInput) {
        this.setState((state) => ({
            ...state,
            stations: {
                ...state.stations,
                ...newInput
            }
        }));
    }

    render() {
        // check if we can populate form with stations
        if (!this.props.bart.bartStations) {
            return null;
        } else {

            return (
                <div className="container">
                    <form onSubmit={this.handleFormSubmit}>
                        {/*Arrival station section*/}
                        <div className="field is-grouped">
                            <div className="control">
                                <label className="label">Choose your destination Station</label>
                                <div className="select">
                                    <select value={this.state.stations.destinationStation}
                                            name="destinationStation"
                                            onChange={(e) => this.handleInputChange({destinationStation: e.target.value})}>
                                        {this.props.bart.bartStations.map((station) => (
                                            (station.abbr !== this.state.stations.homeStation &&
                                                <option key={station.abbr}
                                                        value={station.abbr}>
                                                    {station.name}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Departure Time section*/}
                            <div className="control">
                                <label className="label">Time you want to reach your destination</label>
                                <div className="select">
                                    <select value={this.state.stations.destinationArrival} name="destinationArrival"
                                            onChange={(e) => this.handleInputChange({destinationArrival: e.target.value})}>
                                        {this.dateInterval.map((interval) => (
                                            <option key={interval}
                                                    value={interval}>{interval}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/*Home station section*/}
                        <div className="field is-grouped">
                            <div className="control">
                                <label className="label">Choose your Home Station</label>
                                <div className="select">
                                    <select value={this.state.stations.homeStation} name="homeStation"
                                            onChange={(e) => this.handleInputChange({homeStation: e.target.value})}>
                                        {this.props.bart.bartStations.map((station) => (
                                            (station.abbr !== this.state.stations.destinationStation &&
                                                <option key={station.abbr}
                                                        value={station.abbr}>
                                                    {station.name}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="control">
                                <label className="label">Time you want to be home</label>
                                <div className="select">
                                    <select value={this.state.stations.homeStationArrival} name="homeStationArrival"
                                            onChange={(e) => this.handleInputChange({homeStationArrival: e.target.value})}>
                                        {this.dateInterval.map((interval) => (
                                            <option key={interval}
                                                    value={interval}>{interval}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                        </div>
                        <button className="button is-primary" type="submit">Submit</button>
                        <p className="has-text-danger">{this.state.errorMessage}</p>
                    </form>
                </div>
            );
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BartUserSettings));
