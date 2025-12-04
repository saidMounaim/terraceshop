import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { env } from "@/lib/env";
import { shopifyFetch } from "@/lib/shopify";
import { createAccessTokenMutation } from "@/lib/shopify/mutations/customer";
import { getCustomerQuery } from "@/lib/shopify/queries/customer";
import { syncShopifyCustomer } from "@/lib/auth/helpers";
import { signInSchema } from "./lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { body } = await shopifyFetch<any>({
          query: createAccessTokenMutation,
          variables: {
            input: {
              email: parsed.data.email,
              password: parsed.data.password,
            },
          },
          cacheTag: ["auth"],
        });

        const tokenData = body.data.customerAccessTokenCreate;

        if (tokenData.customerUserErrors?.length > 0) {
          console.error("Shopify Auth Error:", tokenData.customerUserErrors);
          return null;
        }

        const accessToken = tokenData.customerAccessToken.accessToken;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { body: customerBody } = await shopifyFetch<any>({
          query: getCustomerQuery,
          variables: { customerAccessToken: accessToken },
          cacheTag: ["auth"],
        });

        const customer = customerBody.data?.customer;
        const fullName = customer
          ? `${customer.firstName} ${customer.lastName}`
          : "";

        return {
          id: accessToken,
          email: parsed.data.email,
          name: fullName,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          await syncShopifyCustomer({
            email: user.email,
            firstName: profile?.given_name ?? "",
            lastName: profile?.family_name ?? "",
          });
          return true;
        } catch (error) {
          console.error("Google Sync Error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "credentials") {
          token.name = user.name;
          token.shopifyAccessToken = user.id;
        } else if (account?.provider === "google") {
          token.isGoogleUser = true;
        }
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.name = token.name;
      session.accessToken = token.shopifyAccessToken;
      session.isGoogleUser = token.isGoogleUser;
      return session;
    },
  },
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
