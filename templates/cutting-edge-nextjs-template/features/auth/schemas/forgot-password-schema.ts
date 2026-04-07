import { z } from "zod";

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("validation.email.invalid");

export const forgotPasswordSchema = z.object({
  email: normalizedEmailSchema,
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
