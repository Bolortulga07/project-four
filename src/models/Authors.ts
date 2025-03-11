import mongoose, { Model } from "mongoose";
import { authorSchema } from "../schemas/authorSchema";

interface IAuthor {
  name: string;
  age: number;
}

interface authorModel extends Model<IAuthor> {
  createAuthor(data: IAuthor): Promise<IAuthor>;
}

class Author {
  static async createAuthor(
    this: authorModel,
    data: IAuthor
  ): Promise<IAuthor> {
    return this.createAuthor(data);
  }
}

authorSchema.loadClass(Author);

export const Authors = mongoose.model("Authors", authorSchema);
