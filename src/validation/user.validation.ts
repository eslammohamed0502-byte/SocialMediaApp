 import z from "zod"
import { GenderType } from "../DB/model/user.model"

export const signUpSchema={
    body:z.object({
            userName:z.string().min(3).max(30).trim(),
            email:z.string().email(),
            password:z.string().min(6).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
            cPassword:z.string(),
            age:z.number().min(18).max(80),
            address:z.string(),
            phone:z.string(),
            gender:z.enum([GenderType.male,GenderType.female])
        }).required().refine((data)=>data.password===data.cPassword,{error:"Password don't match",path:['cPassword']})
   }


   export type signUpSchemaType=z.infer<typeof signUpSchema.body>