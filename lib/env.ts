import { z } from "zod";

const envSchema = z.object({
  SHOPIFY_STORE_DOMAIN: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),

  SHOPIFY_ADMIN_ACCESS_TOKEN: z
    .string()
    .startsWith("shpat_", "Admin Token must start with 'shpat_'"),

  AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse({
  SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  AUTH_SECRET: process.env.AUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});
