const express= require('express')
require('dotenv').config();
const dbConnect=require('./config/database')
const {validateSignUpData}=require('./utils/validate')
const bcrypt= require('bcrypt')
const cookieParser=require('cookie-parser')
const jwt = require('jsonwebtoken')
const {userAuth}=require('./middlewares/auth')

const User= require('./models/user')


const app= express();


//middlewares 

//parse json data
app.use(express.json())

// parse form data 
app.use(express.urlencoded({ extended: true }));

// parse cookies 
app.use(cookieParser())








//configure routes here->>>>


// post signup
app.post('/signup',async(req,res)=>{

  
    

    
    

    try{
          // step 1-> validate user  data 

          validateSignUpData(req);


          // step 2 -> encrypt the password
        const {firstName,lastName,emailId,password}=req.body;
          const hashedPassword= await bcrypt.hash(password,10);


        
        await User.create({firstName,lastName,emailId,password:hashedPassword});
        res.send("user added successfully")
    }
    catch(e){
        res.status(400).send("cannot add user"+e.message)
    }

})



// post login API->

app.post('/login',async(req,res)=>{
    try{
        const { emailId, password} = req.body;

        // step 1-> validate 




        // step 1.1 -> get user by email , if not exists send invalid credentials 
        const user = await User.findOne({emailId:emailId});

        if(!user)return res.status(400).send("invalid credentials")


        // step 2 -> compare password , if err , send invalid credentials 
        const isValid= await bcrypt.compare(password,user.password);
        if(!isValid)return res.status(400).send("Ivalid credentials")


        // step 3 -> if valid password , generate token and login  
        const token =  jwt.sign({emailId:emailId},process.env.JWTSECRET);
        res.cookie('token',token,{httpOnly:true});

        res.send("login successful")
    }
    catch(e){
        res.status(400).send("ERROR : " + e.message );
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
app.patch('/user/:emailId',async(req,res)=>{
    
    try{

        const data= req.body;

    const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"];

    const isAllowed = Object.keys(data).every((value)=>{   
       return ALLOWED_UPDATES.includes(value);
    })
    if(!isAllowed) throw new Error("update not allowed")


       const user= await User.findOneAndUpdate({emailId:req.params?.emailId},req.body,{
            runValidators:true,
        })
        if(!user)return res.status(400).send("user not found")
        res.send('user updated')
    }
    catch(e){
        res.status(404).send("update failed "+ e.message)
    }

})


// get / profile -> get user profile
app.get('/profile',userAuth,async(req,res)=>{

    const {user}=req;

    res.send(user);

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
