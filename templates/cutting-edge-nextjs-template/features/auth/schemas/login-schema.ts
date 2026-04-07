import { z } from "zod";

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("validation.email.invalid");

export const loginSchema = z.object({
  email: normalizedEmailSchema,
  password: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "validation.password.required",
    }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
