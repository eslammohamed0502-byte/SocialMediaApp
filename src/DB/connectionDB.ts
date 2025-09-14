import mongoose from "mongoose";



export const connectionDB=()=>{
    mongoose.connect(process.env.MONGO_URL as unknown as string)
    .then(()=>console.log("DB connected"))
    .catch((err)=>console.log(err))
}