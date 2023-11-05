import React, { useEffect } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from 'react';
import "./AddPost.css"
import GridOnIcon from '@mui/icons-material/GridOn';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, UseSelector } from 'react-redux/es/hooks/useSelector';
import tokenService from '../../Services/TokenService/tokenService';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
var config = {
  headers: {
    authorization: tokenService.getToken()
  }
}

export const AddPost = ({ HideCreatePostPopup, setHideCreatePostPopup }) => {
  const navigate = useNavigate()
  const [imagesIsSelected, setimagesIsSelected] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [Activeuser, setActiveuser] = useState();
  const [Username, setUsername] = useState("");
  const [reload, setReload] = useState(false);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [caption, setCaption] = useState("");
  const [postIsSuccessfull, setPostIsSuccessfull] = useState(false);
  const [writeCaptionProcess, setCaptionProcess] = useState(false);
  const [chooseImageProcess, setChooseImageProcess] = useState(true);
  const [nextProcess, setNextProcess] = useState(false)
  // const [canclePost,setCanclePost]=useState(false)
  const user = useSelector((state) => state.userDetails.user);


  useEffect(() => {
    setActiveuser(user);
  }, [imagesIsSelected])



  // handling the image upload section 
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

  // add a new post
  async function doPost(e) {
    e.preventDefault()
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (caption != "" || imagesIsSelected) {
      const formData = new FormData();
      formData.append("userid", Activeuser?._id);
      formData.append("photo", selectedFile);
      formData.append("description", caption);
      formData.append("createdAt", new Date());
      let URL = "http://localhost:5000/user/post"
      await axios.post(URL, formData, config)
        .then((response) => {

          setChooseImageProcess(false);
          setCaptionProcess(false);
          setPostIsSuccessfull(true);
          setTimeout(() => {
            setChooseImageProcess(true);
            setCaptionProcess(false);
            setPostIsSuccessfull(false);
            setHideCreatePostPopup(true);
            setUploadedImage(null);
            setimagesIsSelected(false);
            navigate("/app/homepage")

          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  // cancle the post
  const canclePost = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "cancle this post ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancle it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setHideCreatePostPopup(true);
        setimagesIsSelected(false);
        setUploadedImage(null);
      }
    })
  }

  return <>
    <div className="post" id={HideCreatePostPopup ? "close-popup" : ""}>
      <ClearOutlinedIcon className='close-icon' onClick={() => setHideCreatePostPopup(true)} />
      <div className="createPost-popup">
        <div className="createPost-wrapper">
          {
            postIsSuccessfull ?
              <div className="header">
                <div className="success-mssg">post shared</div>
              </div> :
              <div className="header">
                {!writeCaptionProcess && imagesIsSelected ? <div className="exit" onClick={canclePost}> <ArrowBackOutlinedIcon className='icon' /></div> : ""}
                <div className="previous" onClick={() => { setCaptionProcess(false); setChooseImageProcess(true) }}>{writeCaptionProcess && !postIsSuccessfull ? <ArrowBackOutlinedIcon className='icon' /> : ""}</div>
                <div className="heading">Create new post</div>
                <div className="next" onClick={() => { setCaptionProcess(true); setChooseImageProcess(false) }}>{imagesIsSelected ? "next" : ""}</div>
              </div>
          }

          <div className="process-container">
            {/* image selection process content */}
            {
              writeCaptionProcess ?
                <div className="fill-details-process">
                  <div className="fill-details-wrapper">
                    <div className="form-group">
                      <textarea placeholder='caption' onChange={(e) => setCaption(e.target.value)}></textarea>
                    </div>

                    <div className="share-btn"><button type='button' onClick={doPost}>share</button></div>
                  </div>
                </div>

                :
                ""}
            {
              chooseImageProcess ?
                <div className="select-image-process">
                  <div className="createPost-content">
                    {
                      imagesIsSelected ?
                        <>
                          <div className="choosed-image">
                            <img src={uploadedImage} alt="" />
                          </div>
                        </>
                        :
                        <div>
                          <div className="icons">
                            <PhotoOutlinedIcon className='icon' />
                            <SlideshowOutlinedIcon className='icon' />
                          </div>
                          <h6 className="createPost-title">Drag photos and videos here</h6>

                          <button><label htmlFor="file">select</label> <input onChange={onFileChange} type="file" id='file' /></button>
                        </div>
                    }


                  </div>
                </div>
                : ""
            }
            {
              postIsSuccessfull ?
                <div className="postIsSuccessfull-card">
                  <div className="success-animation">
                    <div class="success-checkmark">
                      <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                      </div>
                    </div>
                    <div className="mssg">Your post has been shared.</div>
                  </div>
                </div>
                : ""
            }

          </div>
        </div>
      </div>
    </div>

  </>
}
