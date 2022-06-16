const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const User= require("../models/userModel");
const sendToken = require('../utils/jwtTokens');
const sendEmail=require('../utils/sendEmail.js')
const crypto=require('crypto');
exports.registerUser=catchAsyncError(async(req,res,next)=>{

    const {name,email,password}=req.body;

    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a public id",
            url:"this is a url"
        }
    })

   sendToken(user,201,res)
     
})

exports.loginUser=catchAsyncError(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return next(new ErrorHandler("please enter email & password",400))
    }

    const user= await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("invalid email or password",401))
    }

    const isPasswordMatched=await user.comparePassword(password);
   
    if(!isPasswordMatched){
        return next(new ErrorHandler("please enter correct email or password",401));
    }

sendToken(user,200,res);
})


exports.logout=catchAsyncError(async(req,res,next)=>{



    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"successfully logged out"
    })
})


exports.forgotPassword=catchAsyncError(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("user not exist ",404))
    }
   const resetToken=  user.getResetPasswordToken();

   await user.save({validateBeforeSave:false});


   const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
   const message=`your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested for this please  connect to the team for assistance`

   try{

      await sendEmail({

        email: user.email,
        subject:"ecommerce password recovery ",
        message,

      })

      res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully `
      })

   }catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500))
   }
})

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("reset password token is invalid",400))
    }

    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler("password doesnot match",400))
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user,200,res);
})

exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
 
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})

exports.updatePassword=catchAsyncError(async(req,res,next)=>{
 
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect"),400);
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("password does not match"),400)
    }

    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
   
})


exports.updateProfile=catchAsyncError(async(req,res,next)=>{
 const newUserData={
    name:req.body.name,
    email:req.body.email,

 }

     const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
     })
 
res.status(200).json({
    success:true
})
   
})
exports.getAllUser=catchAsyncError(async(req,res,next)=>{
const user =await User.find();
   res.status(200).json({
       success:true,
       user
   })
      
   })
   exports.getSingleUser=catchAsyncError(async(req,res,next)=>{
    const user =await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not exist with id : ${req.params.id}`),400)
    }
       res.status(200).json({
           success:true,
           user,
       })
          
       })

       exports.updateUserRole=catchAsyncError(async(req,res,next)=>{
        const newUserData={
           name:req.body.name,
           email:req.body.email,
           role:req.body.role
       
        }
       
            const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
               new:true,
               runValidators:true,
               useFindAndModify:false
            })

            if(!user){
                return next(new ErrorHandler(`user does not exist  with id ${req.params.id}`),400)
              } 
        
       res.status(200).json({
           success:true
       })
          
       })

       exports.deleteUser=catchAsyncError(async(req,res,next)=>{
    
          const user=await User.findById(req.params.id)

          if(!user){
            return next(new ErrorHandler(`user does not exist  with id ${req.params.id}`),400)
          } 
          await user.remove();
       res.status(200).json({
           success:true
       })
          
       })

       