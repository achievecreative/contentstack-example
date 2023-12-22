import Layout from "@/Layout";
import { getHeader } from "@/libs/stack";
import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";

export default function App({
  Component,
  pageProps,
  ...initialProps
}: AppProps) {
  return (
    <Layout header={initialProps?.header}>
      <Component {...pageProps} />
    </Layout>
  );
}

App.getInitialProps = async (context: AppContext) => {
  const header = await getHeader();
  return {
    header: header,
  };
};