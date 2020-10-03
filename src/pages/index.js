import Link from "next/link";
import { useAuthState, useAuthDispatch } from "../context/auth";

export default function IndexPage() {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();

  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Hello {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </>
  );
}
