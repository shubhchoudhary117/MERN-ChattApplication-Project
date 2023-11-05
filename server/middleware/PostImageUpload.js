const multer=require("multer");

const multerConfig=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"E:/ChattApplication/client/public/PostImages");
    },
    filename:(req,file,callback)=>{
        const ext=file.mimetype.split('/')[1];
        callback(null,`image-${Date.now()}.${ext}`);
    },
});





const isImage=(req,file,callback)=>{
    if(file.mimetype.startsWith('image')){
        callback(null,true)
    }
    else{
        callback(new Error("only image is allowed.."));
    }
    };

const upload=multer({
    storage:multerConfig,
    fileFilter:isImage
})

exports.uploadPostImage=upload.single("photo");

// for routing controller

