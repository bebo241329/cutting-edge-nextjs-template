import { NextResponse } from "next/server";

import { getStatusForAuthError } from "@/lib/auth/errors";
import { createAuthProvider } from "@/lib/auth/factory";
import { clearSessionCookie, getSessionTokenFromCookie } from "@/lib/auth/session";

export async function GET() {
  try {
    const token = await getSessionTokenFromCookie();

    if (!token) {
      return NextResponse.json({ session: null }, { status: 401 });
    }

    const provider = createAuthProvider();
    const session = await provider.getSession(token);

    if (!session) {
      await clearSessionCookie();
      return NextResponse.json({ session: null }, { status: 401 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    const status = getStatusForAuthError(error);

    if (status === 401 || status === 403) {
      await clearSessionCookie();
      return NextResponse.json({ session: null }, { status: 401 });
    }

    return NextResponse.json({ error: "auth_failed" }, { status });
  }
}
