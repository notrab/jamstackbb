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
                email: "j@jjj.com",
                password: "abc123",
              })
            }
          >
            Login
          </button>
          <button
            onClick={() =>
              register({
                name: "Nathan",
                email: "j@jjj.com",
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
