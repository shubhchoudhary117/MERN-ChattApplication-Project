const mongoose=require("mongoose");

const connectDB=()=>{
    mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((response)=>{
        console.log("connect to database successfully")
    })
    .catch((Error)=>{
        console.log(Error)
    })
    
}

module.exports=connectDB;


