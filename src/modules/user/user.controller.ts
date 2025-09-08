import { Router } from "express";
import  US from "./user.service";
import { Validtion } from "../../middlewares/validation";
import { signUpSchema } from "../../validation/user.validation";

const userRouter = Router();


userRouter.post("/signUp",Validtion(signUpSchema),US.SignUp) 
userRouter.post("/signIn",US.SignIn) 






export default userRouter;