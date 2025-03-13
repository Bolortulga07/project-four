import mongoose from "mongoose";
import { authorSchema } from "./authorSchema";

const schema = mongoose.Schema;

export const bookSchema = new schema({
  title: { type: String, required: true },
  author: { type: [String], required: true },
  parentId: { type: String },
});
