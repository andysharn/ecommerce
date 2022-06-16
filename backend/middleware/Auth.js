const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt= require("jsonwebtoken");
const user= require("../models/userModel")

exports.isAutheticatedUser = catchAsyncError(async(req,res,next)=>{
const {token}=req.cookies
console.log(token)

if(!token){
     return next(new ErrorHandler("please login to access ",401))
}


const decodedData=jwt.verify(token,process.env.JWT_SECRET);
req.user=await user.findById(decodedData.id);

next();



})

exports.authorizeRoles=(...roles)=>{


     return (req,res,next)=>{

     if(!roles.includes(req.user.role )){
             return next(
          new ErrorHandler(`Roles ${req.user.role} is not allowed to access this resourse`,403))

     }
     next();

     }
}

