const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


exports.signUp=async (req,res)=>{
    try{
    const {displayname,email,password} = req.body;
    if(!displayname || !email || !password){
        return res.status(400).json({message:'Please fill all the fields'});

    }
    if(password.length<6){
        return res.status(400).json({message:'password Should be atleast 6 characters long'});
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:'User already Exists'});
    }

    const hashedPassword=bcrypt.hashSync(password,10);
    

    const user=await User.create({
        displayname,
        email,
        password:hashedPassword,
    })
    res.json({message:'User Created Successfully'});
    }catch(err){
    res.status(500).json({message:'Server Error',err:err.message})
}
};
exports.login=async (req,res)=>{
    try{
    const {email,password}=req.body;
     if(!email || !password){
        return res.status(400).json({message:'Please fill all the fields'});
    }
    const existingUser=await User.findOne({email});
    if(!existingUser){
        return res.status(400).json({message:'Invalid Credentials'});
    }
    const isMatch=bcrypt.compareSync(password,existingUser.password);
    if(!isMatch){
        return res.status(400).json({message:'Invalid Credentials'});
    }
    const token=jwt.sign({id:existingUser._id,email:email},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.json({message:'Login Successful', token});
}catch(err){
    res.status(500).json({message:'Server Error', err:err.message})
}
};