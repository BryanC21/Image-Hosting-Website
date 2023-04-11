import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setID } from "./redux/actions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./forms.css";

function Login() {

    const info = useSelector(state => state.customReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (info.userid > 0) {
            navigate("/accountview");
        }
    }, [info, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const url = process.env.REACT_APP_BASE_URL + '/api/login';
        axios.post(url, {
            username,
            password
        }).then((response) => {
            if (response.data.code === 404) {
                alert(response.data.message);
            }
            else {
                dispatch(setID(response.data.userid));
                navigate("/accountview");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className=''>
            <form className="fform" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <br />
                <label className="flabel">
                    UserName:
                    <input className="finput" type="text" name="username" />
                </label>
                <br />
                <label className="flabel">
                    Password:
                    <input type="text" className="finput" name="password" />
                </label>
                <br />
                <input type="submit" className="fbutton" value="Submit" />
            </form>
        </div>
    );
}
export default Login;