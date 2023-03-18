import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setID } from "./redux/actions";

function ImageView() {

    const info = useSelector(state => state.customReducer);

    const [listOfImages, setListOfImages] = useState([]);
    const [myTitle, setMyTitle] = useState("User Mode");

    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [description, setDescription] = useState(null);
    //console.log(info);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (info.userid === 0) {
            navigate("/login");
        }
        if (info.userid === 1) {
            setMyTitle("Admin Mode");
        }
        console.log(info.userid);
        handleGetImage(info.userid);
    }, [info, navigate]);

    const handleUpload = async e => {
        e.preventDefault();

    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        //POST to updateImageData
        console.log("Begin Update");
        await axios.post('https://bcaldera.com/api/updateImageData', {
            description: description,
            firstName: firstName,
            lastName: lastName,
            id: id
        }).then((response) => {
            console.log(response);
            alert("Image updated successfully");
            window.location.reload(false);
        }).catch((error) => {
            console.log(error);
            alert("Failed update 2");
        });

    }

    const handleDeleteImageData = async (e, id) => {
        e.preventDefault();
        //GET to deleteImage
        await axios.get(`https://bcaldera.com/api/deleteImageData?id=${id}`)
            .then((response) => {
                console.log(response);
                alert("Deleted Image Data");
                window.location.reload(false);
            }
            ).catch((error) => {
                console.log(error);
                alert("Failed delete");
            });
    };


    const handleGetImage = async (userid) => {
        //GET to getImage
        await axios.get(`https://bcaldera.com/api/getImageData?userid=${userid}`).then((response) => {
            console.log("here:", response.data.data);
            setListOfImages(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className='App'>
            <header className=''>
                <h1>{myTitle}</h1>
            </header>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 mx-auto bg-dark text-white">
                        <form onSubmit={handleUpload}>
                            <label>Upload image : All fields required!</label><br />
                            <input
                                type="file"
                                name="uploadImage"
                                accept="image/*"
                                required
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <br />
                            <input type="text" name="firstName" placeholder="First Name" required onChange={(e) => setFirstName(e.target.value)} />
                            <br />
                            <input type="text" name="lastName" placeholder="Last Name" required onChange={(e) => setLastName(e.target.value)} />
                            <br />
                            <input type="text" name="description" placeholder="Description" required onChange={(e) => setDescription(e.target.value)} />
                            <br />
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 mx-auto bg-light">
                        <h3>Showing owned images</h3><br />
                        {listOfImages.map((item, index) => {
                            return (
                                <div key={index}>
                                    <img style={{ 'maxHeight': '300px', 'maxWidth': '300px' }} src={`https://bcaldera.com/${item.file}`} alt="Upload" />
                                    <p>Name: {item.firstName} {item.lastName}</p>
                                    <p>{"Description: " + item.description}</p>
                                    <p>{"Uploaded UTC:" + item.uploadTime}, {"Updated UTC:" + item.updatedTime}</p>
                                    <form onSubmit={(e) => handleUpdate(e, item.Uploadid)}>
                                        <label>Update data:</label>
                                        <input type="text" name="firstName" placeholder="First Name" required onChange={(e) => setFirstName(e.target.value)} />
                                        <input type="text" name="lastName" placeholder="Last Name" required onChange={(e) => setLastName(e.target.value)} />
                                        <input type="text" name="description" placeholder="Description" required onChange={(e) => setDescription(e.target.value)} />
                                        <button type="submit">Update</button>
                                    </form>
                                    <button onClick={(e) => handleDeleteImageData(e, item.Uploadid)}>Delete</button>
                                    <hr />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ImageView;