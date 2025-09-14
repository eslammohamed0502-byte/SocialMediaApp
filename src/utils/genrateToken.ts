import Jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "./classError";
import { UserRepository } from "../DB/repositories/user.repository";
import { userModel } from "../DB/model/user.model";
import { RevokeTokenRepository } from "../DB/repositories/revokeToken.repository";
import revokeTokenModel from "../DB/model/revokeToken.model";


export enum TokenType{
    accessToken="access",
    refreshToken="refresh"
}


const _userModel=new UserRepository(userModel)
const _revokeToken=new RevokeTokenRepository(revokeTokenModel)


export const GenerateToken=async({payload,SIGNATURE,options}:{
    payload:Object,
    SIGNATURE:string,
    options?:Jwt.SignOptions
}):Promise<String>=>{
    return Jwt.sign(payload,SIGNATURE,options)
}

export const VerifyToken=async({token,SIGNATURE}:{
    token:string,
    SIGNATURE:string
}):Promise<JwtPayload>=>{
    return Jwt.verify(token,SIGNATURE) as JwtPayload
}


export const GetSignature=async(tokenType:TokenType,prefix:string)=>{
if(tokenType===TokenType.accessToken){
    if(prefix===process.env.BEARER_USER){
        return process.env.ACCESS_TOKEN_USER
}else if(prefix===process.env.BEARER_ADMIN){
        return process.env.ACCESS_TOKEN_ADMIN
    }else{
        return null
        }
}
if(tokenType===TokenType.refreshToken){
    if(prefix===process.env.BEARER_USER){
        return process.env.REFRESH_TOKEN_USER
}else if(prefix===process.env.BEARER_ADMIN){
        return process.env.REFRESH_TOKEN_ADMIN
    }else{
        return null
        }
}
return null
}

export const decodedTokenAndFetchUser=async(token:string,signature:string)=>{
    const decoded = await VerifyToken({ token, SIGNATURE: signature });
       if (!decoded?.email) {
        throw new AppError("Invaild Token",403);
        }
     const user = await _userModel.findOne({email:decoded.email});
      if (!user) {
        throw new AppError("User Not Found",404);}
        if(!user?.confirmed){
            throw new AppError("Please Confirm Your Email",403);
        }
        if(await _revokeToken.findOne({tokenId:decoded?.jti})){
            throw new AppError("Token has been revoked",401);
        }
        if(user?.changeCredentials?.getTime()!>decoded.iat!*1000){{
        throw new AppError("Token has been revoked",401);
        }
}
return {user,decoded};
}

