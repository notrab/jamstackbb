export default async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Lookup user from Hasura by email
  const user = { name };

  // 2. If user found, return error

  // 3. Hash the password

  // 4. Create user on Hasura

  // 5. Create a JWT
  const token = "abc";

  // 6. Return the JWT as token + user
  res.status(200).json({ token, ...user });
};
