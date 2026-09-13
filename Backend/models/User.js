
const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    displayname:{
        type:String,
        required:true,
        maxlength:20,
    }
    ,username:{
        type:String,
        unique:true,
        required:true,
        maxlength:20,
    }
    ,githubUsername:{
        type:String,
        unique:true,
        maxlength:20,
    }
    ,gitUrl:{
        type:String,
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