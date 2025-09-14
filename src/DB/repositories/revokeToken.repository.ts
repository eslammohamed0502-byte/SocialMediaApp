import {  Model } from "mongoose";
import { DBRepository } from "./db.repository";
import { IRevokeToken } from "../model/revokeToken.model";


export class RevokeTokenRepository extends DBRepository<IRevokeToken>{
    constructor(protected readonly model:Model<IRevokeToken>){
        super(model)
}

}
