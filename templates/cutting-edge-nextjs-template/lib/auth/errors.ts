export const AUTH_ERROR = {
  INVALID_CREDENTIALS: "invalid_credentials",
  REGISTER_FAILED: "register_failed",
  FORGOT_PASSWORD_FAILED: "forgot_password_failed",
  AUTH_CLIENT_ERROR: "auth_client_error",
  UPSTREAM_SERVICE_ERROR: "upstream_service_error",
  FIREBASE_AUTH_NOT_IMPLEMENTED: "firebase_auth_not_implemented",
  PERMISSION_DENIED: "permission_denied",
  INSUFFICIENT_ROLE: "insufficient_role",
  ACCOUNT_DEACTIVATED: "account_deactivated",
  EMAIL_ALREADY_TAKEN: "email_already_taken",
  USERNAME_ALREADY_TAKEN: "username_already_taken",
  USER_PROFILE_NOT_FOUND: "user_profile_not_found",
  USER_PROFILE_CREATE_FAILED: "user_profile_create_failed",
  USER_PROFILE_UPDATE_FAILED: "user_profile_update_failed",
} as const;
export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

const authErrorStatusMap: Record<AuthErrorCode, number> = {
  [AUTH_ERROR.INVALID_CREDENTIALS]: 401,
  [AUTH_ERROR.REGISTER_FAILED]: 400,
  [AUTH_ERROR.FORGOT_PASSWORD_FAILED]: 400,
  [AUTH_ERROR.AUTH_CLIENT_ERROR]: 400,
  [AUTH_ERROR.UPSTREAM_SERVICE_ERROR]: 502,
  [AUTH_ERROR.FIREBASE_AUTH_NOT_IMPLEMENTED]: 501,
  [AUTH_ERROR.PERMISSION_DENIED]: 403,
  [AUTH_ERROR.INSUFFICIENT_ROLE]: 403,
  [AUTH_ERROR.ACCOUNT_DEACTIVATED]: 403,
  [AUTH_ERROR.EMAIL_ALREADY_TAKEN]: 409,
  [AUTH_ERROR.USERNAME_ALREADY_TAKEN]: 409,
  [AUTH_ERROR.USER_PROFILE_NOT_FOUND]: 404,
  [AUTH_ERROR.USER_PROFILE_CREATE_FAILED]: 500,
  [AUTH_ERROR.USER_PROFILE_UPDATE_FAILED]: 500,
};

export function getAuthErrorCode(error: unknown): AuthErrorCode | null {
  if (error instanceof AuthError) {
    return error.code;
  }

  if (error instanceof Error) {
    const value = error.message;

    if (Object.values(AUTH_ERROR).includes(value as AuthErrorCode)) {
      return value as AuthErrorCode;
    }
  }

  return null;
}

export function getStatusForAuthError(error: unknown): number {
  const code = getAuthErrorCode(error);

  if (!code) {
    return 500;
  }

  return authErrorStatusMap[code];
}
