const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
    photoUrl:{
        type:String,
        default:"https://www.zica.co.zm/wp-content/uploads/2021/02/dummy-profile-image.png"
    },
    about:{
        type:String,
        default:"This is a default about of the user"
    },
    skills:{
        type:[String]
    }

})

const userModel=mongoose.model("User",userSchema);

module.exports=userModel;