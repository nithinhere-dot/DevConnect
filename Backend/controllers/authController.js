const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const axios = require('axios');




function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function newUsername(email){
    let base=email.split('@')[0];
    let username=base;
    while(true){
        const existingUser=await User.findOne({username});
        if(!existingUser){
            return username;
        }
        username=base+Math.floor(Math.random()*1000);
    }  
}


exports.signUp=async (req,res)=>{
    try{
    const {displayname,email,password} = req.body;
    if(!displayname || !email || !password){
        return res.status(400).json({message:'Please fill all the fields'});

    }
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

    if(password.length<6){
        return res.status(400).json({message:'password Should be atleast 6 characters long'});
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:'User already Exists'});
    }

    const hashedPassword=bcrypt.hashSync(password,10);
    
    const username=await newUsername(email);

    const user=await User.create({
        displayname,
        email,
        password:hashedPassword,
        username
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

exports.getProfile=async (req,res)=>{
    try{
        const userId=req.user.id;
        const user=await User.findOne({_id:userId}).select('-password');
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.json({user});
    }catch(err){
        return res.status(500).json({message:'Server Error'})
    }
}

exports.updateProfile=async (req,res)=>{
    try{
    const {userName,githubUsername}=req.body;
    const userId=req.user.id;

    if(userName){
        const ExistingUser=await User.findOne({username:userName});
        if(ExistingUser && ExistingUser._id.toString()!==userId){
            return res.status(400).json({message:'Username already taken'});
        }else{
            await User.findByIdAndUpdate(userId,{username:userName});
        }

    }
    if(githubUsername){
        try{
            const response = await axios.get(`https://api.github.com/users/${githubUsername}`);
        }catch(err){
            return res.status(400).json({message:'Invalid Github Username'});
        }
        await User.findByIdAndUpdate(userId,{githubUsername:githubUsername,gitUrl:`https://api.github.com/users/${githubUsername}`});
    }
    }catch(err){
        return res.status(500).json({message:'Server Error',err:err.message})
    }
    return res.json({message:'Profile Updated Successfully'});

}
