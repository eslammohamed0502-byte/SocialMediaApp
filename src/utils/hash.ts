
import {compare,genSalt,hash}from 'bcrypt'

export const hashData=async(plainText:string,saltRounds:number=Number(process.env.SALT_ROUNDS))=>{
    return  hash(plainText,saltRounds)
}

export const Compare=async(plainText:string,cipherText:string)=>{
    return  compare(plainText,cipherText)
}