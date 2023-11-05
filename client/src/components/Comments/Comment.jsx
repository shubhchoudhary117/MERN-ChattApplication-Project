import React, { useState } from 'react'
import axios from 'axios';
import tokenService from '../../Services/TokenService/tokenService';
import { useEffect } from 'react';
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}

const Comment = ({comment}) => {

    const [commenter,setCommenter]=useState(null);
    
    useEffect(() => {
        const getCommenter = async () => {
            let url = `http://localhost:5000/user/getanother-user/${comment?.commentId}`
            await axios.get(url, config)
                .then((response) => {
                    console.log(response.data)
                    if (response.data.user) {
                       setCommenter(response.data.user)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getCommenter();
    }, [comment]);

   
    return (
        <div className="comment">
            <div className="image"><img src={process.env.PUBLIC_URL + "/ProfilePhotos/"+commenter?.profilePicture} alt="" /></div>
            <div className="commenting-username">{commenter?.username}</div>
            <div className="comment-text">{comment?.commentText}</div>
        </div>
    )
}

export default Comment