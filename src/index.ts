import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Books } from "./models/Books";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Authors } from "./models/Authors";

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string).then(() => {
  console.log("connected to MONGO");
});

const app = express();

interface Book {
  title: string;
  author: string;
  parentId: string;
}

interface Author {
  name: string;
  age: number;
  book: string;
}

const typeDefs = `

  type Author {
    id: ID!
    name: String!
    age: Int

    authorBooks: [Book]
  }

  input AuthorInput {
    name: String!  }

  type Book {
    title: String
    author: [Author]

    authorAndTitle: Author
  }

  type Query {
    books(title: String): [Book]
    book(title: String!): Book
    authors(name: String!): [Author]
    author(name: String!): Author
    authorBooks(name: String!): [Book]
  }

  type Mutation {
    bookAdd(title: String!, author: AuthorInput): String
    bookRemove(title: String!): String
    bookUpdate(title: String!, newTitle: String!, author: String): String

    authorAdd(name: String!, age: Int): String
  }
`;

const resolvers = {
  Query: {
    books: async (_parent: null) => {
      return await Books.find();
    },
    book: async (_parent: null, args: { title: string }) => {
      return await Books.findOne(args);
    },

    authors: async () => await Authors.find(),
    author: async (_parent: any, args: { name: string }) =>
      await Authors.findOne({ name: args.name }),
  },

  Mutation: {
    bookAdd: async (_parent: null, args: { title: string; author: string }) => {
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
          ...(args.newTitle && { title: args.newTitle }),
          ...(args.author && { author: args.author }),
        },
        { new: true }
      );
      return "Book updated successfully!";
    },
    authorAdd: async (_parent: any, args: { name: string; age?: number }) => {
      const newAuthor = new Authors({ name: args.name, age: args.age });
      await newAuthor.save();
      return "Author added!";
    },
  },

  Book: {
    authorAndTitle: async (parent: Book) => {
      return await Authors.find({ name: { $in: parent.author } });
    },
  },

  Author: {
    authorBooks: async (parent: Author) => {
      return await Books.find({ author: parent.name });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// app.get("/books", (_req, res) => {
//   const newBooks = books.map((book: any) => {
//     book.authorAndTitle = `${book.author} ${book.title}`;
//     return book;
//   });

//   res.send(newBooks);
// });

// app.get("/book", (_req, res) => {
//   const newBooks = books.map((book: any) => {
//     book.authorAndTitle = `${book.author} ${book.title}`;
//     return book;
//   });

//   res.send(newBooks[0]);
// });

const startServer = async () => {
  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();
