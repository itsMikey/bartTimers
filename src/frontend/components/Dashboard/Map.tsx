import * as React from "react";
import {withScriptjs, GoogleMap, Marker, withGoogleMap, MapWithAMarker, DirectionsRenderer} from "react-google-maps";

const {compose, withProps, lifecycle} = require("recompose");

declare const google: any;
const Map = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAjzNenYklRrVlZy-o6DlfLPQsG8HhDL4Q&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `400px`}}/>,
        mapElement: <div style={{height: `100%`, width: "80%"}}/>
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidMount() {
            const DirectionsService = new google.maps.DirectionsService();
            const origin = new google.maps.LatLng(this.props.origin.location[1], this.props.origin.location[0]);
            const destination = new google.maps.LatLng(this.props.destination.location[1], this.props.destination.location[0]);

            // if time is before destinationArrival, put map to destination, else opposite
            DirectionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.TRANSIT
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result
                    });
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    })
)((props) =>
    <GoogleMap
        defaultZoom={7}
    >
        {props.directions && <DirectionsRenderer directions={props.directions}/>}
    </GoogleMap>
);

export default Map;
