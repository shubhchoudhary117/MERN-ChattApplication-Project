import TwitterIcon from '@mui/icons-material/Twitter';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { Link } from "react-router-dom"
import axios from "axios"
import tokenService from "../../Services/TokenService/tokenService.js"
import "./LoginPage.css"
import { setUser } from '../../app/features/getUser.js';
import { useDispatch } from 'react-redux';
import { RotatingLines } from 'react-loader-spinner'
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';

const defaultLoginDetails = {
    emailorphone: "",
    password: ""
}
// for sending token with header
var config = {
    headers: {
        authorization: tokenService.getToken()
    }
}

const LoginPage = () => {
    const BASE_URL = "http://localhost:5000"
    const [loginData, setLoginData] = useState(defaultLoginDetails)
    const [everythingIsOk, setEveryThingisOk] = useState(false);
    const [emailInvalid, setEmailOrPhoneInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [loginProcessing, setLoginProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    var dispatch = useDispatch();
    const email = useRef("");
    const password = useRef("");
    const [Activeuser, setActiveuser] = useState(null);

    const dispatcher = useDispatch();

    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse.access_token),
    });


    // execute the toasty event
    const notifyError = (message) => {
        alert(message)
    }

    const createObj = (e) => {
        let key = e.target.id;
        let value = e.target.value;
        setLoginData({ ...loginData, [key]: value });
        if (loginData.emailorphone != "" && loginData.password != "") {
            setEveryThingisOk(true);
        } else {
            setEveryThingisOk(false);
        }
    }

       // show hide the password
       useEffect(()=>{
        let password_field=document.getElementById("password")
        if(showPassword){
            password_field.type="text";
        }else{
            password_field.type="password";
        }
    },[showPassword])
    
    // login the user
    const doLogin = async () => {
        if (loginData.emailorphone != "" && loginData.password != "") {
            // update states
            setLoginProcessing(true);
            setEveryThingisOk(true);
            // Post API
            await axios.post(BASE_URL + "/login", loginData)
                .then((response) => {
                    const Response = response.data;
                    if (Response.emailorphoneInvalid) {
                        setEmailOrPhoneInvalid(true);
                        setLoginProcessing(false);
                    } else setEmailOrPhoneInvalid(false);
                    if (Response.passwordInvalid) {
                        setPasswordInvalid(true);
                        setLoginProcessing(false);
                    } else setPasswordInvalid(false);
                    // if login successfull
                    if (Response.loginSuccessfully) {
                        setLoginProcessing(true)
                        tokenService.setToken(Response.token);
                        dispatch(setUser(Response.user));
                        setEmailOrPhoneInvalid(false);
                        setPasswordInvalid(false);
                        setLoginData(defaultLoginDetails);
                        setTimeout(() => {
                            setLoginProcessing(false);
                            window.location.href = "http://localhost:3000/app/homepage"
                        }, 2000);

                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else {
            console.log("disabled");
            setEveryThingisOk(false);
        }
    }

    return <>

        <div className="login-section">
            <div className="login-container">
                <div className="social-image">
                    <div className="image">
                        <img src={process.env.PUBLIC_URL + "/Photos/webphotos/SocialMedialChattAppPhoto.svg"} alt="" />
                    </div>
                </div>
                <div className="login-box">
                    <div className="login-wrapper">
                        <div className="heading">shubhchatt</div>
                        <div className="sub-title">Sign up to see photos and videos from your friends.</div>
                        <div className="login-btn"><button onClick={() => navigate("/signup")}>signup</button></div>

                        <div className="form-group">
                            {emailInvalid ? <i class="fa-regular fa-circle-xmark" id="emailorphoneInvalid"></i> : ""}
                            <input type="text" id='emailorphone' onChange={createObj} placeholder="Phone number,email" />
                        </div>
                        <div className="form-group">
                            {passwordInvalid ? <i class="fa-regular fa-circle-xmark" id="emailorphoneInvalid"></i> : ""}
                            <input type="text" id='password' onChange={createObj} placeholder="password" />
                            {
                                showPassword ?
                                    <span className="hide" id='hide' onClick={() => setShowPassword(false)}>hide</span>
                                    :
                                    <span className="show" id='show' onClick={() => setShowPassword(true)}>show</span>
                            }
                        </div>
                        <div className="login-footer">
                            <p className="privacy">
                                By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
                            </p>
                            <Link className="link" to="signup">dont haven an accont <strong>Signup</strong></Link>
                            <button onClick={doLogin} disabled={everythingIsOk ? false : true}
                                className={everythingIsOk ? "" : "disabled"}>
                                {loginProcessing ? <RotatingLines
                                    strokeColor="#fff"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="25"
                                    visible={true}
                                /> : "login"}</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />


    </>
}

export default LoginPage;

//client id 300856540684-que6dus2jd2jnl00a4m4p6oua1nhiof5.apps.googleusercontent.com

// client secreat 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