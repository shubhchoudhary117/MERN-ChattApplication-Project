const express=require("express");
const Message=require("../../models/Message.js")
const router=express.Router();


router.post("/savemessg",async(req,res)=>{
    const newMessage=new Message(req.body);
    try{
        const savedMessage=await newMessage.save();
        res.status(200).send({message:savedMessage,somethingwentwrong:false,messageSent:true})
    }
    catch(error){
        console.log(error);
        res.status(500).json({messageSend:false});
    }
   
})


// get messages


router.get("/getmessg/:conversationId",async(req,res)=>{
   
    try{
      const messages=await Message.find({conversationId:req.params.conversationId});

      res.status(200).json({messages:messages,idInvalid:false})
    }
    catch(error){
      console.log(error)
    }
   
})


module.exports=router;