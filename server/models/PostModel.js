const mongoose=require("mongoose")


const postSchema = mongoose.Schema(
    {
      userId: { type: String, required: true },
      description: {type: String, required : true},
      likes: [],
      comments:{
        type:[{
          commentId:String,
          commentText:String
        }],
        default:undefined
      }
       ,
      createdAt: {
        type: Date,
        default: new Date(),
      },
      postImage: {
        type:String,
        default:"goustUser.avif"
      },
    },
    {
      timestamps: true,
    }
  );
  
  var PostModel = mongoose.model("Posts", postSchema);
  
  module.exports= PostModel;