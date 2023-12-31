import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Login } from "./login";
import { LoggedIn } from "./loggedin";
import { Context } from "../store/appContext";
import CheerslogoCorner from "../../img/Headerimages/CheerslogoCorner.png";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [enableFav, setEnableFav] = useState(false);

    const toBlogPage = () => {
        setDropdownOpen(false)
        navigate("/BlogPage");
    }

    useEffect(() => {
        if (store.accessToken !== undefined) {
            setEnableFav(true);
        } else {
            setEnableFav(false);
        }
    }, [store.accessToken]);

    const handleLogoClick = () => {
        navigate("/home", { state: Math.random() });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar custom-navbar-bg">
            <div className="container d-flex justify-content-align-items-center">
                <Link to="/home" onClick={handleLogoClick}>
                    <img
                        src={CheerslogoCorner}
                        alt="Home Bar Pro"
                        className="navbar-logo"
                        style={{ transform: 'scale(.7)' }}
                    />
                </Link>

               

                <div className="dropdown-container">
                    <button onClick={toggleDropdown} className="btn btn-button">
                        Menu
                    </button>
                    {dropdownOpen && (
                        <div className="top-right-nav">
                            {store.accessToken !== undefined ? (
                                <LoggedIn toggleDropdown={toggleDropdown} style={{ width: '500px', height: '400px' }} />
                            ) : (
                                <Login style={{ width: '300px', height: '300px' }} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
