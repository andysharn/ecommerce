const mongoose= require('mongoose');
const validator=require ('validator');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto")
const { JsonWebTokenError } = require('jsonwebtoken');
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"enter your name"],
        maxlength:[30,"name cannot exceed 30 characters"],
        },
        email:{
            type: String,
            required:[true,"enter your email"],
            unique:true,
            validate:[validator.isEmail,"please enter valid email"]

        },
        password:{
            type: String,
            required:[true,"enter the password"],
            min:[8,"password should be greater than 8 characters"],
            select:false,
        },
        avatar:{
            public_id:{
                type : String,
                required:true,
            },
            url:{
                type :  String,
                required:true,
            },
        },
        role:{
            type: String,
            default:"user",
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,12)
})

userSchema.methods.getJWTToken=function()
{
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE,});


};

userSchema.methods.comparePassword=async function(enteredPassword){
    return  await bcrypt.compare(enteredPassword,this.password)
}


userSchema.methods.getResetPasswordToken=function(){
const resetToken =crypto.randomBytes(20).toString("hex");
this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
this.resetPasswordExpire=Date.now()+15*60*1000;

return resetToken;

}
module.exports=mongoose.model("user",userSchema);