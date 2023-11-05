import "./SideBar.css"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MessageIcon from '@mui/icons-material/Message';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import Search from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useState } from "react";
import { AddPost } from "../AddPosts/AddPost";
import { useNavigate } from "react-router-dom";
import tokenService from "../../Services/TokenService/tokenService";
export const SideBar = ({Activeuser}) => {
    const [HideCreatePostPopup, setHideCreatePostPopup] = useState(true);
    const [doingLogout,setdoingLogout]=useState(false);
    const navigate=useNavigate();
    
    const doLogout = (logout) => {
        let logout_card=document.getElementById("logout-card");
     
            logout_card.style.display="block";

            if(doingLogout){
                tokenService.removeToken();
                logout_card.style.display="none";
                navigate("/");
            }
            setTimeout(() => {
                tokenService.removeToken();
                logout_card.style.display="none";
                navigate("/")
            }, 3000);
     
    }
    return <>

        <div className="sidebar-container">
            <header><div className="heading">ShubhChatt</div></header>
            <nav>
                <div className="menus">
                    <ul>
                        <li>
                            <div className="icon"><HomeOutlinedIcon className="icon" /></div>
                            <div className="link"><Link className="link" to="/app/homepage">homepage</Link></div>
                        </li>
                        <li>
                            <div className="icon"><AddBoxOutlinedIcon className="icon" /></div>
                            <div className="link"><Link className="link" onClick={() => setHideCreatePostPopup(false)}>create</Link></div>
                        </li>
                        <li>
                            <div className="icon"><MessageOutlinedIcon className="icon" /></div>
                            <div className="link"><Link className="link" to="/app/messanger">messanger</Link></div>
                        </li>
                        {/* <li>
                            <div className="icon"><SlideshowOutlinedIcon className="icon" /></div>
                            <div className="link"><Link className="link" to="/app/reels">reels</Link></div>
                        </li> */}
                        <li>
                            <div className="image"><img src={process.env.PUBLIC_URL + "/ProfilePhotos/"+Activeuser?.profilePicture} alt="" /></div>
                            <div className="link"><Link className="link" to="/app/profile">profile</Link></div>
                        </li>
                        <li onClick={()=>doLogout("showcard")}>
                            <div className="icon"><LogoutIcon  className="icon" /></div>
                            <div className="link"><Link className="link" >logout</Link></div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        <AddPost HideCreatePostPopup={HideCreatePostPopup} setHideCreatePostPopup={setHideCreatePostPopup} />

        {/* logout popup */}
        <div className="logout-card" id="logout-card">
           <div className="header">
            <div className="logout-title">Logging Out</div>
            <div className="logout-subtitle">you need to login back</div>
           </div>
           <div className="divider"></div>
           <div className="login-btn" onClick={()=>setdoingLogout(true)}>login</div>
        </div>
    </>
}