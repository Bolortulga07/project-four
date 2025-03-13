export const userSchemaTypes = `
  type User {
    username: String 
    password: String
  }
`;

export const userSchemaMutations = `
    login(username: String!, password: String!): String
`;
