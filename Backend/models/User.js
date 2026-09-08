
const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    displayname:{
        type:String,
        required:true,
        maxlength:20,
    }
    ,username:{
        type:String,
        required:true,
        unique:true,
        maxlength:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,

    }
},{timestamps:true}
);

const User=mongoose.model('User',userSchema);
module.exports=User;