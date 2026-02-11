const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth=async(req,res,next)=>{
    try{
        const {token}= req.cookies;
        if(!token)throw new Error("Login to devTinder");

        const decoded=jwt.verify(token,process.env.JWTSECRET);


        const user = await User.findOne({emailId:decoded.emailId});

        if(!user)throw new Error("login to devTinder")

        req.user=user;

        next();

        

    }
    catch(e){
        res.status(400).send("ERROR: " + e.message);
    }


    
}

module.exports={
    userAuth,
};