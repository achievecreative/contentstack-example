import { Configuration, LogLevel } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID!,
    authority: `https://${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_ID}.ciamlogin.com/`,
    //clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_SECRET!, // Client secret generated from the app registration in Azure portal
    navigateToLoginRequestUrl: true,
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
    storeAuthStateInCookie: false, // set this to true if you have to support IE
  },
  system: {
    //allowNativeBroker: false, // Disables WAM Broker,
    loggerOptions: {
      loggerCallback(level: LogLevel, message: string, containsPii: boolean) {
        console.log(level, message, containsPii);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ["User.ReadWrite.All"],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
