const express= require('express')
require('dotenv').config();
const dbConnect=require('./config/database')


const app= express();








// database connection ->>>>>>>>>>
dbConnect().then(()=>{
    console.log("Database Connection Successful")
    app.listen(process.env.PORT,()=>{
        console.log(`server is live at http://localhost:${process.env.PORT}`)
    })
}).catch(()=>{
    console.log("Database can't be connected")
})
