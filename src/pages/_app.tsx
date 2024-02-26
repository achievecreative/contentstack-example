import Layout from "@/Layout";
import { getHeader } from "@/libs/stack";
import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";

import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
  EventPayload,
} from "@azure/msal-browser";
import { msalConfig } from "../libs/authConfig";
import { useEffect, useState } from "react";
import authContext from "@/libs/AuthContext";

export const msalInstance = new PublicClientApplication(msalConfig);

export const userToken = {
  account: null,
  id_token: "",
  access_token: "",
};

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
    console.log("🚀 msalInstance event", event);
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
  pageProps,
  ...initialProps
}: AppProps & { header: any }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    msalInstance.handleRedirectPromise().then((tokenResponse) => {
      console.log("🚀tokenResponse", tokenResponse);
      let accountObj = null;
      if (tokenResponse !== null) {
        accountObj = tokenResponse.account;
        const id_token = tokenResponse.idToken;
        const access_token = tokenResponse.accessToken;

        //console.log("🚀🚀", id_token, access_token, accountObj.username);
        setUser({
          account: tokenResponse.account,
          id_token,
          access_token,
        });
      }
    });
  }, []);

  return (
    <authContext.Provider value={user}>
      <Layout header={initialProps?.header}>
        <Component {...pageProps} />
      </Layout>
    </authContext.Provider>
  );
}

App.getInitialProps = async (context: AppContext) => {
  const header = await getHeader();
  return {
    header: header,
  };
};
