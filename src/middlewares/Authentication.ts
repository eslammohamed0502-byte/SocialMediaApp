import { NextFunction, Request, Response } from "express";
import { decodedTokenAndFetchUser, GetSignature, TokenType } from "../utils/genrateToken";
import { AppError } from "../utils/classError";




export const authentication =  (tokenType:TokenType=TokenType.accessToken) => {
    return async (req:Request, res: Response, next: NextFunction) => {

      const { authorization } = req.headers;
      const [prefix, token] = authorization?.split(" ") || [];

      if (!prefix || !token) {
        throw new AppError("Wrong Token",403);
      }
  const signature = await GetSignature(tokenType,prefix);
      if(!signature){
        throw new AppError("Invalid Token",403);
}
const decoded=await decodedTokenAndFetchUser(token,signature)
if(!decoded){
    throw new AppError("Invalid Token",403);
}
req.user=decoded?.user
req.decoded=decoded?.decoded
      return next();
    } 
}
    
