import React, { useEffect, useState } from 'react'
import "./MyPost.css"
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import axios from 'axios';
import tokenService from '../../Services/TokenService/tokenService';
import Comment from '../Comments/Comment';
import { RotatingLines } from 'react-loader-spinner'
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}
const MyPost = ({ Postuser, post, setShowPost, Activeuser }) => {
    const [comment, setComment] = useState("");
    const [everyThingIsOk, setEverythingIsOk] = useState(false);
    const [comments, setComments] = useState(null);
    const [reload, setReload] = useState(false);
    const [commenting, setCommenting] = useState(false);




    const createComment = (e) => {
        setComment(e.target.value);
        if (e.target.value != "") {
            setEverythingIsOk(true);
        } else {
            setEverythingIsOk(false);
        }
    }

    const doCommnet = async () => {
        const URL = "http://localhost:5000/user/post/comment";
        setCommenting(true);
        if (comment != "") {
            setEverythingIsOk(true);
            // create an comment object
            const commentDetails = {
                postId: post?._id,
                commentId: Activeuser?._id,
                commentText: comment
            }
            // do post commen

            await axios.post(URL, commentDetails, config)
                .then((response) => {
                    console.log(response);
                    setReload(false);
                    if (response.data.added) {
                        setComment("");
                        setReload(true);
                        setTimeout(() => {
                            setCommenting(false);
                        }, 2000);

                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            setEverythingIsOk(false);
            setCommenting(false);
        }
    }

    useEffect(() => {
        const getAllComments = async () => {
            let URL = "http://localhost:5000/user/post/get-commets"
            await axios.get(`${URL}/${post._id}`, config)
                .then((response) => {
                    // set the comments
                    console.log(response)
                    if (response.data.Post.comments) {
                        setComments(response.data.Post.comments);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getAllComments();
    }, [comment])


    return <>
        <div className="myPostSection">
            <ClearOutlinedIcon className='close-myPost' onClick={() => setShowPost(false)} />


            <div className="myPost-content">
                <div className="myPostContent-container">
                    <div className="myPosted-image">
                        <img src={process.env.PUBLIC_URL + "/PostImages/" + post?.postImage} alt="loading" />
                    </div>
                    <div className="myPost-details">

                        <div className="myProfile-detail">
                            <div className="detail">
                                <img src={process.env.PUBLIC_URL + "/ProfilePhotos/" + Postuser?.profilePicture} alt="" />
                                <div className="username">{Postuser?.username}</div>
                            </div>
                            {/* <div className="option"><i class="fa-solid fa-ellipsis"></i></div> */}
                        </div>
                        <div className="divider"></div>
                        <div className="myPost-comments">
                            {/* comments */}
                            {
                                comments?.map((c) => {
                                    return <>
                                        <Comment comment={c} />
                                    </>
                                })
                            }

                            {/* commets */}
                        </div>
                        <div className="myPost-footer">
                            <div className="actions">
                                <div className="like">
                                    {
                                        post?.likes.includes(Activeuser?._id) ?
                                            <i class="fa-solid fa-heart"></i> :
                                            <i class="fa-regular fa-heart"></i>
                                    }

                                </div>

                                <div className="comment"><i class="fa-regular fa-comment"></i></div>
                            </div>
                            <div className="total-likes">
                                <span>{post?.likes.length}</span>like
                            </div>
                            <div className="add-comment">
                                {
                                    commenting?<div className="loader">
                                    <RotatingLines strokeColor="#000"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="25"
                                        visible={true}
                                    />
                                </div>
                                :""
                                }
                                

                                <input value={comment} type="text" onChange={createComment} placeholder='add a comment' />
                                <div className="post-btn" type="button" id={everyThingIsOk ? "" : "disabled-btn"} onClick={doCommnet}>post</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>
}

export default MyPost