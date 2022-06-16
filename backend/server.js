const app=require("./app")

const dotenv=require("dotenv")
const connectDatabase=require("./config/database")

dotenv.config({path:"backend/config/config.env"});

process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`);
    console.log("shutting down server due to uncaught exception ")
    process.exit(1);
})

connectDatabase();

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`);
})


process.on("unhandledRejection",(err)=>{
 console.log(`error ${err.message}`)
 console.log("shutting down server")
  server.close(()=>{
  process.exit(1);    
  })
})