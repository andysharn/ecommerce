const ErrorHandler=require("../utils/errorhandler")

module.exports=(err,req,res,next)=>{
  
    err.statusCode=err.statusCode || 500
    err.message=err.message || "internal server error"
    if(err.name ==="castError"){
        const message= `resoursce not found  invalid :${err.path}`;
        err=new ErrorHandler(message,400)
    }


    if(err.code===11000){
        const message=`duplicate ${Object.keys(err.keyValue)} entered`;
        err=new ErrorHandler(message,404)
    }

    if(err.name==="JsonWebTokenError"){
        const message="token is invalid,try again"
        err=new ErrorHandler(message,404)

    }
    res.status(err.statusCode).json({
         success: false,
         message  : err.message,
        })
}