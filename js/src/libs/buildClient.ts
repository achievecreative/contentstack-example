import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";

const scopes = process.env.NEXT_PUBLIC_COMMERCETOOLS_SCOPE?.split(" ");

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.NEXT_PUBLIC_COOMERCETOOLS_AUTHURL!,
  projectKey: process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!,
  credentials: {
    clientId: process.env.NEXT_PUBLIC_COMMERCETOOLS_CLIENTID!,
    clientSecret: process.env.NEXT_PUBLIC_COMMERCETOOLS_SECRET!,
  },
  scopes: scopes,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.NEXT_PUBLIC_COOMERCETOOLS_APIURL!,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withProjectKey(process.env.NEXT_PUBLIC_COMMERCETOOLS_PROJECTKEY!)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();
