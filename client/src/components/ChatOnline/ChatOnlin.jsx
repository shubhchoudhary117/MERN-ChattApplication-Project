import { useEffect, useState } from "react";
import "./ChatOnline.css"
import axios from "axios"
import tokenService from "../../Services/TokenService/tokenService";
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}
const ChatOnline = ({ onlineUser, activeUser }) => {

    const [User,setUser]=useState(null)
    useEffect(() => {
        let friendId = onlineUser.userId;

        const getOnlineUser = async () => {
            await axios.get(`http://localhost:5000/user/getanother-user/${friendId}`, config)
                .then((response) => {
                    console.log("online user")
                    console.log(response.data);
                    setUser(response.data.user)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getOnlineUser();
    }, [])


    return <>
        <div className="chatOnlineFriend">
            <div className="image-container">
                <img className="chatOnline-image" src={process.env.PUBLIC_URL + "/ProfilePhotos/"+User?.profilePicture} alt="image is loading" />
                <div className="chat-badge"></div>
            </div>
            <div className="user-name">{User?.username}</div>
        </div>
    </>
}


export default ChatOnline;