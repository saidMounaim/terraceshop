import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
