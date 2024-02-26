// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
    authority: `https://${process.env.AZURE_AD_B2C_TENANT_ID}.ciamlogin.com/`,
    clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET, // Client secret generated from the app registration in Azure portal
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker,
    loggerOptions: {
      loggerCallback(loglevel: any, message: any, containsPii: any) {
        console.log(loglevel, message, containsPii);
      },
      piiLoggingEnabled: false,
      logLevel: "Info",
    },
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
