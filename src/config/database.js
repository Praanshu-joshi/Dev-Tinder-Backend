const mongoose= require('mongoose')

const dbConnect= async()=>{
   await mongoose.connect(process.env.DB);
}
module.exports=dbConnect;