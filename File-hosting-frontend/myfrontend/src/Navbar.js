import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setID } from "./redux/actions";
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false)
    const info = useSelector(state => state.customReducer);

    const handlesSignOut = (e) => {
        //window.location.href = "/";
        dispatch(setID(0));
        setShow(false);
    };

    useEffect(() => {
        if (info.userid > 0) {
            setShow(true);
        }
    }, [info]);



    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">
                            Login
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup">
                            Sign up
                        </Link>
                    </li>
                    { show ? 
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