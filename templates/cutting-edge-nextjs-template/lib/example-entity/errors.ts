export const EXAMPLE_ENTITY_ERROR_CODES = [
  "not_found",
  "not_implemented",
  "validation_error",
  "client_error",
  "contract_error",
  "upstream_error",
  "network_error",
  "permission_denied",
] as const;

export type ExampleEntityErrorCode =
  (typeof EXAMPLE_ENTITY_ERROR_CODES)[number];

export class ExampleEntityError extends Error {
  readonly code: ExampleEntityErrorCode;

  constructor(code: ExampleEntityErrorCode) {
    super(code);
    this.name = "ExampleEntityError";
    this.code = code;
  }
}

export function isExampleEntityError(error: unknown): error is ExampleEntityError {
  if (!(error instanceof Error)) {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;

  return (
    typeof maybeCode === "string" &&
    (EXAMPLE_ENTITY_ERROR_CODES as readonly string[]).includes(maybeCode)
  );
}

export function getHttpStatusForError(error: unknown): number {
  if (!isExampleEntityError(error)) {
    return 500;
  }

  switch (error.code) {
    case "not_found":
      return 404;
    case "not_implemented":
      return 501;
    case "validation_error":
    case "client_error":
      return 400;
    case "permission_denied":
      return 403;
    case "contract_error":
      return 502;
    case "upstream_error":
    case "network_error":
      return 502;
    default:
      return 500;
  }
}
