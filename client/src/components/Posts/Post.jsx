import React, { useEffect } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import "./Post.css"
import tokenService from "../../Services/TokenService/tokenService.js"
import { useState } from "react"
import axios from "axios"
import MyPost from '../MyPosts/MyPost';
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}

function Post({ post, setOpenPost, setShowPost, setPosterUser, Activeuser, setReload }) {
    const [postUser, setPostUser] = useState(null);


    useEffect(() => {
        const getPostUser = async () => {
            console.log(post)
            let url = `http://localhost:5000/user/getanother-user/${post?.userId}`
            await axios.get(url, config)
                .then((response) => {
                    console.log(response.data)

                    if (response.data.user) {
                        setPostUser(response.data.user);
                        console.log(response.data)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getPostUser();
    }, []);


    const doLike = async () => {
        let URL = "http://localhost:5000/user/post/like";
        const likeDetails = {
            userId: Activeuser?._id,
            postId: post?._id
        }
        await axios.post(URL, likeDetails, config)
            .then((response) => {
                setReload(true);
            })
            .catch((error) => {
                console.log(error)
            })


    }




    // show post while click on post
    const PostClicking = () => {
        setShowPost(true);
        setOpenPost(post);
        setPosterUser(postUser);
    }


    return <>
        <div className="post-card">
            <div className="post-header">
                <div className="poster-image">
                    <img src={process.env.PUBLIC_URL + "/ProfilePhotos/" + postUser?.profilePicture} alt="" />
                </div>
                <div className="poster-name">{post ? postUser?.username : ""}</div>
            </div>
            <div className="post-image">
                <img src={process.env.PUBLIC_URL + "/PostImages/" + post?.postImage} alt="" />
            </div>
            <div className="post-footer">
                <div className="actions">
                    <div className="like">
                        {
                            post?.likes.includes(Activeuser?._id) ?
                                <i class="fa-solid fa-heart"></i> :
                                <i class="fa-regular fa-heart" onClick={doLike}></i>
                        }


                    </div>
                    <div className="comment" onClick={PostClicking}><i class="fa-regular fa-comment"></i></div>
                </div>
                <div className="total-likes">
                        <span>{post?.likes.length}</span>like
                    </div>
                <div className="post-text">
                    {post?.description}
                </div>
            </div>
        </div>


    </>
}

export default Post