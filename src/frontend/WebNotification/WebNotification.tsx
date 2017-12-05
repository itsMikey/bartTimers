import * as React from "react";
import Notification from "react-web-notification";

interface IWebNotification {
    title: string;
    tag: string;
    body: string;
    icon?: string;
    lang?: string;
}

class WebNotification extends React.Component<any, any> {
    props: IWebNotification;
    render() {
        return (
            <div>
                <Notification
                    title={this.props.title}
                    tag={this.props.tag}
                    body={this.props.body}
                    timeout={5000}
                />
            </div>
        );
    }
};

export default WebNotification;
