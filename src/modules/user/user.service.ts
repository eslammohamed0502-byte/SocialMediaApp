import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/classError";
import { IUser, userModel } from "../../DB/model/user.model";
import { HydratedDocument, Model } from "mongoose";
import { signUpSchemaType } from "../../validation/user.validation";
import { DBRepository } from "../../DB/repositories/db.repository";
import { UserRepository } from "../../DB/repositories/user.repository";
import { hashData } from "../../utils/hash";
import { generateOtp, sendEmail } from "../../service/sendEmail";
import { emailTemplate } from "../../service/email.temp";
import { eventEmitter } from "../../utils/event";





class UserService{

  private _userModel=new UserRepository(userModel)
  constructor(){
  }

      SignUp=async(req:Request,res:Response,next:NextFunction)=>{
        let {userName,email,password,cPassword,age,address,phone,gender}:signUpSchemaType=req.body
      if (await this._userModel.findOne({email})){
       throw new AppError("Email already exists",409)
      }
   

    const hash=await hashData(password)

    const user= await this._userModel.createOneUser({userName,email,password:hash,age,address,phone,gender})

    eventEmitter.emit("Confirm Email",{email})

    return res.status(200).json({message:"successfully signed up",user})
}


  SignIn=(req:Request,res:Response,next:NextFunction)=>{

    return res.status(200).json({message:"successfully signed in"})
}
}


export default new UserService()