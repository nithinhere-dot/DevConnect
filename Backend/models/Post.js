const mongoose=require('mongoose');
const { captureOwnerStack } = require('react');

const postschema=new mongoose.Schema({
    caption:{type:String},
    image:{type:String},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    comments:[{
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        text:{type:String},
        createdAt:{type:Date,default:Date.now}
    }]
},{timestamps:true});

const Post=mongoose.model('Post',postschema);
module.exports=Post;    
