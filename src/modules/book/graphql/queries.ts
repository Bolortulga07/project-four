import { Books } from "../../../models/Books";
import { checkLogin } from "../../../utils/checkLogin";

export const bookQueries = {
  books: async () => {
    return await Books.find();
  },

  book: async (_parent: undefined, args: { title: string }, { user }: any) => {
    console.log(1, user);
    checkLogin(user);
    return await Books.findOne(args);
  },
};
