import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config: Configuration = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID!,
      authority: `https://${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_ID}.ciamlogin.com/`,
      clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_SECRET!,
    },
  };

  // Create msal application object
  const cca = new ConfidentialClientApplication(config);

  const response = await cca.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  const accessToken = response?.accessToken;

  console.log("🚀", "access token", accessToken);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  var raw = JSON.stringify({
    passwordProfile: {
      forceChangePasswordNextSignIn: false,
      password: "",
    },
  });

  var requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
  };

  const result = await fetch(
    "https://graph.microsoft.com/v1.0/users/ededa465-e700-4660-85cf-45e38f54d570",
    requestOptions
  ).then((response) => response.text());

  res.status(200).send(result);
}
