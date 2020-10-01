export default async (req, res) => {
  const { email, password } = req.body;

  // 1. Lookup user from Hasura
  const user = { name: "Jamie" };

  // 2. If no user found, return error

  // 3. Do the passwords match?

  // 4. Create a JWT
  const token = "abc";

  // 5. Return the JWT as token + user
  res.status(200).json({ token, ...user });
};
