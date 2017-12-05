import * as React from "react";
import {Link} from "react-router-dom";

const NavBar = (props) => {
    return (
        <div>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        BartTimerz
                    </a>
                </div>

                <div className="navbar-menu" id="navMenu">
                    {/*only provisioned for a dropdown.*/}
                    <div className="navbar-end">
                        {
                            (props.dropDown) ?
                                <div className="navbar-item has-dropdown is-hoverable">
                                    <a className="navbar-link">
                                        {props.dropDown.dropDownTitle}
                                    </a>

                                    <div className="navbar-dropdown">
                                        {
                                            props.dropDown.dropDownLinks.map((linkObj, index) => {
                                                return <Link className="navbar-item"
                                                             to={linkObj.link} key={index}>{linkObj.name}</Link>;
                                            })
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
