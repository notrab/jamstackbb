import Link from "next/link";

import { useAuthState, useAuthDispatch } from "../context/auth";

export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();

  return (
    <>
      <header className="py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-200 rounded-lg flex items-center justify-between px-4 py-3">
            <div className="flex space-x-1">
              <Link href="/">
                <a className="text-gray-600 hover:text-primary-500">Home</a>
              </Link>
              {isAuthenticated ? (
                <span className="flex space-x-1">
                  <Link href="/edit-profile">
                    <a className="text-gray-600 hover:text-primary-500">
                      {user.name}
                    </a>
                  </Link>
                  <button
                    onClick={logout}
                    className="appearance-none text-gray-600 hover:text-primary-500"
                  >
                    Logout
                  </button>
                  <Link href="/new">
                    <a className="text-gray-600 hover:text-primary-500">
                      Post new thread
                    </a>
                  </Link>
                </span>
              ) : (
                <>
                  <Link href="/login">
                    <a className="text-gray-600 hover:text-primary-500">
                      Login
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="text-gray-600 hover:text-primary-500">
                      Register
                    </a>
                  </Link>
                </>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/today">
                <a className="text-gray-600 hover:text-primary-500">
                  Today's Posts
                </a>
              </Link>
              <Link href="/answered">
                <a className="text-gray-600 hover:text-primary-500">
                  Answered Posts
                </a>
              </Link>
              <Link href="/unanswered">
                <a className="text-gray-600 hover:text-primary-500">
                  Uanswered Posts
                </a>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">{children}</div>
    </>
  );
}
