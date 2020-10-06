import "../styles/app.css";

import "react-mde/lib/styles/css/react-mde-all.css";

import { AuthProvider } from "../context/auth";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
