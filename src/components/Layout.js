import Link from "next/link";

import { useAuthState, useAuthDispatch } from "../context/auth";

export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();

  return (
    <>
      <header className="bg-white py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <Link href="/">
                <a>Home</a>
              </Link>
              {isAuthenticated ? (
                <span className="flex space-x-1">
                  <p>Hello {user.name}</p>
                  <button onClick={logout}>Logout</button>
                  <Link href="/new">Post new thread</Link>
                </span>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/today">
                <a>Today's Posts</a>
              </Link>
              <Link href="/answered">
                <a>Answered Posts</a>
              </Link>
              <Link href="/unanswered">
                <a>Uanswered Posts</a>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">{children}</div>
    </>
  );
}
