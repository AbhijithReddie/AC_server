const mongoose = require('mongoose');

const loginSchema= mongoose.Schema({
     email:{
        type:String
     },
     password:{
        type:String
     },
     rollno:{
        type:String
     },
     role:{
        type:String
     }
})

const loginModel= mongoose.model("login",loginSchema);
module.exports={loginModel,loginSchema};  