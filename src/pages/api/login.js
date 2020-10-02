import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { hasuraAdminClient, gql } from "../../lib/hasura-admin-client";

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      name
      email
      password
    }
  }
`;

export default async (req, res) => {
  const { email, password: rawPassword } = req.body;

  const {
    users: [foundUser],
  } = await hasuraAdminClient.request(GetUserByEmail, {
    email,
  });

  if (!foundUser)
    return res.status(401).json({
      message: "Invalid email/password.",
    });

  const { password, ...user } = foundUser;

  const passwordsMatch = await bcrypt.compare(rawPassword, password);

  if (!passwordsMatch)
    return res.status(401).json({
      message: "Invalid email/password.",
    });

  const token = jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["guest", "user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user.id,
      },
    },
    process.env.HASURA_GRAPHQL_JWT_SECRET,
    {
      subject: user.id,
    }
  );

  res.status(200).json({ token, ...user });
};
