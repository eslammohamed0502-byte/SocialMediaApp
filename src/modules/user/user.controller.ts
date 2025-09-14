import { Router } from "express";
import  US from "./user.service";
import { Validtion } from "../../middlewares/validation";
import * as UV from "../../validation/user.validation";
import { authentication } from "../../middlewares/Authentication";
import { TokenType } from "../../utils/genrateToken";

const userRouter = Router();


userRouter.post("/signUp",Validtion(UV.signUpSchema),US.SignUp) 
userRouter.post("/confirmEmail",Validtion(UV.confirmEmailSchema),US.confirmEmail) 
userRouter.post("/signIn",Validtion(UV.signInSchema),US.SignIn) 
userRouter.get("/getProfile",authentication(),US.getProfile) 
userRouter.post("/logout",authentication(),Validtion(UV.logoutSchema),US.logout) 
userRouter.get("/refreshToken",authentication(TokenType.refreshToken),US.refrestToken) 
userRouter.patch("/forgetPassword",Validtion(UV.forgetPasswordSchema),US.forgetPassword) 
userRouter.patch("/resetPassword",Validtion(UV.resetPasswordSchema),US.resetPassword)
userRouter.post("loginWithGoogle",Validtion(UV.loginWithGoogleSchema),US.loginWithGoogle)







export default userRouter;