import jwt from "jsonwebtoken";

export const userMutations = {
  login: (
    _parent: undefined,
    { username, password }: { username: string; password: string }
  ) => {
    const token = jwt.sign({ user: { firstName: "bat" } }, "secret");

    return token;
  },
};
