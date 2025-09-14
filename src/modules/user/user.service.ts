import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/classError";
import {  RoleType, userModel, userProvider } from "../../DB/model/user.model";
import { confirmEmailType, forgetPasswordType, loginWithGoogleType, LogoutFlag, logoutSchemaType, resetPasswordType, signInSchemaType, signUpSchemaType } from "../../validation/user.validation";
import { UserRepository } from "../../DB/repositories/user.repository";
import { Compare, hashData } from "../../utils/hash";
import { generateOtp } from "../../service/sendEmail";
import { GenerateToken } from "../../utils/genrateToken";
import { eventEmitter } from "../../utils/event";
import { v4 as uuidv4 } from 'uuid';
import { RevokeTokenRepository } from "../../DB/repositories/revokeToken.repository";
import revokeTokenModel from "../../DB/model/revokeToken.model";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { Token } from "nodemailer/lib/xoauth2";





class UserService{

  private _userModel=new UserRepository(userModel)
  private _revokeToken=new RevokeTokenRepository(revokeTokenModel)
  constructor(){
  }

  SignUp = async (req: Request, res: Response, next: NextFunction) => {
    let { userName, email, password, cPassword, age, address, phone, gender }: signUpSchemaType = req.body
    if (await this._userModel.findOne({ email })) {
      throw new AppError("Email already exists", 400)
    }
    if (password !== cPassword) {
      throw new AppError("Passwords do not match", 400)
    }
    const otp = await generateOtp()
    const hashOtp = await hashData(String(otp))
    const hash = await hashData(password)
    const user = await this._userModel.createOneUser({ userName, email, password: hash, otp: hashOtp, age, address, phone, gender })
    eventEmitter.emit("ConfirmEmail", { email, otp })
    const { password: _, ...safeUser } = user.toObject()

    return res.status(201).json({ message: "successfully signed up", user: safeUser })
  }


  confirmEmail=async(req:Request,res:Response,next:NextFunction)=>{
        const {email,otp}:confirmEmailType=req.body
      const user= await this._userModel.findOne({email,confirmed:{$exists:false}})
      if (!user){
       throw new AppError("In-valid email Or Email Already Confirmed",404)
      }
      if (!await Compare(otp,user?.otp as unknown as string)){
       throw new AppError("Invalid Otp",409)
      }
     await this._userModel.updateOne({email:user?.email},{confirmed:true,$unset:{otp:""}})
    return res.status(200).json({message:"Email confirmed successfully"})
}

  SignIn=async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}:signInSchemaType=req.body
         const user= await this._userModel.findOne({email,confirmed:true, provider:userProvider.system})
      if (!user){
       throw new AppError("Email Not Exist",404)
      }
      if (!await Compare(password,user?.password as unknown as string)){
       throw new AppError("Password Is Wrong",404)
      }
      const jwtid=uuidv4()
       const access_token = await GenerateToken({
  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === RoleType.user 
    ? process.env.ACCESS_TOKEN_USER!
    : process.env.ACCESS_TOKEN_ADMIN!,
  options: { expiresIn: "1h" ,jwtid}
});

    const refresh_token=await GenerateToken({  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === RoleType.user
    ? process.env.REFRESH_TOKEN_USER!
    : process.env.REFRESH_TOKEN_ADMIN!,
  options: { expiresIn: "1y",jwtid}
}) 
    return res.status(200).json({message:"successfully signed in",access_token,refresh_token})
}

  getProfile=async(req:Request,res:Response,next:NextFunction)=>{

    return res.status(200).json({message:"Success",user:req.user})
}


  logout=async(req:Request,res:Response,next:NextFunction)=>{
    const {flag}:logoutSchemaType=req.body
    if(flag=== LogoutFlag?.allDevices){
      await this._userModel.updateOne({_id:req.user?._id},{changeCredentials:new Date()})
          return res.status(200).json({message:"Success logout from all devices"})

}
await this._revokeToken.create({
  tokenId:req.decoded?.jti!,
  userId:req.user?._id!,
  expireAt:new Date (req.decoded?.exp!*1000)
})
  return res.status(200).json({message:"Success logout from current device"})
}
  refrestToken=async(req:Request,res:Response,next:NextFunction)=>{
      const jwtid=uuidv4()
       const access_token = await GenerateToken({
  payload: { id: req.user?._id, email:req?.user?.email },
  SIGNATURE: req?.user?.role === RoleType.user 
    ? process.env.ACCESS_TOKEN_USER!
    : process.env.ACCESS_TOKEN_ADMIN!,
  options: { expiresIn: "1h" ,jwtid}
});

    const refresh_token=await GenerateToken({  payload: { id:req.user?._id, email:req?.user?.email },
  SIGNATURE: req?.user?.role === RoleType.user
    ? process.env.REFRESH_TOKEN_USER!
    : process.env.REFRESH_TOKEN_ADMIN!,
  options: { expiresIn: "1y",jwtid}
}) 
await this._revokeToken.create({
  tokenId:req.decoded?.jti!,
  userId:req.user?._id!,
  expireAt:new Date (req.decoded?.exp!*1000)
})
    return res.status(200).json({message:"success",access_token,refresh_token})
}
loginWithGoogle=async(req:Request,res:Response,next:NextFunction)=>{
    const {tokenId}:loginWithGoogleType=req.body
const client = new OAuth2Client();
async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: tokenId!,
        audience: process.env.WEB_CLIENT_ID!, 
    });
    
    const payload = ticket.getPayload();
    return payload
};
const {email,email_verified,picture,name}=await verify() as TokenPayload
  let user= await this._userModel.findOne({email})
    if(!user){
      user=await this._userModel.create({
        userName:name!,
        email:email!,
        confirmed:email_verified!,
        image:picture!,
        password:uuidv4()!,
        provider:userProvider.google
      })
    }
    if(user.provider!==userProvider.system){
       throw new AppError(`You have account with us using ${user.provider} provider`,400)
    }
} 

 forgetPassword=async(req:Request,res:Response,next:NextFunction)=>{
  const {email}:forgetPasswordType=req.body
  const user= await this._userModel.findOne({email,confirmed:true})
  if (!user){
   throw new AppError("Email Not Exist",404)
  }
  const otp= await generateOtp()
  const hashOtp=await hashData(String(otp))
 await this._userModel.updateOne({email},{otp:hashOtp})
eventEmitter.emit("ForgotPassword",{email,otp})
  return res.status(200).json({message:"Please check your email"})
}

resetPassword=async(req:Request,res:Response,next:NextFunction)=>{
  const {email,otp,newPassword,cNewPassword}:resetPasswordType=req.body
  const user= await this._userModel.findOne({email,otp:{$exists:true}})
  if (!user){
   throw new AppError("Email Not Exist",404)
  }
  if (!await Compare(otp,user?.otp!)){
   throw new AppError("Invalid Otp",409)
  }
  const hash=await hashData(newPassword)
 await this._userModel.updateOne({email},{password:hash,$unset:{otp:""}})
  return res.status(200).json({message:"Password changed successfully"})
}
}


export default new UserService()
