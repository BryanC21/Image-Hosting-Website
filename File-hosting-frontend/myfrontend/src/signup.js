import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setID } from "./redux/actions";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {

    const info = useSelector(state => state.customReducer);
    //console.log(info);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (info.userid > 0) {
            navigate("/accountview");
        }
    }, [info, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(e.target.username);
        const username = e.target.username.value;
        const password = e.target.password.value;
        const url = process.env.REACT_APP_BASE_URL+'/api/signup';
        axios.post(url, {
            username,
            password
        }).then((response) => {
            console.log(response);
            if (response.data.code === 400) {
                alert(response.data.message);
            }
            else {
                //dispatch(setID(response.data.userid));
                navigate("/login");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Signup</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        UserName:
                        <input type="text" name="username" />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="text" name="password" />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </header>
        </div>
    );
}
export default Signup;