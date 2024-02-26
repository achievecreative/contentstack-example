import Layout from "@/Layout";
import { getHeader } from "@/libs/stack";
import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";

import { MsalProvider } from "@azure/msal-react";
import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
  EventPayload,
} from "@azure/msal-browser";
import { msalConfig } from "../libs/authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

const isAuthenticationResult = (
  value: EventPayload
): value is AuthenticationResult => {
  return !!value && "account" in value;
};

msalInstance.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (
      event.eventType === EventType.LOGIN_SUCCESS &&
      isAuthenticationResult(event?.payload) &&
      event?.payload?.account
    ) {
      const account = event?.payload?.account;
      msalInstance.setActiveAccount(account);
    }
  });
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...initialProps
}: AppProps & { header: any }) {
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