import React, { useEffect } from 'react'
import axios from "axios"
import Swal from "sweetalert2"
import { useState } from 'react'
import "./Profile.css"
import GridOnIcon from '@mui/icons-material/GridOn';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, UseSelector } from 'react-redux/es/hooks/useSelector';
import tokenService from '../../Services/TokenService/tokenService';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { AddPost } from '../AddPosts/AddPost'
import { Typography } from '@mui/material'
import MyPost from '../MyPosts/MyPost'
var config = {
  headers: {
    authorization: tokenService.getToken()
  }
}
export const Profile = ({ Activeuser }) => {
  // const navigate = useNavigate()
  // const [imagesIsSelected, setimagesIsSelected] = useState(false);
  // const [uploadedImage, setUploadedImage] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);

  // const [Username, setUsername] = useState("");
  // const [reload, setReload] = useState(false);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0)
  const [ownPosts, setOwnPosts] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [openPost, setOpenPost] = useState(null);
  // const [caption, setCaption] = useState("");
  const [HideCreatePostPopup, setHideCreatePostPopup] = useState(true)
  // const [nextProcess, setNextProcess] = useState(false)
  // // const [canclePost,setCanclePost]=useState(false)



  // get user from state 
  const user = useSelector((state) => state.userDetails.user);
  useEffect(() => {
    setTotalFollowing(Activeuser?.followings.length);
    setTotalFollowers(Activeuser?.followers.length);
  }, [Activeuser?._id])

  // show post while click on post
  const PostClicking = (post) => {
    setOpenPost(post);
    setShowPost(true);
  }

  // get all posts
  useEffect(() => {
    let URL = "http://localhost:5000/user/getposts"
    const getAllPosts = async () => {
      await axios.get(URL, config)
        .then((response) => {
          if (response.data.posts) {
            let allPosts = response.data.posts;
            let myPosts = allPosts?.filter((p) => p.userId == Activeuser?._id);
            setOwnPosts(myPosts);
            setTotalPosts(myPosts?.length)

          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getAllPosts();
  }, [Activeuser])




  return <>

    <div className="profile-page">
      <div className="profile-details-header">
        <div className="profile-details-container">
          <div className="profile-image">
            <img src={process.env.PUBLIC_URL + "/ProfilePhotos/" + Activeuser?.profilePicture} alt="" /></div>
          <div className="profile-details">
            <div className="profile-name-and-edite">
              <div className="user-name">{Activeuser?.username}</div>
              <div className="button"><Link to="/app/profile/update" className='link'>edite profile</Link></div>
            </div>
            <div className="follower-posts-followings">
              <div className="total-followers"><span>{totalFollowers}</span>followers</div>
              <div className="total-followings"><span>{totalFollowing}</span>followings</div>
              <div className="total-posts"><span>{totalPosts}</span>posts</div>
            </div>
            {/* <div className="profile-name">{Activeuser?.username}</div> */}
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="profilemenu-tabs">
        <div className="posts-tab"><GridOnIcon className='posts-icon' />posts</div>
      </div>
      <div className="user-posts">
        {
          ownPosts?.length ?
            <div className="all-posts-container">
              {
                ownPosts?.map((post) => {
                  return (

                    <div className="myPost-image">
                      <img src={process.env.PUBLIC_URL + "/PostImages/" + post?.postImage} alt="loading" />
                      <div className="myPost-layer" onClick={() => PostClicking(post)}></div>
                    </div>
                  )
                })
              }

            </div>
            :
            <div className="add-post">
              <div className="icon-image">
                {/* <input type="file" id='file' /> */}
                <CameraAltOutlinedIcon onClick={() => setHideCreatePostPopup(false)} className='camera-icon' />
              </div>
              <div className="title">Share Photos</div>
              <p className='message'>When you share photos, they will appear on your profile.</p>
            </div>
        }
      </div>
    </div>

    {/* Create New Post Poup Box Html ------------------------ */}

    {
      HideCreatePostPopup ? ""
        : <AddPost HideCreatePostPopup={HideCreatePostPopup} setHideCreatePostPopup={setHideCreatePostPopup} />
    }

    {
      showPost?<MyPost Activeuser={Activeuser} post={openPost} setShowPost={setShowPost}/>:""
    } 

  </>

}

