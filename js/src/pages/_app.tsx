import Layout from "@/Layout";
import { getHeader } from "@/libs/stack";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppContext, AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...initialProps
}: AppProps & { header: any }) {
  return (
    <SessionProvider session={session}>
      <Layout header={initialProps?.header}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

App.getInitialProps = async (context: AppContext) => {
  const header = await getHeader();
  return {
    header: header,
  };
};