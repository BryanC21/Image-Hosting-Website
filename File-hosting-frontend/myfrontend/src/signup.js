import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./forms.css";

function Signup() {

    const info = useSelector(state => state.customReducer);
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
        const url = process.env.REACT_APP_BASE_URL + '/api/signup';
        axios.post(url, {
            username,
            password
        }).then((response) => {
            if (response.data.code === 400) {
                alert(response.data.message);
            }
            else {
                navigate("/login");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className=''>
            <form className='fform' onSubmit={handleSubmit}>
                <h2>Sign up</h2>
                <br />
                <label className="flabel">
                    UserName:
                    <input className="finput" type="text" id="username" name="username" />
                </label>
                <br />
                <label className="flabel">
                    Password:
                    <input className="finput" type="text" id="password" name="password" />
                </label>
                <br />
                <input className="fbutton" type="submit" value="Submit" />
            </form>
        </div>
    );
}
export default Signup;