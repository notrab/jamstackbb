import { useAuthState, useAuthDispatch } from "../context/auth";

export default function IndexPage() {
  const { isAuthenticated, user } = useAuthState();
  const { login, register, logout } = useAuthDispatch();

  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Hello {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button
            onClick={() =>
              login({
                email: "j@j.com",
                password: "abc123",
              })
            }
          >
            Login
          </button>
          <button
            onClick={() =>
              register({
                name: "John",
                email: "j@j.com",
                password: "abc123",
              })
            }
          >
            Register
          </button>
        </>
      )}
    </>
  );
}
