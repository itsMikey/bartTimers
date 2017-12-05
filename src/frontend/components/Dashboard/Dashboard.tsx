import * as React from "react";
import {connect} from "react-redux";
import Map from "./Map";
import moment = require("moment");
import {bartMethods} from "../Bart/BartMethods";
import Card from "../../controls/Card/Card";
import CardHeader from "../../controls/Card/CardHeader";
import CardContent from "../../controls/Card/CardContent";
import Expire from "../../controls/Expire/Expire";
import {IClientFacingRoutes} from "../../../common/api/route/IClientFacingRoute";
import {BART_ACTIONS} from "../../state/actions/BartActions";
import {IState} from "../../../common/constant/interfaces/state/IState";
import {IUser} from "../../../models/User/User";
import store from "../../state/Store";
import WebNotification from "../../controls/WebNotification/WebNotification";

const mapStateToProps = (state: IState) => ({
    bart: {
        bartStations: null,
        routes: null
    },
    user: {
        loggedIn: false,
        devices: [],
        stations: {
            homeStation: null,
            homeStationArrival: null,
            destinationArrival: null,
            destinationStation: null
        }
    },
    ...state
} as IState);

const mapDispatchToProps = (dispatch) => ({
    getAvailableRoute: (payload) =>
        dispatch({type: BART_ACTIONS.GET_AVAILABLE_ROUTES, payload})
});

class Dashboard extends React.Component<any, any> {
    props: {
        getAvailableRoute;
        bart: {
            routes: IClientFacingRoutes[]
        }
        user: IUser
    };

    constructor() {
        super();

        this.state = {
            arrival: null,
            destination: null,
            origin: null,
            notificationOptions: {
                title: "",
                body: "",
                lang: "en",
                ignore: true
            }
        };
        this.createWebNotifications = this.createWebNotifications.bind(this);
    }

    componentWillMount() {
        // check if map should focus on 2nd part of trip
        const initialTimeToCompare = moment(this.props.user.stations.destinationArrival, "hh:mma");
        const currentTime = moment().format();

        // if current time is after our first arrival, switch origin and destination
        if (initialTimeToCompare.isAfter(currentTime)) {
            this.setState((state) => ({
                ...state,
                arrival: this.props.user.stations.destinationArrival,
                destination: this.props.user.stations.destinationStation,
                origin: this.props.user.stations.homeStation
            }));
        } else {
            this.setState((state) => ({
                ...state,
                arrival: this.props.user.stations.homeStationArrival,
                destination: this.props.user.stations.homeStation,
                origin: this.props.user.stations.destinationStation
            }));
        }
    }

    componentDidMount() {
        // get routes on mount
        this.props.getAvailableRoute(bartMethods.routePlanner(this.state.destination.abbr, this.state.origin.abbr, this.state.arrival));
        // wait for routes to populate so we can create the web notifications
        store.subscribe(() => {
            const globalState = store.getState() as IState;
            if (globalState.bart.routes) {
                this.createWebNotifications();
            }
        });
    }

    createWebNotifications() {
        if (this.props.bart.routes) {

            const currentTime = moment();
            let timeout: number;

            // set notification to be 5 minutes before arrival for each route
            this.props.bart.routes.map((route: IClientFacingRoutes) => {

                const timeToCompare = moment(route.originDepartureTime, "h:mm A");
                const timeDifference = timeToCompare.diff(currentTime, "minutes");

                // less than 5 minutes? alert now
                if (timeDifference <= 5 && 0 < timeDifference) {
                    timeout = 1000;
                } else if (0 < timeDifference) {
                    // if time is not negative, we will set the notification to be 5 minutes before arrival
                    timeToCompare.subtract(5, "minutes");
                    timeout = timeToCompare.diff(currentTime, "milliseconds");
                }

                // timeout? lets notify
                if (timeout) {
                    setTimeout(() => {
                        this.setState((state) => ({
                            ...state,
                            notificationOptions: {
                                ...state.notificationOptions,
                                title: `${route.destination.name} train arriving in 5 minutes at ${route.origin.name}`,
                                body: `Trip will cost ${route.fare} and will be ${route.tripLength} minutes long`,
                                ignore: false
                            }
                        }));
                    }, timeout);
                }
                timeout = null;
            });
        }
    }

    render() {

        return (
            <div className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-half">
                            {/*Map section*/}
                            <h4 className="is-size-4">Snapshot of your trip</h4>
                            <br/>
                            <Map
                                origin={this.state.origin}
                                destination={this.state.destination}
                            />
                        </div>

                        <div className="column is-half">
                            {/*actual cards holding the route*/}
                            <h4 className="is-size-4">Upcoming Rides</h4>
                            {
                                (this.props.bart.routes) ?
                                    this.props.bart.routes.map((route: IClientFacingRoutes, index) => {
                                        return <Expire key={index} expirationTime={route.originDepartureTime}>
                                            <Card>
                                                <CardHeader>
                                                    {route.origin.name + `->` + route.destination.name}
                                                </CardHeader>

                                                <CardContent>
                                                    <p>
                                                        Origin Train Departure: {route.originDepartureTime} <br/>
                                                        Estimated Destination Arrival:
                                                        <b>{route.destinationArrivalTime}</b>
                                                        <br/>
                                                        Trip Time: {route.tripLength} <br/>
                                                        Fare: ${route.fare} <br/>
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Expire>;
                                    }) : null
                            }
                        </div>
                    </div>
                </div>
                {
                    (this.state.notificationOptions.title && this.state.notificationOptions.body) ?
                        <WebNotification
                            title={this.state.notificationOptions.title}
                            options={
                                {
                                    body: this.state.notificationOptions.body,
                                    lang: this.state.notificationOptions.lang
                                }
                            }
                            ignore={this.state.notificationOptions.ignore}
                        /> : null
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
