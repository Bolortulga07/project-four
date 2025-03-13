import { Authors } from "../../../models/Authors";

export const authorsMutations = {
  authorAdd: async (_parent: any, args: { name: string; age?: number }) => {
    const newAuthor = new Authors({ name: args.name, age: args.age });
    await newAuthor.save();
    return "Author added!";
  },
};
