import { EventEmitter } from "events";
import { generateOtp, sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/email.temp";


export const eventEmitter=new EventEmitter()


 eventEmitter.on("ConfirmEmail",async(data)=>{
        const {email,otp}=data
              await sendEmail({
                to:email,
                subject:"Welcome to Social Media App",
                html:emailTemplate(otp as unknown as string,"Email Confirmation")
              })
    })

    eventEmitter.on("ForgotPassword",async(data)=>{
        const {email,otp}=data
              await sendEmail({
                to:email,
                subject:"Reset Your Password",
                html:emailTemplate(otp as unknown as string,"Reset Password")
              })
    })
    eventEmitter.on("restPassword",async(data)=>{
        const {email,newPassword}=data
              await sendEmail({
                to:email,
                subject:"Password Changed Successfully",
                html:`<h1>Your Password Changed Successfully</h1> 
                <p>Your new password is : ${newPassword}</p>`
              })
    })
