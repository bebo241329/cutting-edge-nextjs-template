import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const connectFirestoreEmulator = vi.fn();const getFirestore = vi.fn(() => ({ __type: "firestore" }));
const getApps = vi.fn(() => []);
const getApp = vi.fn(() => ({ __type: "app" }));
const initializeApp = vi.fn(() => ({ __type: "app" }));

vi.mock("firebase/firestore", () => ({
  connectFirestoreEmulator,
  getFirestore,
}));

vi.mock("firebase/app", () => ({
  getApps,
  getApp,
  initializeApp,
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({ __type: "auth" })),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("firebase client emulator wiring", () => {
  it("uses emulator in non-production when enabled", async () => {
    vi.stubEnv("DATA_PROVIDER", "firebase");
    vi.stubEnv("AUTH_COOKIE_NAME", "dashboard_session");
    vi.stubEnv("FIREBASE_API_KEY", "firebase-api-key");
    vi.stubEnv("FIREBASE_AUTH_DOMAIN", "demo.firebaseapp.com");
    vi.stubEnv("FIREBASE_PROJECT_ID", "demo-project");
    vi.stubEnv("FIREBASE_APP_ID", "1:1234567890:web:abcdef");
    vi.stubEnv("USE_FIREBASE_EMULATOR", "true");
    vi.stubEnv("NODE_ENV", "test");

    const mod = await import("@/lib/firebase/client");
    mod.__resetFirebaseClientForTests();
    mod.getFirebaseFirestore();

    expect(connectFirestoreEmulator).toHaveBeenCalledWith(
      expect.any(Object),
      "127.0.0.1",
      8080,
    );
  });
});
