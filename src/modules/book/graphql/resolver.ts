import { Book } from "../@types";

export const bookCustomResolvers = {
  authorAndTitle: (parent: Book) => {
    return `${parent.author} ${parent.title}`;
  },
};
