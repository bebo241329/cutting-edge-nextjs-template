import { z } from "zod";

const metadataSchema = z.record(z.unknown()).nullable();

export const userProfileUpdateSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "validation.fullName.tooShort")
      .max(100, "validation.fullName.tooLong")
      .optional(),
    displayName: z
      .string()
      .trim()
      .min(2, "validation.displayName.tooShort")
      .max(50, "validation.displayName.tooLong")
      .nullable()
      .optional(),
    username: z
      .string()
      .trim()
      .min(3, "validation.username.tooShort")
      .max(30, "validation.username.tooLong")
      .regex(/^[A-Za-z0-9_]+$/, "validation.username.invalidFormat")
      .nullable()
      .optional(),
    avatarUrl: z.string().url("validation.avatarUrl.invalidUrl").nullable().optional(),
    pronouns: z
      .string()
      .trim()
      .max(30, "validation.pronouns.tooLong")
      .nullable()
      .optional(),
    bio: z.string().trim().max(500, "validation.bio.tooLong").nullable().optional(),
    metadata: metadataSchema.optional(),
  })
  .strict();

export type UserProfileUpdateSchema = z.infer<typeof userProfileUpdateSchema>;
