const express=require('express')
const cookieParser=require("cookie-parser")
const errMiddleWare= require('../backend/middleware/error')

const app= express()

const product=require("./routes/productRoutes")
const user=require("./routes/userRoutes")
const order=require("../backend/routes/orderRoutes")

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)



app.use(errMiddleWare)

module.exports = app;
