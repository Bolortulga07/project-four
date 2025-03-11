import mongoose from "mongoose";

const schema = mongoose.Schema;

export const authorSchema = new schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
  },
});
