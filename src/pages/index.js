import { useAuthState } from "../context/auth";

export default function IndexPage() {
  const { isAuthenticated } = useAuthState();

  return isAuthenticated ? "Hello user" : "Hello guest";
}
