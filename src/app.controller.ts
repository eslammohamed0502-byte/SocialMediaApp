import {resolve}from 'path' 
import {config }from 'dotenv'
config({path:resolve('./config/.env')})
import express, { NextFunction, Request, Response } from 'express'
import cors from "cors"
import helmet from 'helmet'
import {rateLimit} from "express-rate-limit"
import { AppError } from './utils/classError'
import userRouter from './modules/user/user.controller'
import { connectionDB } from './DB/connectionDB'

const app:express.Application = express()
const port:string|number = process.env.PORT || 5000
const limiter=rateLimit({
    windowMs:1*60*1000,
    limit:5,
    message:{
        error:"try again later......"
    },
    statusCode:429,
    legacyHeaders:false
})


const bootstarb=async()=>{

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(limiter)

app.use("/users",userRouter)
await connectionDB()
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    return res.status(200).json({message:"Welcome to my API"})
})





app.use("{/*demo}",(req:Request,res:Response,next:NextFunction)=>{
    throw new AppError("Invalid URL",404)
})


app.use((err:AppError,req:Request,res:Response,next:NextFunction)=>{
    return res.status(err.statusCode as unknown as number||500).json({error:err.message,stack:err.stack})
})

 app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default bootstarb