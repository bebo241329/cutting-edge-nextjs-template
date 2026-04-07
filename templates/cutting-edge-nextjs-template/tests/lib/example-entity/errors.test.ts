import { describe, expect, it } from "vitest";

import {
  ExampleEntityError,
  getHttpStatusForError,
} from "../../../lib/example-entity/errors";

describe("ExampleEntityError", () => {
  it("creates error with code", () => {
    const error = new ExampleEntityError("not_found");
    expect(error.code).toBe("not_found");
    expect(error.name).toBe("ExampleEntityError");
    expect(error.message).toContain("not_found");
  });

  it("is instanceof Error", () => {
    const error = new ExampleEntityError("not_found");
    expect(error instanceof Error).toBe(true);
  });
});

describe("getHttpStatusForError", () => {
  it("maps not_found to 404", () => {
    const error = new ExampleEntityError("not_found");
    expect(getHttpStatusForError(error)).toBe(404);
  });

  it("maps not_implemented to 501", () => {
    const error = new ExampleEntityError("not_implemented");
    expect(getHttpStatusForError(error)).toBe(501);
  });

  it("maps validation_error to 400", () => {
    const error = new ExampleEntityError("validation_error");
    expect(getHttpStatusForError(error)).toBe(400);
  });

  it("maps client_error to 400", () => {
    const error = new ExampleEntityError("client_error");
    expect(getHttpStatusForError(error)).toBe(400);
  });

  it("maps contract_error to 502", () => {
    const error = new ExampleEntityError("contract_error");
    expect(getHttpStatusForError(error)).toBe(502);
  });

  it("maps upstream_error to 502", () => {
    const error = new ExampleEntityError("upstream_error");
    expect(getHttpStatusForError(error)).toBe(502);
  });

  it("maps network_error to 502", () => {
    const error = new ExampleEntityError("network_error");
    expect(getHttpStatusForError(error)).toBe(502);
  });

  it("returns 500 for unknown error codes", () => {
    const error = new ExampleEntityError("unknown_code" as never);
    expect(getHttpStatusForError(error)).toBe(500);
  });

  it("returns 500 for non-ExampleEntityError", () => {
    const error = new Error("generic error");
    expect(getHttpStatusForError(error)).toBe(500);
  });
});
