import * as React from "react";

const CardHeader = (props) => {
    return (
            <header className="card-header">
                <p className="card-header-title">
                    {props.children}
                </p>
            </header>
    );
};

export default CardHeader;
