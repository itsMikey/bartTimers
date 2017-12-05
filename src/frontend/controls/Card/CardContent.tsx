import * as React from "react";

const CardContent = (props) => {
    return (
        <div className="card-content">
            <div className="content">
                {props.children}
            </div>
        </div>
    );
};

export default CardContent;
