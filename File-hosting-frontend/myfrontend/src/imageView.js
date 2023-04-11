import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ImageView() {

    const info = useSelector(state => state.customReducer);

    const [listOfImages, setListOfImages] = useState([]);

    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [description, setDescription] = useState(null);
    console.log(info);
    const navigate = useNavigate();
    const baseurl = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        if (info.userid === 0 || info.userid === undefined) {
            navigate("/");
        }
        handleGetImage(info.userid);
    }, [info, navigate]);

    const handleUpload = async e => {
        e.preventDefault();
        //POST to uploadImage to an express server
        const formData = new FormData();
        formData.append("file", image);
        formData.append("file_name", fileName);
        formData.append("description", description);
        formData.append("userid", info.userid);
        await axios.post(baseurl + '/api/uploadImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            alert("Image uploaded successfully");
            window.location.reload(true);
        }).catch((error) => {
            console.log(error);
            alert("Failed upload");
        });
    };

    const handleDeleteImageData = async (e, id) => {
        e.preventDefault();
        //GET to deleteImage
        await axios.get(baseurl + `/api/deleteImageData?id=${id}`)
            .then((response) => {
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
        await axios.get(baseurl + `/api/getImageData?userid=${userid}`).then((response) => {
            console.log("here:", response.data.data);
            setListOfImages(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className=''>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 mx-auto">
                        <br />
                        <form className="" onSubmit={handleUpload}>
                            <label className="flabel"> <h2>Upload a new image:</h2> </label><br />
                            <input
                                type="file"
                                className="finput"
                                name="uploadImage"
                                accept="image/*"
                                required
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <br />
                            <input className="finput" type="text" name="filename" placeholder="Name the file" required onChange={(e) => setFileName(e.target.value)} />
                            <input className="finput" type="text" name="description" placeholder="Description" required onChange={(e) => setDescription(e.target.value)} />
                            <br />
                            <button className="fbutton" style={{ margin: '0 0 20px 0', backgroundColor: 'blue' }} type="submit">Upload</button>
                        </form>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12 mx-auto bg-light">
                        <br />
                        <h3 className="flabel">Showing owned images</h3><br />
                        {listOfImages && listOfImages.length > 0 && (listOfImages.map((item, index) => {
                            return (
                                <div className="flabel" key={index}>
                                    <img style={{ 'maxHeight': '300px', 'maxWidth': '300px' }} src={item.file} alt="Upload" />
                                    <p>Name: {item.file_name}</p>
                                    <p>{"Description: " + item.description}</p>
                                    <p>{"Uploaded: " + item.upload_time.slice(0, 10)}</p>
                                    <button className="fbutton" style={{ margin: '0 0 20px 0', backgroundColor: 'red' }} onClick={(e) => handleDeleteImageData(e, item.Uploadid)}>Delete</button>
                                    <hr />
                                </div>
                            )
                        }))
                        }
                        {!listOfImages && (
                            <div>
                                <p>No images found</p>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ImageView;