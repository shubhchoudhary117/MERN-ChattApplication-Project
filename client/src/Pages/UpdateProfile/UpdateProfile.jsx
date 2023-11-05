
import React, { useEffect } from 'react'
import "./UpdateProfile.css"
import axios from "axios"
import { useState } from 'react'
import GridOnIcon from '@mui/icons-material/GridOn';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import tokenService from '../../Services/TokenService/tokenService';
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}
// create an default user details obj
var defaultObj = {
    username: "",
    bio: ""
}
function  UpdateProfile() {

    const [imagesIsSelected, setimagesIsSelected] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [Activeuser, setActiveuser] = useState();
    const [Username, setUsername] = useState("")
    const [reload, setReload] = useState(false)
    const [everythingIsOk, setEvertyThingIsOk] = useState(false);
    const [userData, setUserData] = useState(defaultObj)
    const [process,setProcess]=useState(false);
    const user=useSelector((state) => state.userDetails.user);

    useEffect(()=>{
        setActiveuser(user)
    },[])
    // create an details obj
    const createObj=(e)=>{
        let key=e.target.id;
        let value=e.target.value;
        setUserData({...userData,[key]:value});
        setEvertyThingIsOk(true)
    }


    // handling the image upload section 
    const onFileChange = (e) => {
        let file = e.target.files[0];
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = function (e) {
            setUploadedImage(e.target.result);
            setimagesIsSelected(true);
            setEvertyThingIsOk(true);
        }
        reader.readAsDataURL(file);
    }


    // call the update function for update the profil
    const doUpdate = async () => {
        setProcess(true)
        if (createObj.username !== "" || imagesIsSelected ||createObj.bio!=="") {
            // set the states   
            console.log(userData)
            setEvertyThingIsOk(true);
            let file=selectedFile?selectedFile:null;
            const formData = new FormData();
            formData.append('userid', Activeuser?._id);
            formData.append('photo', selectedFile);
            formData.append('newusername', userData.username);
            formData.append('bio',userData.bio)
          console.log(selectedFile)
            // calling post api
            let URL = `http://localhost:5000/user/update`
            await axios.post(URL, formData, config)
                .then((response) => {
                    console.log(response)
                    if (response.data.updated) {
                        setUserData(defaultObj)
                        setReload(true);
                        setSelectedFile(null)
                        setUploadedImage(null);
                        setimagesIsSelected(false);
                        setProcess(false)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            setEvertyThingIsOk(false)
        }
    }




    return <>

        <div className="update-profile-header">
            <div className="heading">Settings</div>
        </div>
        <div className="update-profile-container">
            <div className="heading">Edite profile</div>
            <div className="forms">
                <div className="form-group edite-image">
                    <div className="label">
                    <img src={process.env.public_url+"/ProfilePhotos/"+Activeuser?.profilePicture} alt="loading" />
                    
                    {/* {
                        imagesIsSelected?
                        <img src={uploadedImage} alt="loading" />
                        :
                        <img src={process.env.PUBLIC_URL+"/Photos/UserPhotos/user.webp"} alt="loading" />
                    } */}
                    </div>
                    <div className="input">
                        <div className="username">choudhary_ji012</div>
                        <label htmlFor="file">change photo</label>
                        <input onChange={onFileChange} type="file" id='file' />
                    </div>
                </div>
                <div className="form-group">
                    <div className="label">username</div>
                    <input value={userData.username} id="username" type="text" onChange={createObj} />
                </div>
                <div className="form-group">
                    <div className="label">bio</div>
                    <textarea value={userData.bio} id="bio" onChange={createObj}></textarea>
                </div>
                <div className="button"><button onClick={doUpdate} className={everythingIsOk ? "" : "disabled"} disabled={everythingIsOk ? false : true}>saved</button></div>
            </div>
        </div>

    </>
}

export default UpdateProfile