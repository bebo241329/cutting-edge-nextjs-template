import { NextResponse } from "next/server";

import { userProfileUpdateSchema } from "@/features/auth/schemas/user-profile-schema";
import { AUTH_ERROR, getAuthErrorCode, getStatusForAuthError } from "@/lib/auth/errors";
import { createAuthProvider } from "@/lib/auth/factory";
import { getSessionTokenFromCookie } from "@/lib/auth/session";

export async function GET() {
  try {
    const token = await getSessionTokenFromCookie();

    if (!token) {
      return NextResponse.json({ error: AUTH_ERROR.INVALID_CREDENTIALS }, { status: 401 });
    }

    const provider = createAuthProvider();
    const session = await provider.getSession(token);

    if (!session) {
      return NextResponse.json({ error: AUTH_ERROR.INVALID_CREDENTIALS }, { status: 401 });
    }

    const profile = await provider.getUserProfile(session.userId);

    if (!profile) {
      return NextResponse.json({ error: AUTH_ERROR.USER_PROFILE_NOT_FOUND }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthErrorCode(error) ?? "auth_failed" },
      { status: getStatusForAuthError(error) },
    );
  }
}

export async function PATCH(request: Request) {
  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const payload = userProfileUpdateSchema.safeParse(parsedBody);

  if (!payload.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const token = await getSessionTokenFromCookie();

    if (!token) {
      return NextResponse.json({ error: AUTH_ERROR.INVALID_CREDENTIALS }, { status: 401 });
    }

    const provider = createAuthProvider();
    const session = await provider.getSession(token);

    if (!session) {
      return NextResponse.json({ error: AUTH_ERROR.INVALID_CREDENTIALS }, { status: 401 });
    }

    const profile = await provider.updateUserProfile(session.userId, payload.data);

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthErrorCode(error) ?? "auth_failed" },
      { status: getStatusForAuthError(error) },
    );
  }
}
