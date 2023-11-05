import React, { useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import axios  from 'axios';
import "./EditePopupCard.css"
import tokenService from "../../Services/TokenService/tokenService.js"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';

var config = {
    headers: {
        authorization: tokenService.getToken(),
        
    }
}
function EditePopupCard({activeUser,setReload}) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagesIsSelected, setimagesIsSelected] = useState(false);
    const [Username, setUsername] = useState("");
    

    const notifyError=(mssg)=>{
        toast.error(mssg, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }

    const closeCard = () => {
        setUploadedImage(null);
        setimagesIsSelected(false)
        let edite_btn = document.getElementById("edite-btn")
        let card = document.getElementById("edite-card");
        card.style.top = "-50%";
        edite_btn.style.display = "block";
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = function (e) {
            setUploadedImage(e.target.result);
            setimagesIsSelected(true);
        }
        reader.readAsDataURL(file);
    }

 
    return <>
        <div className="edite-card">
            <ClearIcon className='close-popup-icon' onClick={closeCard}></ClearIcon>
            <div className="edite-image">
                {
                    imagesIsSelected ? <img src={uploadedImage} alt="loading..." />
                        :
                        <div className="file-chooser">
                            <label className='label' htmlFor="file">
                                <CameraAltIcon className='icon' />
                            </label>
                            <input type="file" id='file' onChange={onFileChange} />
                        </div>
                }
            </div>
            <div className="form-fields">
                <div className="form-group">
                    <input value={Username} type="text" onChange={(e) => setUsername(e.target.value)} placeholder='username' />
                </div>
            </div>
            <div className="button">
                <button onClick={doUpdate}>save</button>
            </div>

        </div>
    </>
}

export default EditePopupCard