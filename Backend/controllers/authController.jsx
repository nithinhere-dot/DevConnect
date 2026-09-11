const user=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


exports.signUp=(req,res)=>{
    try{
    const {displayname,email,password} = req.body;
    if(!displayname || !email || !password){
        return res.status(400).json({message:'Please fill all the fields'});

    }
    if(password.length<6){
        return res.status(400).json({message:'password Should be atleast 6 characters long'});
    }
    const existingUser=user.findOne({email});
    if(existingUser){
        return res.status(400).json({message:'User already Exists'});
    }

    const hashedPassword=bcrypt.hashSync(password,10);
    

    const User=await user.Create({
        displayname,
        email,
        password:hashedPassword,
    })
    res.json({message:'User Created Successfully',User});
    }catch(err){
    res.status(500).json({message:'Server Error',err:err.message})
}



};
exports.login=(req,res)=>{};