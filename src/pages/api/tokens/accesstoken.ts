import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config: Configuration = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_ID}.onmicrosoft.com/`, //`https://${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_ID}.ciamlogin.com/`,

      clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_SECRET!,
      knownAuthorities: [
        `${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_ID}.b2clogin.com`,
      ],
    },
  };

  console.log(config);

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

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const result = await fetch(
    "https://graph.microsoft.com/v1.0/users/e59eb7b5-40e8-49b1-814d-575011c12f87?$select=identities,mail,displayName,id",
    requestOptions
  ).then((response) => response.text());

  res.status(200).send(result);
}
