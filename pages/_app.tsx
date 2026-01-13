import "../styles/globals.css";
import type { AppProps } from "next/app";
import CSR from "../components/csr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CSR>
      <Component {...pageProps} />
    </CSR>
  );
}

export default MyApp;
