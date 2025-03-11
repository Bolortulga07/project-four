import mongoose, { Model } from "mongoose";
import { bookSchema } from "../schemas/bookSchema";

interface IBook {
  title: string;
  author: string;
}

interface bookModel extends Model<IBook> {
  createBook(data: IBook): Promise<IBook>;
}

class Book {
  static async createBook(this: bookModel, data: IBook): Promise<IBook> {
    return this.create(data);
  }
}

bookSchema.loadClass(Book);

export const Books = mongoose.model("Books", bookSchema);
