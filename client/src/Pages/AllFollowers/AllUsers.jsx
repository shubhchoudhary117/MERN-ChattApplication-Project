import React, { useEffect, useState } from 'react'
import "./AllUsers.css"
import axios from 'axios';
import tokenService from '../../Services/TokenService/tokenService';
import { RotatingLines } from 'react-loader-spinner';
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}
const AllUsers = ({ Activeuser }) => {
    const [unfollowingUsers, setUnfollowingUsers] = useState([]);
    const [followersId, setFollwersId] = useState([]);
    const [reload, setReload] = useState(false);
    const [followingProcess, setFollowingProcess] = useState(false);
    useEffect(() => {
        const getAllUsers = async () => {
            await axios.get(`http://localhost:5000/user/allusers`, config)
                .then((response) => {
                    console.log(response)
                    if (response.data.authorization) {
                        const alluser = response.data.users;
                        const followers = Activeuser?.followers;
                        const followings = Activeuser?.followings;

                        // extract unfollow users
                        if (followings == null) {
                            setUnfollowingUsers(null)
                        } else {
                            const unfollowingusers = alluser?.filter((u) => !followings.includes(u._id) && u._id != Activeuser._id);
                            setUnfollowingUsers(unfollowingusers);
                        }

                        // extract followers
                    }
                })
                .catch((error) => {
                    // if (error.response?.status === 401) {
                    //     navigate("/")
                    // }
                    console.log(error)
                })
        }
        getAllUsers();
    }, []);

    // add follower


    // add a new follower
    const addFollower = async (id) => {
        setFollowingProcess(true);
        const payload = {
            mainuserid: Activeuser?._id,
            followerid: id,
        }
        let URL = "http://localhost:5000/user/addfollower"
        await axios.post(URL, payload)
            .then((response) => {
                console.log(response)
                if (response.data.followerAdded) {
                    setFollwersId((prev) => [...prev, id]);
                    setTimeout(() => {
                        setFollowingProcess(false);

                    }, 2000);
                    console.log(followersId)

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return <>

        <div className="users-section">
            <div className="users-wrapper">
                <div className="heading">suggested</div>
                {
                    unfollowingUsers?.map((user) => {
                        return <>
                            <div className="user">
                                <div className="user-detail">
                                    <div className="image"><img src={process.env.PUBLIC_URL + "/ProfilePhotos/" + user?.profilePicture} /></div>
                                    <div className="username">{user?.username}</div>
                                </div>

                                {
                                    followersId.includes(user?._id) ?
                                        <div className="following-btn">
                                            following
                                        </div> :    
                                        <div className="follow-btn" onClick={() => addFollower(user?._id)}>
                                           follow
                                        </div>
                                        
                                }


                            </div>
                        </>
                    })
                }

            </div>
        </div>
    </>
}

export default AllUsers




// <RotatingLines
//                                                 strokeColor="#fff"
//                                                 strokeWidth="5"
//                                                 animationDuration="0.75"
//                                                 width="25"
//                                                 visible={true}
//                                             />