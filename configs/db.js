import mongoose from "mongoose"
const conectToDB = async () => {
    try{
        if(mongoose.connection.readyState>=1){
            return true
        }else{
            await mongoose.connect(process.env.MONGO_URI)
            
        }

    }catch(error){
        console.log("db conection has error" , error)
    }
}

export default conectToDB