const Post=require('../models/Post');
const User=require('../models/User');

exports.createPost=async (req,res)=>{
    const {caption,content,image}=req.body;
    if(!caption || !content){
        return res.status(400).json({message:'Caption and content are required'});
    }
    try{
        const post=new Post({
            caption,
            content,
            image,
            author:req.user.id
        });
        await post.save();
        res.status(201).json({message:'Post created successfully',post});
    }catch(err){
        console.error(err);
        res.status(500).json({message:'Server error'});
    }
}