const express= require('express')
require('dotenv').config();
const dbConnect=require('./config/database')


const User= require('./models/user')


const app= express();


//middlewares 

//parse json data
app.use(express.json())

// parse form data 
app.use(express.urlencoded({ extended: true }));








//configure routes here->>>>


// post signup
app.post('/signup',async(req,res)=>{
    
    const data = req.body;

    try{
        await User.create(data);
        res.send("user added successfully")
    }
    catch(e){
        res.status(400).send("cannot add user"+e.message)
    }

})


// get user by Emailid 
app.get('/user',async(req,res)=>{
    const {emailId:userEmail}=req.body;
    try{
        const user=await User.findOne({emailId:userEmail});
        if(!user)return res.send("no such user exist")
        return res.send(user)
    }
    catch(e){
        res.status(404).send("something went wrong"+e.message)
    }
})

// get /feed api -> get all users from database

app.get('/feed',async(req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }
    catch(e){
        res.status(404).send("something went wrong"+e.message)
    }
})


// delete /user -> delete user by emailid 
app.delete('/user',async(req,res)=>{
    const {emailId:email}=req.body;
    try{
        await User.findOneAndDelete({emailId:email});
       return  res.send("user deleted ")
    }
    catch(e){
        res.status(404).send("something went wrong"+e.message)
    }
})


// patch /user -> update user 
app.patch('/user',async(req,res)=>{

    try{
        await User.findOneAndUpdate({emailId:req.body.emailId},req.body)
        res.send('user updated')
    }
    catch(e){
        res.status(404).send("something went wrong"+e.message)
    }

})






// database connection ->>>>>>>>>>
dbConnect().then(()=>{
    console.log("Database Connection Successful")
    app.listen(process.env.PORT,()=>{
        console.log(`server is live at http://localhost:${process.env.PORT}`)
    })
}).catch(()=>{
    console.log("Database can't be connected")
})
