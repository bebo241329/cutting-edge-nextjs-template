import type { AuthProvider } from "./contracts";
import { createFirebaseAuthProvider } from "./providers/firebase";
import { createRestAuthProvider } from "./providers/rest";
import { serverEnv } from "../env/server";

export function createAuthProvider(): AuthProvider {
  return serverEnv.DATA_PROVIDER === "firebase"
    ? createFirebaseAuthProvider()
    : createRestAuthProvider();
}
