import Link from "next/link";

import { useAuthState, useAuthDispatch } from "../context/auth";

export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();

  return (
    <>
      <header className="bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex space-x-1">
              <Link href="/">
                <a className="text-gray-100">Home</a>
              </Link>
              {isAuthenticated ? (
                <span className="flex space-x-1 text-gray-100">
                  <p>Hello {user.name}</p>
                  <button onClick={logout}>Logout</button>
                  <Link href="/new">
                    <a>Post new thread</a>
                  </Link>
                </span>
              ) : (
                <>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                  <Link href="/register">
                    <a>Register</a>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3 text-gray-100">
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
