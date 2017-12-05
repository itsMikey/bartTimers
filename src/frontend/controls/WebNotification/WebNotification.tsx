import * as React from "react";
import Notification from "react-web-notification";

interface IWebNotification {
    title: string;
    ignore: boolean;
    options: {
        tag?: string
        body: string;
        icon?: string;
        lang?: string;
    };
    timeout?: number;
}

class WebNotification extends React.Component<any, any> {
    props: IWebNotification;
    render() {
        return (
            <div>
                <Notification
                    title={this.props.title}
                    options={this.props.options}
                    timeout={this.props.timeout || 5000}
                    ignore={this.props.ignore}
                />
            </div>
        );
    }
}


export default WebNotification;
