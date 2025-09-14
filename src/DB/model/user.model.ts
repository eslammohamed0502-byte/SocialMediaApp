import mongoose, { Types } from "mongoose"

export enum GenderType {
    male="male",
    female="female"
}

export enum RoleType {
    user="user",
    admin="admin"
}
export enum userProvider{
    system="system",
    google="google"
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
    image?:string,
    gender:GenderType,
    role?:RoleType,
    provider?:userProvider,
    confirmed?:boolean,
    otp?:string,
    changeCredentials?:Date,
    createdAt:Date,
    updatedAt:Date
}



const userSchema=new mongoose.Schema<IUser>({
    fName:{type:String,required:true,minlength:3,maxlength:30,trim:true},
    lName:{type:String,required:true,minlength:3,maxlength:15,trim:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    password:{type:String,required: function(){
        return this.provider===userProvider.system?true:false
    }},
    age:{type:Number,min:18,max:80,required: function(){
        return this.provider===userProvider.system?true:false
    }},
    phone:{type:String},
    otp:{type:String},
    image:{type:String},
    confirmed:{type:Boolean},
    provider:{type:String,enum:userProvider,default:userProvider.system},
    address:{type:String,trim:true},
    changeCredentials:{type:Date},
    gender:{type:String,enum:GenderType,required: function(){
        return this.provider===userProvider.system?true:false
    }},
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

userSchema.pre("save" ,function(next){
    
})

export const userModel=mongoose.models.User||mongoose.model<IUser>("User",userSchema)