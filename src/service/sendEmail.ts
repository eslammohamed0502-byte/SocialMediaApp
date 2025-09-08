
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export const sendEmail = async (mailOptions:Mail.Options)=>{

const transporter = nodemailer.createTransport({
    service: 'gmail',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});


  const info = await transporter.sendMail({
    from: `"SocialMediaApp" <${process.env.EMAIL_USER}>`,
    ...mailOptions

  });
  console.log("Message sent:", info.messageId);

}


export const generateOtp=async()=>{
    return Math.floor(Math.random()*(99999-10000+1)+10000)
}
