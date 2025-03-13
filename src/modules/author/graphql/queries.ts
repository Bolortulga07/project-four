import { Authors } from "../../../models/Authors";

export const authorQueries = {
  authors: async () => await Authors.find(),
  author: async (_parent: any, args: { name: string }) =>
    await Authors.findOne({ name: args.name }),
};
