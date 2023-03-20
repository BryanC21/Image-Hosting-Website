import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setID } from "./redux/actions";
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
    const dispatch = useDispatch();
    const [showSignout, setShowSignout] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const info = useSelector(state => state.customReducer);

    const handlesSignOut = (e) => {
        //window.location.href = "/";
        dispatch(setID(0));
        setShowSignout(false);
        setShowLogin(true);
    };

    useEffect(() => {
        if (info.userid > 0) {
            setShowSignout(true);
            setShowLogin(false);
        }
    }, [info]);



    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-info">
            <Link className="navbar-brand" to="/">
                Home
            </Link>

            <div className="" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/accountview">
                            Images
                        </Link>
                    </li>
                    {showLogin ?
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>
                        </li>
                        : null
                    }
                    {showLogin ?
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">
                                Sign up
                            </Link>
                        </li>
                        : null
                    }
                    {showSignout ?
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={handlesSignOut}>
                                Sign Out
                            </Link>
                        </li>
                        : null
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;