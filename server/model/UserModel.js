import mongoose from "mongoose";        


const userSchema = new mongoose.Schema({
    email :{
        type: String, 
        require: true, 
        unique: true,
    },
    password :{
        type: String, 
        require: true,
    } ,
    verifyOtp :{
        type: String, 
        default: '',
    } ,
    verifyOtpExpireAt :{
        type: Number, 
        default: 0,
    } ,
    isAccountVerified :{
        type: Boolean, 
        default: false,
    } ,
    resetOtp :{
        type: String, 
        default: '',
    } ,
    resetOtpExpireAt :{
        type: Number, 
        default: 0,
    } ,
    name: {
  type: String,
  default: "",
},

role: {
  type: String,
  enum: ["student", "admin"],
  default: "student",
},

photoUrl: {
  type: String,
  default: "",
},
})

const userModel =  mongoose.models.user || mongoose.model('user',userSchema);

export default userModel