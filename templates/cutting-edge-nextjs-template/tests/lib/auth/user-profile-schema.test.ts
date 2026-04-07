import { describe, expect, it } from "vitest";

import { userProfileUpdateSchema } from "@/features/auth/schemas/user-profile-schema";

describe("user-profile schema", () => {
  it("rejects invalid username format", () => {
    const parsed = userProfileUpdateSchema.safeParse({ username: "bad name" });

    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe("validation.username.invalidFormat");
    }
  });

  it("accepts nullable optional profile fields", () => {
    const parsed = userProfileUpdateSchema.safeParse({
      displayName: null,
      bio: null,
      pronouns: null,
      avatarUrl: null,
    });

    expect(parsed.success).toBe(true);
  });
});
