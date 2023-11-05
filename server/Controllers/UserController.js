const User = require("../models/User.js")
const Conversation = require("../models/Conversation.js");
const PostModel = require("../models/PostModel.js")
const multer = require("multer")
const path = require("path")
class UserController {
    static getUser = async (req, res) => {

        try {
            const Users = await User.findOne({ _id: req.user._id });
            res.status(200).json({ users: Users, userNotFound: false, Authorization: true })
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ usernotfound: true, authorization: false })
        }

    }

    // get all users
    static getAllUsers = async (req, res) => {
        try {
            const allusers = await User.find();
            res.status(200).json({ users: allusers, authorization: true })
        }
        catch (error) {
            res.status(401).json({ authorization: false })
        }
    }

    // add a new follower to user
    static addFollower = async (req, res) => {
        let followingId = req.body.mainuserid;
        let followerId = req.body.followerid;
        try {
            let followingUser = await User.findById(followingId);
            let followerUser = await User.findById(followerId);
            // add follower in messanger conversation model
            if (!followingUser.followers.includes(followerId)) {
                const newConversation = new Conversation({
                    members: [followerId, followingId]
                });
                var AddedConversation = await newConversation.save();
            }
            // add follower
            if (!followingUser.followings.includes(followerId)) {
                const updatedUser = await followingUser.updateOne({ $push: { followings: followerId } });
                const addedFollowers = await followerUser.updateOne({ $push: { followers: followingId } });
                res.status(200).json({ followerAdded: true, user: updatedUser, conversation: AddedConversation })
            }
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ followerAdded: false, user: null, somethingwrong: true })
        }

    }


    // get another single user
    static getAnotherUser = async (req, res) => {
        let id = req.params.friendid;
        console.log("id---->"+id)
        try {
          await User.findOne({ _id: req.params?.friendid })
           .then((response)=>{
            console.log(response);
            res.status(200).json({ user: response, userNotFound: false, Authorization: true });
           }).catch((error)=>{
            res.status(401).json({ user: null, userNotFound: true, Authorization: false });
           })
        }
        catch (error) {
            console.log(error)
        }

        // .then((response) => {
        //    console.log(response)
        //     res.status(200).json({ user: response, userNotFound: false, Authorization: true })
        // })
        // .catch((error)=>{
        //     console.log;
        //     res.status(401).json({ user: null, userNotFound: true, Authorization: false })
        // })

    }

    // update a user profile
    static updatedUser = async (req, res) => {
        console.log(req.file)
        try {
            const user = await User.findById(req.body.userid);
            const updatedUser = await User.updateOne
                ({ _id: req.body.userid }, { username: req.body.newusername?req.body.newusername:user.username, bio: req.body.bio, profilePicture: req.file ? req.file.filename : user.profilePicture });
            res.status(200).json({ updated: true, somethingwrong: false });
        } catch (error) {
            res.status(401).json({ updated: false, somethingwrong: true })
        }
    }

    // add a user post
    static AddPost = async (req, res) => {
        try {
            const newPost = new PostModel({
                userId: req.body.userid,
                postImage: req.file.filename,
                description: req.body.description,
                createdAt: req.body.createdAt
            });
            const addedPost = await newPost.save();
            res.status(200).json({ posted: true, somethingwrong: false, post: addedPost })
        }
        catch (error) {
            res.status(401).json({ posted: false, somethingwrong: true })
        }
    }


    // get all posts
    static getAllPosts = async (req, res) => {
        try {
            const AllPosts = await PostModel.find();
            res.status(200).json({ posts: AllPosts, authorization: true, somethingwrong: false })
        } catch (error) {
            console.log(error)
            res.status(401).json({ posts: null, somethingwrong: true })
        }
    }

    // add comment on particular post
    static AddComment=async(req,res)=>{
        console.log(req.body);
        let postId=req.body.postId;
        let cId=req.body.commentId;
        let cText=req.body.commentText;
        try{
            const addedComment=await PostModel.updateOne({_id:postId},{$addToSet:{comments:[{commentId:cId,commentText:cText}]}});
            res.json({added:true,comment:addedComment})
        }
        catch(error){
            console.log(error);
        }
    }

    // get all coments from given post id
    static getComments=async(req,res)=>{
        try{
            let foundedPost=await PostModel.findOne({_id:req.params.postId});
            res.status(200).json({Post:foundedPost});
        }catch(error){
            conosole.log(error);
            res.status(401).json({somethingWentWrong:true})
        }
       
    }

    // add likes
    static AddLike=async(req,res)=>{
       
        try{
           let foundedPost=await PostModel.findOne({_id:req.body.postId});
           if(!foundedPost.likes.includes(req.body.userId)){
            await PostModel.updateOne({_id:req.body.postId},{$push:{likes:req.body.userId}})
            res.status(200).json({liked:true});
           }
        
        }catch(error){
            console.log(error);
            res.status(401).json({liked:false})
        }
      
    }


}//end of the class


module.exports = UserController;