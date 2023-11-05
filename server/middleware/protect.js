const jsonwebtoken=require("jsonwebtoken");
const User=require("../models/User.js")

const protect=async(req,res,next)=>{
   
    let token="";

       if( req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")){
            try{
                console.log(req.headers.authorization)
                token=req.headers.authorization.split(" ")[1];
            
                let decoded=jsonwebtoken.verify(token,process.env.SECREAT_KEY);
                console.log(decoded)
                if(decoded){
                    req.user=await User.findOne({_id:decoded.userid});
                }

                next();

            }catch(error){
                res.status(401).json({badcradintals:true,authorization:false});
               
            }

           
        }else{
            res.status(401).json({badcradintals:true});
           
        }

   
}

module.exports={protect}