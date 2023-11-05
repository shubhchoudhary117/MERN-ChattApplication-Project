const mongoose = require("mongoose");
const userSchema=new mongoose.Schema({
    username: {
      type: mongoose.Schema.Types.Mixed,
        require: true,
        min: 3,
        max: 30

      },
      fullname:{
        type: mongoose.Schema.Types.Mixed,
        min: 3,
        max: 30
      },
      emailorphone: {
        type: String,
        required: true,
        max: 50,
        unique: true,
      },
      bio:{
        type:String
      },
      password: {
        type: String,
        required: true,
        min: 6,
      },
      profilePicture: {
        type:String,
        default:"goustUser.avif"
      },
      followers:{
        type:Array,
        default:[]
      },
      followings:{
        type:Array,
        default:[]
      },
      posts:{
        type:Object
      }
})

module.exports= mongoose.model("User",userSchema);