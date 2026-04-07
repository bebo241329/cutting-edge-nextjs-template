import { NextResponse } from "next/server";

import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password-schema";
import { getAuthErrorCode, getStatusForAuthError } from "@/lib/auth/errors";
import { createAuthProvider } from "@/lib/auth/factory";

export async function POST(request: Request) {
  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const payload = forgotPasswordSchema.safeParse(parsedBody);

  if (!payload.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const provider = createAuthProvider();
    await provider.forgotPassword(payload.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = getAuthErrorCode(error);
    return NextResponse.json(
      { error: code ?? "auth_failed" },
      { status: getStatusForAuthError(error) },
    );
  }
}
