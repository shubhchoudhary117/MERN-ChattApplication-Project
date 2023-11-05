const { request } = require('express');
var express = require('express');
const {protect}=require("../middleware/protect.js")
var router = express.Router();
var UserController=require("../Controllers/UserController.js");
const { uploadImage } = require('../middleware/ProfileImageUpload.js');
const {uploadPostImage} =require("../middleware/PostImageUpload.js")
/* GET home page. */

router.get("/getanother-user/:friendid",protect,UserController.getAnotherUser);
router.get("/getuser",protect,UserController.getUser);
router.get("/allusers",protect,UserController.getAllUsers);
router.post("/addfollower",UserController.addFollower);
router.post("/update",protect,uploadImage,UserController.updatedUser);
router.post("/post",protect,uploadPostImage,UserController.AddPost)
router.get("/getposts",protect,UserController.getAllPosts)
router.post("/post/comment",protect,UserController.AddComment);
router.post("/post/like",protect,UserController.AddLike)
router.get("/post/get-commets/:postId",protect,UserController.getComments)


module.exports = router;
