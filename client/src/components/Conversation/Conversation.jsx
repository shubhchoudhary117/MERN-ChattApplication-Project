import axios from "axios";
import tokenService from "../../Services/TokenService/tokenService";
import { useEffect, useState } from "react";
var config={
    headers:{
     authorization:tokenService.getToken()
    }
 }

const Conversation = ({conversation,currentUser}) => {
    var BASE_URL="http://localhost:5000";
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const friendId = conversation?.members.find((m) => m !== currentUser?._id);
        console.log("friends id "+friendId)
        const getuser=async()=>{
            await axios.get(`http://localhost:5000/user/getanother-user/${friendId}`,config)
            .then((response)=>{
                console.log(response.data);
                setUser(response.data.user)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        getuser();
    },[conversation,currentUser])


    return <>
        <div className="conversation">
            <img src={process.env.PUBLIC_URL + "/profilePhotos/"+user?.profilePicture} alt="image not found" />
            <p className="user-name">{user?.username}</p>
        </div>
    </>
}

export default Conversation;