import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import { Books } from "./models/Books";
import { Context, User } from "./utils/@types";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Authors } from "./models/Authors";
import { bookQueries } from "./modules/book/graphql/queries";
import { authorQueries } from "./modules/author/graphql/queries";
import { bookMutations } from "./modules/book/graphql/mutations";
import { authorsMutations } from "./modules/author/graphql/mutations";
import { userMutations } from "./modules/auth/graphql/mutations";
import { userSchemaTypes } from "./modules/auth/graphql/schema";
import { userSchemaMutations } from "./modules/auth/graphql/schema";

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
    bookAdd(title: String!, author: [String]): String
    bookRemove(title: String!): String
    bookUpdate(title: String!, newTitle: String!, author: [String]): String

    authorAdd(name: String!, age: Int): String
    ${userSchemaMutations}
  }
`;

const resolvers = {
  Query: {
    ...bookQueries,
    ...authorQueries,
  },

  Mutation: {
    ...bookMutations,
    ...authorsMutations,
    ...userMutations,
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

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization;
        if (token) {
          console.log("token", token);
          try {
            const tokendata = jwt.verify(token, "123") as User;
            console.log("tokendata", tokendata);
            return { user: tokendata };
          } catch {
            return { user: null };
          }
        }

        return { user: null };
      },
    })
  );

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();
