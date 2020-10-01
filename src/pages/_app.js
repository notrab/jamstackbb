import "../styles/app.css";

import { AuthProvider } from "../context/auth";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
