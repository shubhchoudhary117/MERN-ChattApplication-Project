
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { useEffect, useState } from "react"

import "./App.css"
import LoginPage from "./Pages/Auth/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage";
import Messanger from "./Pages/Messanger/Messanger";
import { useSelector, UseSelector } from "react-redux/es/hooks/useSelector";
import HomePage from "./Pages/Home/HomePage";
import ProfilePage from "./Pages/UserProflePages/ProfilePage";
import DashBoard from "./components/dashboard/DashBoard";
import { Profile } from "./components/Profile/Profile"
import Update from "./components/Profile/Update";
import Testing from "./components/TestComponets/Testing";
import { useDispatch } from "react-redux"
import axios from "axios";
import { Router, useLocation, useNavigate } from 'react-router'
import tokenService from "./Services/TokenService/tokenService";
import { setUser } from "./app/features/getUser";
import { useHistory } from "react-router";
import AllUsers from "./Pages/AllFollowers/AllUsers";

var config = {
  headers: {
    authorization: tokenService.getToken()
  }

}
function App() {

  const [Activeuser, setActiveuser] = useState(null);
  const user = useSelector((state) => state.userDetails.user);
  const dispatcher = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const Authorization = async () => {
      await axios.get(`http://localhost:5000/user/getuser`, config)
        .then((response) => {
          if (response.data.Authorization) {
            dispatcher(setUser(response.data?.users));
            setActiveuser(response.data.users);
            navigate("/app/homepage")
          } else navigate("/")
        })
        .catch((error) => {
          if (error?.response.status === 401) {
            navigate("/");
          }
        })
    }
    Authorization();
  }, [])

  return (

    <div className="App">
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>


      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/app" element={Activeuser ? <DashBoard Activeuser={Activeuser} /> : <LoginPage />}>
          <Route path="/app/messanger" element={<Messanger Activeuser={Activeuser} />} />
          <Route exact path="/app/homepage" element={<HomePage Activeuser={Activeuser} />} />
          <Route path="/app/profile" element={<Profile Activeuser={Activeuser} />} />
          <Route path="/app/peoples" element={<AllUsers Activeuser={Activeuser} />} />
          <Route path="/app/profile/update" element={<Update Activeuser={Activeuser} />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profilepage/:id" element={<ProfilePage Activeuser={Activeuser} />}></Route>
      </Routes>





    </div>

  )

}

export default App;
