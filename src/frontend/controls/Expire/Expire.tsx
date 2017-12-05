// hide a react element when time expires
import * as React from "react";
import moment = require("moment");

class Expire extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            visible: true
        };
        this.setExpirationTime.bind(this);
    }

    componentWillMount() {
        this.setExpirationTime(this.props.expirationTime);
    }

    setExpirationTime(expirationTime) {

        const currentTime = moment();
        const timeToCompare = moment(expirationTime, "hh:mm A");
        // if time is before, dont show. else set a timer
        if (currentTime.isAfter(timeToCompare)) {
            this.setState((state) => ({
                visible: false
            }));
        } else {

            setTimeout(() => {
                this.setState((state) => ({
                    visible: false
                }));
            }, timeToCompare.diff(currentTime, "milliseconds"));
        }
    }

    render() {
        return (
            (this.state.visible) ?
            <div>
                {this.props.children}
            </div> : null
        );
    }
}


export default Expire;
