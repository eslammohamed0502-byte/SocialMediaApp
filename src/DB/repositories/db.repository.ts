import { HydratedDocument, Model, ProjectionType, RootFilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";




export abstract class DBRepository<TDocument>{
    constructor(protected readonly model:Model<TDocument>){}
     async create(data:Partial<TDocument>):Promise<HydratedDocument<TDocument>>{
            return await this.model.create(data)
    }
     async findOne(filter:RootFilterQuery<TDocument>,select?:ProjectionType<TDocument>):Promise<HydratedDocument<TDocument>|null>{
            return await this.model.findOne(filter)
    }
    async updateOne(filter:RootFilterQuery<TDocument>,update:UpdateQuery<TDocument>):Promise<UpdateWriteOpResult>{
            return await this.model.updateOne(filter,update)
    }
}
