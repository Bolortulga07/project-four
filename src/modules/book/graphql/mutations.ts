import { Books } from "../../../models/Books";

export const bookMutations = {
  bookAdd: async (_parent: null, args: { title: string; author: string }) => {
    console.log("1", args.author);
    const newBook = new Books({ title: args.title, author: args.author });
    await newBook.save();
    return "Book added.";
  },
  bookRemove: async (_parent: null, args: { title: string }) => {
    await Books.findOneAndDelete({ title: args.title });

    return "Book removed.";
  },
  bookUpdate: async (
    _parent: any,
    args: { title: string; newTitle?: string; author?: string }
  ) => {
    await Books.findOneAndUpdate(
      { title: args.title },
      {
        $set: {
          ...(args.newTitle && { title: args.newTitle }),
          ...(args.author && { author: args.author }),
        },
      },
      { new: true }
    );
    return "Book updated successfully!";
  },
};
