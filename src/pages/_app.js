import "../styles/app.css";

import "react-mde/lib/styles/css/react-mde-all.css";

import { AuthProvider } from "../context/auth";
import LastSeen from "../components/LastSeen";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LastSeen>
        <Component {...pageProps} />
      </LastSeen>
    </AuthProvider>
  );
}
