const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const {auth}=require('../middleware/authMiddleware');

router.post('/',authController.signUp);
router.post('/login',authController.login);
router.get('/profile',auth,authController.getProfile);
router.put('/profile',auth,authController.updateProfile);

module.exports=router;