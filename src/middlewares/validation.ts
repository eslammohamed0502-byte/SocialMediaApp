
import  { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'
import { AppError } from '../utils/classError'

type ReqType= keyof Request
type SchemaType=Partial<Record<ReqType,ZodType>>

export const Validtion=(schema:SchemaType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const validtionsErrors=[]
for (const key of Object.keys(schema)as ReqType[]){
    if(!schema[key]) continue

    const result=schema[key].safeParse(req[key])
    if(!result?.success){
     validtionsErrors.push(result.error)
    }
}
if(validtionsErrors.length){
    throw new AppError(JSON.parse(validtionsErrors as unknown as string),400)
}
next()
    }
}   