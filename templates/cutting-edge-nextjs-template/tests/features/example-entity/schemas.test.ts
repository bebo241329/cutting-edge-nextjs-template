import { describe, expect, it } from "vitest";

import { exampleEntitySchema } from "../../../features/example-entity/schemas/entity-schema";

describe("example entity schema", () => {
  it("requires title", () => {
    const parsed = exampleEntitySchema.safeParse({ title: "", body: "abc" });
    expect(parsed.success).toBe(false);
  });

  it("requires body", () => {
    const parsed = exampleEntitySchema.safeParse({ title: "Test", body: "" });
    expect(parsed.success).toBe(false);
  });

  it("enforces title max length", () => {
    const parsed = exampleEntitySchema.safeParse({
      title: "a".repeat(121),
      body: "Test body",
    });
    expect(parsed.success).toBe(false);
  });

  it("enforces body max length", () => {
    const parsed = exampleEntitySchema.safeParse({
      title: "Test",
      body: "a".repeat(5001),
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts valid payload", () => {
    const parsed = exampleEntitySchema.safeParse({
      title: "Test Entity",
      body: "Test body content",
    });
    expect(parsed.success).toBe(true);
  });
});
