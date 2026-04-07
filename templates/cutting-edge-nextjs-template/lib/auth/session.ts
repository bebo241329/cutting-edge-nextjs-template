import { cookies } from "next/headers";

import { isProductionEnvironment, serverEnv } from "../env/server";

export function getSessionCookieName() {
  return serverEnv.AUTH_COOKIE_NAME;
}

export async function getSessionTokenFromCookie() {
  const jar = await cookies();
  return jar.get(getSessionCookieName())?.value;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();

  jar.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProductionEnvironment,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();

  jar.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}
