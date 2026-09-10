const express=require('express');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());

const mongoose=require('mongoose');

mongoose.connect('process.env.MONGO_URI')
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));


app.get('/',(req,res)=>{
    res.send('API is running...');
});

const authRoutes=require('./routes/authRoutes');
app.use('/api/auth',authRoutes);

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));