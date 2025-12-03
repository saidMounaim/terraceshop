"use server";

import { shopifyFetch } from "@/lib/shopify";
import { createCustomerMutation } from "@/lib/shopify/mutations/customer";
import { RegisterSchema } from "../validations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerCustomer(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body } = await shopifyFetch<any>({
      query: createCustomerMutation,
      variables: {
        input: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          password: parsed.data.password,
        },
      },
    });

    const { customerCreate } = body.data;

    if (customerCreate?.customerUserErrors?.length > 0) {
      return { error: customerCreate.customerUserErrors[0].message };
    }

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }
}
