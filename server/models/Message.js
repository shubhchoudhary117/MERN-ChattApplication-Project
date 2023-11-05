const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String
        },
        senderId:{
            type:String
        },
        text:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

module.exports=mongoose.model("Message",messageSchema);