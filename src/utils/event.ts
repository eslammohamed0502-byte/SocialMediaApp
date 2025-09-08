import { EventEmitter } from "events";
import { generateOtp, sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/email.temp";


export const eventEmitter=new EventEmitter()


    eventEmitter.on("Confirm Email",async(data)=>{
        const {email}=data
           const otp= await generateOtp()
              await sendEmail({
                to:email,
                subject:"Welcome to Social Media App",
                html:emailTemplate(otp as unknown as string,"Email Confirmation")
              })
    })
