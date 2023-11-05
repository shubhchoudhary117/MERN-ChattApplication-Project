import React, { useEffect, useRef } from 'react'
import axios from "axios"
import { useState } from 'react'
import "./HomePage.css"
import 'react-toastify/dist/ReactToastify.min.css';
import { SideBar } from "../../components/Navbar/SideBar"
import Follower from '../../components/followers/Follower'
import Post from '../../components/Posts/Post'
import MyPost from '../../components/MyPosts/MyPost';
import tokenService from "../../Services/TokenService/tokenService.js"
import { useSelector, useDispatch } from 'react-redux'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { setUser } from "../../app/features/getUser.js"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from 'react-router'
import Clear from '@mui/icons-material/Clear'
import ChatOnline from "../../components/ChatOnline/ChatOnlin"
import CheckIcon from '@mui/icons-material/Check';
import DotLoader from "react-spinners/DotLoader";
import PulseLoader from "react-spinners/PulseLoader"
import io from "socket.io-client"
import { Link } from 'react-router-dom';
import { width } from '@mui/system';
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}
function HomePage({ Activeuser }) {
    io("http://localhost:5000")
    var BASE_URL = "http://localhost:5000";
    const [reload, setReload] = useState(false);
    const [showPostCard, setShowPostCard] = useState(false);

    const [unfollowingUsers, setUnfollowingUsers] = useState([]);
    const [followerId, setFollwerId] = useState(null);


    const [description, setDescription] = useState("");
    const [numberOfFollowers, setNuberOfFollowers] = useState(null);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [posts, setPosts] = useState(null)
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const navigate = useNavigate();
    const [postLoading, setPostLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true)
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [showPost, setShowPost] = useState(false);
    const [openPost,setOpenPost]=useState(false);
    const [posterUser,setPosterUser]=useState(null);
    var followRef = useRef();
    const changeFile = useRef();
    // const Activeuser = useSelector((state) => state.userDetails.user);
    const dispatcher = useDispatch();
    const socket = useRef();

    const nofifyError = (mssg) => {
        toast.error(mssg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            background: "black",

        });
    }


    useEffect(() => {
        setTimeout(() => setPageLoading(false), 2000)
    }, []);


    // get all online users
    useEffect(() => {
        socket.current = io("ws://localhost:5000");
        socket.current.on("get-users", (users) => {
            console.log(users + "online")
        })
    }, [])







    // add a new follower
    const addFollower = async (id) => {
        const payload = {
            mainuserid: Activeuser?._id,
            followerid: id,
        }
        let URL = "http://localhost:5000/user/addfollower"
        await axios.post(URL, payload)
            .then((response) => {
                console.log(response)
                if (response.data.followerAdded) {
                    setFollwerId(id);
                    setReload(true)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    // get all unfollow users
    useEffect(() => {
        const getAllUsers = async () => {
            await axios.get(`http://localhost:5000/user/allusers`, config)
                .then((response) => {

                    if (response.data.authorization) {
                        const alluser = response.data.users;
                        const followers = Activeuser?.followers;
                        const followings = Activeuser?.followings;

                        // extract unfollow users
                        if (followings == null) {
                            setUnfollowingUsers(null)
                        } else {
                            setNuberOfFollowers(Activeuser?.followers.length);
                            const unfollowingusers = alluser?.filter((u) => !followings.includes(u._id) && u._id != Activeuser._id);
                            setUnfollowingUsers(unfollowingusers);
                        }

                        // extract followers
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 401) {
                        navigate("/")
                    }
                    console.log(error)
                })
        }
        getAllUsers();
    }, [Activeuser, followerId, reload]);



    // get all posts
    useEffect(() => {
        let URL = "http://localhost:5000/user/getposts"
        const getAllPosts = async () => {
            await axios.get(URL, config)
                .then((response) => {
                    if (response.data.posts) {
                        setPosts(response.data.posts);
                        let allPosts = response.data.posts;
                        let ownPosts = allPosts?.filter((p) => p.userId == Activeuser._id);
                        console.log(ownPosts)
                        setNumberOfPosts(ownPosts.length);
                        setPostLoading(false)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getAllPosts();
        setReload(false);
    }, [reload, Activeuser]);




    const doLike=()=>{
        alert("liked")
    }




    return <>
        {/* 
        <SideBar setCard={setShowPostCard} setShowPostCard={setShowPostCard} activeUser={Activeuser}></SideBar> */}
        {pageLoading ? <PulseLoader color="#EF5757" className='page-loader' cssOverride={{ color: "red" }} />
            :
            <section className="home-post-section">
                {/* <div className="user-profile">
                            <div className="profile-header">
                                <img className='profile-picture' src={process.env.PUBLIC_URL + "/ProfilePhotos/" + Activeuser?.profilePicture} alt="" />
                                <h4 className="user-name">{Activeuser?.username}</h4>
                            </div>
                            <div className="profile-footer">
                                <div className="followers">
                                    <div className="detail">{totalFollowers > 1000 ? totalFollowers + "k" : totalFollowers}</div>
                                    Followers
                                </div>
                                <div className="line"></div>
                                <div className="following"><div className="detail">{totalFollowing>1000?totalFollowing+"k":totalFollowing}</div>
                                    Following</div>
                                <div className="line"></div>
                                <div className="user-posts"><div className="detail">{numberOfPosts > 1000 ? numberOfPosts + "k" : numberOfPosts}</div>
                                    posts</div>
                            </div>
                            <div className="edite-profile-btn" id='edite-btn' onClick={showEditeProfileCard}>edite</div>
                            <div className="profile-update-popup" id='edite-card'><EditePopupCard setReload={setReload} activeUser={Activeuser ? Activeuser : ""} /></div>
                        </div> */}

                {/* end of the user profile */}



                {/* set loader */}

                <div className="posts">
                    <div className="posts-wrapper">
                        <div className="posts-welcome-box">
                            <div className="coustom-image">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <h5 className="title">You're all caught up</h5>
                            <h6 className="sub-title">You've seen all new posts from the past 3 days.</h6>
                        </div>
                        {
                            postLoading ? <PulseLoader color="#EF5757" className='loader' cssOverride={{ color: "red" }} />
                                :
                                <div className="all-posts">
                                    {
                                        posts?.map((post) => {
                                            return (
                                                
                                                <Post setReload={setReload} doLike={doLike} post={post} setPosterUser={setPosterUser} setOpenPost={setOpenPost} setShowPost={setShowPost} Activeuser={Activeuser} />
                                            )
                                        })
                                    }
                                </div>
                        }
                    </div>
                </div>
                <div className="right-part">
                    <div className="user-profile">
                        <div className="profile-detail">
                            <img className='img' src={process.env.PUBLIC_URL + "/ProfilePhotos/" + Activeuser?.profilePicture} alt="" />

                            <div className="profile-name">{Activeuser?.username}</div>
                        </div>
                    </div>
                    <div className="suggested-users">
                        <div className="suggested-users-wrapper">
                            <div className="header"><div className="heading">suggested for you</div>
                                <div className="see-all"><Link to="/app/peoples" className='link'>see all</Link></div></div>
                            <div className="users-list" >
                                {
                                    unfollowingUsers?.map((user) => {
                                        return (
                                            <div className="follower">
                                                <div className="follower-detail">
                                                    <img src={process.env.PUBLIC_URL + "/ProfilePhotos/"+user?.profilePicture} alt="" />
                                                    <div className="follower-name">{user?.username}</div>
                                                </div>
                                                <div className="follow-btn" onClick={() => addFollower(user?._id)}>follow</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="links">
                            <div className="links"><div>about</div>.<div>privacy policy</div></div>
                        </div>
                        <div className="other-detail">Locations.language.not verified</div>
                        <div className="web-name">©Shubhchatt.<span>developer:- shubham choudhary</span> </div>
                    </div>
                </div>
            </section>
        }
    {
        showPost?<MyPost Postuser={posterUser} post={openPost} setShowPost={setShowPost} Activeuser={Activeuser}/>:""
    }

    </>
}

export default HomePage