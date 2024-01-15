import NextAuth, {
  Account,
  NextAuthOptions,
  Profile,
  TokenSet,
  User,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

import AzureADB2C from "next-auth/providers/azure-ad-b2c";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADB2C({
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_B2C_TENANT_ID ?? "",
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW ?? "",
      authorization: { params: { scope: "offline_access openid" } },
      //authorization: `https://login.microsoftonline.com/${process.env.AZURE_AD_B2C_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    }),
  ],
  debug: false,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (email?.verificationRequest) {
        return true;
      }

      //TODO: connect with dynamic 365
      return true;
    },
    async session({ session, user, token }) {
      const newToken = token as NewToken;
      return {
        expires: session.expires,
        user: {
          ...session.user,
          fullName: newToken?.additional?.profile?.given_name
            ? `${newToken?.additional?.profile?.given_name} ${newToken?.additional?.profile?.family_name}`
            : newToken?.name,
          id: newToken?.additional.user?.id ?? "",
        },
        id_token: newToken.id_token,
      };
    },

    async jwt({ token, user, account, profile }) {
      const newToken = token as NewToken;
      if (account) {
        const tokenWithAdditional: NewToken = {
          ...token,
          id_token: account.id_token!,
          expired:
            Number(account.not_before) + Number(account.id_token_expires_in),
          additional: {
            user,
            account: account,
            profile: { ...profile },
          },
        };
        return tokenWithAdditional;
      } else {
        /* else if (newToken.expired * 1000 > Date.now()) {
        //console.log('❤️❤️❤️❤️ Not Expired yet')
        return newToken
      } */
        const response = await fetch(
          `https://${process.env.AZURE_AD_B2C_TENANT_ID}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_ID}.onmicrosoft.com/${process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW}/oauth2/v2.0/token`,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.AZURE_AD_B2C_CLIENT_ID!,
              client_secret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: newToken.additional.account.refresh_token!,
            }),
            method: "POST",
          }
        );
        const tokens: TokenSet = await response.json();
        return {
          ...token,
          id_token: tokens.id_token,
          expired:
            Number(tokens.not_before) + Number(tokens.id_token_expires_in),
        };
      }
    },
  },
};

export default NextAuth(authOptions);

type NewToken = JWT & {
  id_token: string;
  expired: number;
  additional: {
    user: User | AdapterUser;
    account: TokenSet;
    profile: Profile & Record<string, string>;
  };
};
