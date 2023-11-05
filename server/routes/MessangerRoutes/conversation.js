const express=require("express");
const Conversation = require("../../models/Conversation.js");

const router=express.Router();

router.post("/",async(req,res)=>{
    const newConversation=new Conversation({
        members:[req.body.senderid,req.body.reciverid]
    });
    try{
       const savedConversation= await newConversation.save();
        res.status(200).json({conversationAddes:true,conversation:savedConversation})
    }
    catch(error){
        res.status(500).json(error);
    }
})

// get the particular conversations
router.get("/getconversation/:userid",async(req,res)=>{
    try{
        console.log(req.params.userid)
        const conversations=await Conversation.find({
            members:{$in:[req.params.userid]},
        });
       

        res.status(200).json({conversation:conversations})
    }catch(error){
        res.status(401).json(error)
        console.log(error)
    }
})

module.exports=router;