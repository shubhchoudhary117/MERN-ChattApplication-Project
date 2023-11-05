import TwitterIcon from '@mui/icons-material/Twitter';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { Link } from "react-router-dom"
import "./SignupPage.css"
import axios from "axios"
import { RotatingLines } from 'react-loader-spinner'
const defaultSignupDetails = {
    fullname: "",
    username: "",
    password: "",
    emailorphone: ""
}

const SignupPage = () => {
    const BASE_URL = "http://localhost:5000"
    const [signupData, setSignupData] = useState(defaultSignupDetails)
    const [dataIsOk, setDataIsOk] = useState(false);
    const [EmailsorPhoneInvalid, setEmailorPhoneInvalid] = useState(false);
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [signupProcessing, setSignupProcessing] = useState(false);
    const [showPassword,setShowPassword]=useState(false);
    const navigate = useNavigate();


    // email or phone number validation using regax

    function validateEmail(email) { //Validates the email address
        var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) { //Validates the phone number
        var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
        return phoneRegex.test(phone);
    }



    const createObj = (e) => {
        let key = e.target.id;
        let value = e.target.value;
        setSignupData({ ...signupData, [key]: value });
        if (signupData.fullname != "" && signupData.username != "" && signupData.emailorphone != "" && signupData.password != "") {
            setDataIsOk(true);
        } else {
            setDataIsOk(false)
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



    // register the user
    const doRegister = async (e) => {
        e.preventDefault();

        if (signupData.fullname != "" && signupData.username != "" && signupData.phoneoremail != "" && signupData.password != "") {


            if (!validateEmail(signupData.emailorphone) && !validatePhone(signupData.emailorphone)) {
                setEmailorPhoneInvalid(true);
            } else {
                setEmailorPhoneInvalid(false);
                setSignupProcessing(true);
                // register the user
                setDataIsOk(true);
                //   and post the register data
                await axios.post(BASE_URL + "/register", signupData)
                    .then((response) => {
                        const Response = response.data;

                        if (Response.emailorphoneIsExist) {
                            setEmailorPhoneInvalid(true);
                            setSignupProcessing(false);
                        }
                        if (Response.registerSuccess) {
                            setSignupData(defaultSignupDetails);
                            setEmailorPhoneInvalid(false);
                            setTimeout(() => {
                                setSignupProcessing(false);
                                navigate("/");

                            }, 2000);
                        }
                        console.log(response)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
        else {
            console.log("disabled")
            setDataIsOk(false);
        }
    }
    return <>

        <div className="signup-section">
            <div className="signup-container">
                <div className="social-image">
                    <div className="image">
                        <img src={process.env.PUBLIC_URL + "/Photos/webphotos/SocialMedialChattAppPhoto.svg"} alt="" />
                    </div>
                </div>
                <div className="signup-box">
                    <div className="signup-wrapper">
                        <div className="heading">shubhchatt</div>
                        <div className="sub-title">Sign up to see photos and videos from your friends.</div>
                        <div className="login-btn"><button onClick={() => navigate("/")}>login</button></div>
                        <div className="form-group">
                            <input type="text" id='fullname' onChange={createObj} placeholder="Full name" />
                        </div>
                        
                        <div className="form-group">
                            {EmailsorPhoneInvalid ? <i class="fa-regular fa-circle-xmark" id="emailorphoneInvalid"></i> : ""}
                            <input type="text" id='emailorphone' onChange={createObj} placeholder="Phone number,email" />
                        </div>

                        <div className="form-group">
                            <input type="text" id='username' onChange={createObj} placeholder="Username" />
                        </div>

                        <div className="form-group">
                            <input type="password" id='password' onChange={createObj} placeholder="password" />
                           {
                            showPassword?
                            <span className="hide" id='hide' onClick={()=>setShowPassword(false)}>hide</span>
                            :
                            <span className="show" id='show' onClick={()=>setShowPassword(true)}>show</span>
                           
                           }
                            
                        </div>


                        <div className="signup-footer">
                            <p className="privacy">
                                By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
                            </p>
                            <Link className="link" to="/">already have an account <strong>Login</strong></Link>
                            <button onClick={doRegister} disabled={dataIsOk ? false : true} className={dataIsOk ? "" : "disabled"}>
                                {signupProcessing ? <RotatingLines
                                    strokeColor="#fff"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="25"
                                    visible={true}
                                /> : "signup"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />

    </>
}

export default SignupPage;