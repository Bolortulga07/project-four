import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string).then(() => {
  console.log("connected to MONGO");
});

const app = express();

interface Book {
  title: string;
  author: string;

  authorAndTitle: string;
}

const typeDefs = `
  type Book {
    title: String
    author: String

    authorAndTitle: String
  }

  type Query {
    books(title: String): [Book]
    book(title: String!): Book
  }

  type Mutation{
    bookAdd(title: String!, author: String!): String
    bookRemove(title: String!): String
    bookUpdate(title: String!, newTitle: String! author: String): String
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: (_parent: null) => {
      return;
    },
    book: (_parent: null, args: { title: string }) => {
      return books.find((book) => book.title === args.title);
    },
  },

  Mutation: {
    bookAdd: (_parent: null, args: { title: string; author: string }) => {
      const newBook = {
        title: args.title,
        author: args.author,
        authorAndTitle: `${args.author} ${args.title}`,
      };
      books.push(newBook);
      return "success";
    },
    bookRemove: (_parent: null, args: { title: string }) => {
      books.filter((book) => book.title !== args.title);

      return "success";
    },
    bookUpdate: (
      _parent: null,
      args: { title: string; newTitle: string; author?: string }
    ) => {
      const book = books.find((b) => b.title === args.title);
      if (!book) return "Book not found";

      book.title = args.newTitle;
      if (args.author) {
        book.author = args.author;
      }

      return "success";
    },

    Book: {
      authorAndTitle: (parent: Book) => {
        return `${parent.author} ${parent.title}`;
      },
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.get("/books", (_req, res) => {
  const newBooks = books.map((book: any) => {
    book.authorAndTitle = `${book.author} ${book.title}`;
    return book;
  });

  res.send(newBooks);
});

app.get("/book", (_req, res) => {
  const newBooks = books.map((book: any) => {
    book.authorAndTitle = `${book.author} ${book.title}`;
    return book;
  });

  res.send(newBooks[0]);
});

const startServer = async () => {
  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();
