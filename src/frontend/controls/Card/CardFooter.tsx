import * as React from "react";

const CardFooter = (props) => {
    return (
        <footer className="card-footer">
            {props.children}
        </footer>
    );
};

export default CardFooter;
