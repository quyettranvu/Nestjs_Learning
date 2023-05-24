import { FilterQuery, Model, QueryOptions } from 'mongoose';

//Repository file is used to interact with database(abstract the database layer and write cleaner, more maintainable code).
//Here we are using
export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc): Promise<any> {
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T> {
    return this.model.findById(id, option);
  }

  async findByCondition(
    filter,
    field?: any | null, //specifies which fileds to include or exclude from result
    option?: any | null, //specifies additional options for query, such as sorting or limiting the result
    populate?: any | null, //specfies which fileds to populate(điền) in the result
  ): Promise<T> {
    // return (await this.model.findOne(filter, field, option)).populate(populate);
    const result = await this.model.findOne(filter, field, option);
    if (populate) {
      return result.populate(populate);
    }
    return result;
  }

  async getByCondition(
    filter,
    field?: any | null, //specifies which fileds to include or exclude from result
    option?: any | null, //specifies additional options for query, such as sorting or limiting the result
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  //aggregate: sum, total
  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>); //return true or false
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  }

  async deleteByCondition(filter) {
    return this.model.deleteMany(filter);
  }

  async findByContionAndUpdate(filter, update) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, update);
  }

  async updateMany(filter, update, option?: any | null) {
    return this.model.updateMany(filter, update, option);
  }

  async findByIdAndUpdate(id, update) {
    return this.model.findByIdAndUpdate(id, update);
  }
}
