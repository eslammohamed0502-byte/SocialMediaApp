import mongoose, { Types } from "mongoose"

export enum GenderType {
    male="male",
    female="female"
}

export enum RoleType {
    user="user",
    admin="admin"
}



export interface IUser{
    _id:Types.ObjectId,
    fName:string,
    lName:string,
    userName?:string,
    email:string,
    password:string,
    age:number,
    phone?:string,
    address?:string,
    gender:GenderType,
    role?:RoleType,
    createdAt:Date,
    updatedAt:Date
}



const userSchema=new mongoose.Schema<IUser>({
    fName:{type:String,required:true,minlength:3,maxlength:30,trim:true},
    lName:{type:String,required:true,minlength:3,maxlength:15,trim:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    password:{type:String,required:true},
    age:{type:Number,required:true,min:18,max:80},
    phone:{type:String},
    address:{type:String,trim:true},
    gender:{type:String,enum:GenderType,required:true},
    role:{type:String,enum:RoleType,default:RoleType.user}
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})


userSchema.virtual("userName").set(function(value){
    const [fName,lName]=value.split(" ")
    this.set({fName,lName})
}).get(function(){
    return this.fName+" "+this.lName
})

export const userModel=mongoose.models.User||mongoose.model<IUser>("User",userSchema)