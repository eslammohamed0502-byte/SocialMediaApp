 import z from "zod"
import { GenderType } from "../DB/model/user.model"
import e from "express"

export enum LogoutFlag{
    allDevices="allDevices",
    currentDevice="currentDevice"
}

export const signInSchema={
    body:z.strictObject({
            email:z.string().email(),
            password:z.string().min(6).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        }).required()
   }

export const signUpSchema={
    body:signInSchema.body.extend({
            userName:z.string().min(3).max(30).trim(),
            cPassword:z.string(),
            age:z.number().min(18).max(80),
            address:z.string(),
            phone:z.string(),
            gender:z.enum([GenderType.male,GenderType.female])
        }).required().refine((data)=>data.password===data.cPassword,{error:"Password don't match",path:['cPassword']})
   }
export const confirmEmailSchema={
    body:z.strictObject({
            email:z.string().email(),
            otp:z.string().regex(/^\d{6}$/)
        }).required()
   }


export const logoutSchema={
    body:z.strictObject({
        flag:z.enum(LogoutFlag)
        }).required()
   }
export const forgetPasswordSchema={
    body:z.strictObject({
            email:z.string().email()
        }).required()
   }
   export const resetPasswordSchema={
    body:z.strictObject({
            email:z.string().email(),
            otp:z.string().regex(/^\d{6}$/),
            newPassword:z.string().min(6).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
            cNewPassword:z.string()
        }).required().refine((data)=>data.newPassword===data.cNewPassword,{error:"Password don't match",path:['cNewPassword']})
   }
   export const loginWithGoogleSchema={
    body:z.strictObject({
            tokenId:z.string()
        }).required()
   }


   export type signUpSchemaType=z.infer<typeof signUpSchema.body>
   export type signInSchemaType=z.infer<typeof signInSchema.body>
   export type confirmEmailType=z.infer<typeof confirmEmailSchema.body>
   export type logoutSchemaType=z.infer<typeof logoutSchema.body>
   export type forgetPasswordType=z.infer<typeof forgetPasswordSchema.body>
   export type resetPasswordType=z.infer<typeof resetPasswordSchema.body>
   export type loginWithGoogleType=z.infer<typeof loginWithGoogleSchema.body>