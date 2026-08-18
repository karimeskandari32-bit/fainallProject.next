import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        phone:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },

        email:{
            type:String,
            default:null,
            lowercase:true,
            trim:true,
           
        },
        name:{
            type:String,
            default:"",
            trim:true,
            maxLength:50

        },
        role:{
            type:String,
            default:"user",
            enum:["user" , "admin"],
        },
        otp:{
            code:{
                type:String,
            },
            expiresAt:{
                type:Date,
            }
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
        purchaseCourses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Course",
                default:[],
            },
        ],
        lastLoginAt:{
            type:Date,
        },
        refreshToken:{
            type:String,
        },
       
    },
     {timestamps:true},

)

export default mongoose.models.User || mongoose.model("User" , userSchema)