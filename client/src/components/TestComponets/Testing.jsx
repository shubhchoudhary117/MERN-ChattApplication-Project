
import React from 'react'
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
const Testing = () => {

    const [imagesIsSelected, setimagesIsSelected] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [Activeuser, setActiveuser] = useState(null);
    const [Username, setUsername] = useState("")
    const [reload, setReload] = useState(false)
    const [everythingIsOk, setEvertyThingIsOk] = useState(false);
    const [userData, setUserData] = useState(defaultObj)
    // const [process,setProcess]=useState(false);
    const user=useSelector((state) => state.userDetails.user);


 
    // create an details obj
    // const createObj=(e)=>{
    //     let key=e.target.id;
    //     let value=e.target.value;
    //     setUserData({...userData,[key]:value});
    //     setEvertyThingIsOk(true)
    // }

  // handling the image upload section 
//   const onFileChange = (e) => {
//     let file = e.target.files[0];
//     setSelectedFile(file);
//     const reader = new FileReader();
//     reader.onload = function (e) {
//         setUploadedImage(e.target.result);
//         setimagesIsSelected(true);
//         setEvertyThingIsOk(true);
//     }
//     reader.readAsDataURL(file);
// }



    return (
        <div>
            <div className="heading">Testing</div>
            <img src={process.env.PUBLIC_URL + "/Photos/UserPhotos/user.webp"} alt="" />
        </div>
    )
}

export default Testing;