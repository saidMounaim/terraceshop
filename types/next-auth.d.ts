import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    isGoogleUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    shopifyAccessToken?: string;
    isGoogleUser?: boolean;
  }
}
