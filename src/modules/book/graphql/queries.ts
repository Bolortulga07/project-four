import { Books } from "../../../models/Books";
import { Book } from "../@types";

export const bookQueries = {
  books: async () => {
    return await Books.find();
  },

  book: async (_parent: undefined, args: { title: string }, { user }: any) => {
    return await Books.findOne(args);
  },
};
