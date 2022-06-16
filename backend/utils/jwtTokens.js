const sendToken= async (user,statusCode,res)=>{
    const token = user.getJWTToken();
    const options={
        expire:new Date(
            Date.now() + process.env.COOKIE_EXPIRE *60*1000
        ),
        httpOnly:true,
        }
        console.log(user,"hello");
   res.status(statusCode).cookie('token',token,options).json({
    success:true,
    user,
    token,

})
}

module.exports = sendToken;