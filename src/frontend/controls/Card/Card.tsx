import * as React from "react";

const cardStyle = {
   marginTop: "5%"
};

const Card = (props) => {

    return (
        <div style={cardStyle} className="card">
            {props.children}
        </div>
    );
};

export default Card;
