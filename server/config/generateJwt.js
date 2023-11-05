const jsonwebtoken=require("jsonwebtoken");

const generateToken=(userid)=>{
    const token=jsonwebtoken.sign({userid},process.env.SECREAT_KEY);
    return token;
}

module.exports=generateToken;