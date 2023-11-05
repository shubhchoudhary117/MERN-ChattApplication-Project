
const UserModel=require("../models/User.js")
const bcrypt=require("bcrypt")
const generateToken=require("../config/generateJwt.js")
class AuthController {

    static register = async (req, res) => {
        console.log(req.body)
        // check the user is already exist or not
       
        var existUser = await UserModel.findOne({ emailorphone: req.body.emailorphone });
        if (existUser) {
            res.json({ emailorphoneIsExist: true, registerSuccess: false });
        } else {
            //create new user
            const salt=await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new UserModel({
                username: req.body.username,
                fullname:req.body.fullname,
                emailorphone: req.body.emailorphone,
                password: hashedPassword,
            });

            //save user and respond
            const addedUser = await newUser.save();
            res.status(200).json({registerSuccess:true,user:addedUser});
        }
    }


    static login=async(req,res)=>{
        console.log(req.body)
        const user=await UserModel.findOne({emailorphone:req.body.emailorphone});
        if(user){
            const Validpassword=await bcrypt.compare(req.body.password,user.password);
            if(Validpassword){
                let token=`Bearer ${generateToken(user._id)}`;
                res.status(200).json({loginSuccessfully:true,passwordInvalid:false,emailorphoneInvalid:false,token:token,user:user})
            }else{
                res.status(200).json({loginSuccessfully:false,passwordInvalid:true,emailorphoneInvalid:false,token:null,user:null})
            }
        }else{
            res.status(200).json({loginSuccessfully:false,passwordInvalid:false,emailorphoneInvalid:true,token:null,user:null})
        }
    }
}

module.exports=AuthController