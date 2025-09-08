import { HydratedDocument, Model, ProjectionType, RootFilterQuery } from "mongoose";
import { AppError } from "../../utils/classError";



export abstract class DBRepository<TDocument>{
    constructor(protected readonly model:Model<TDocument>){}
     async create(data:Partial<TDocument>):Promise<HydratedDocument<TDocument>>{
            return await this.model.create(data)
    }
     async findOne(filter:RootFilterQuery<TDocument>,select?:ProjectionType<TDocument>):Promise<HydratedDocument<TDocument>|null>{
            return await this.model.findOne(filter)
    }
    }

