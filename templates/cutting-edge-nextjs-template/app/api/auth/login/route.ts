import { NextResponse } from "next/server";

import { loginSchema } from "@/features/auth/schemas/login-schema";
import { AUTH_ERROR, getAuthErrorCode, getStatusForAuthError } from "@/lib/auth/errors";
import { createAuthProvider } from "@/lib/auth/factory";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const payload = loginSchema.safeParse(parsedBody);

  if (!payload.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const provider = createAuthProvider();
    const result = await provider.login(payload.data);

    await setSessionCookie(result.sessionToken);

    return NextResponse.json({ session: result.session });
  } catch (error) {
    const code = getAuthErrorCode(error);

    if (code === AUTH_ERROR.AUTH_CLIENT_ERROR) {
      return NextResponse.json(
        { error: AUTH_ERROR.INVALID_CREDENTIALS },
        { status: 401 },
      );
    }

    if (code === AUTH_ERROR.ACCOUNT_DEACTIVATED) {
      return NextResponse.json(
        { error: AUTH_ERROR.ACCOUNT_DEACTIVATED },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: code ?? "auth_failed" },
      { status: getStatusForAuthError(error) },
    );
  }
}
