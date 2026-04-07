import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

import { serverEnv } from "@/lib/env/server";

const FIREBASE_EMULATOR_HOST = "127.0.0.1";
const FIRESTORE_EMULATOR_PORT = 8080;
const AUTH_EMULATOR_PORT = 9099;
let didConnectFirestoreEmulator = false;
let didConnectAuthEmulator = false;

function shouldUseFirestoreEmulator() {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return serverEnv.USE_FIREBASE_EMULATOR !== "false";
}

function ensureFirestoreEmulatorConnected(firestore: Firestore) {
  if (!shouldUseFirestoreEmulator() || didConnectFirestoreEmulator) {
    return;
  }

  connectFirestoreEmulator(
    firestore,
    FIREBASE_EMULATOR_HOST,
    FIRESTORE_EMULATOR_PORT,
  );
  didConnectFirestoreEmulator = true;
}

function ensureAuthEmulatorConnected(auth: Auth) {
  if (!shouldUseFirestoreEmulator() || didConnectAuthEmulator) {
    return;
  }

  connectAuthEmulator(
    auth,
    `http://${FIREBASE_EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`,
    {
      disableWarnings: true,
    },
  );
  didConnectAuthEmulator = true;
}

export function __resetFirebaseClientForTests() {
  cachedApp = null;
  cachedAuth = null;
  cachedFirestore = null;
  didConnectFirestoreEmulator = false;
  didConnectAuthEmulator = false;
}

export function __shouldUseFirestoreEmulatorForTests() {
  return shouldUseFirestoreEmulator();
}

export const __FIRESTORE_EMULATOR_CONFIG_FOR_TESTS = {
  host: FIREBASE_EMULATOR_HOST,
  port: FIRESTORE_EMULATOR_PORT,
};

const firebaseConfig = {
  apiKey: serverEnv.FIREBASE_API_KEY,
  authDomain: serverEnv.FIREBASE_AUTH_DOMAIN,
  projectId: serverEnv.FIREBASE_PROJECT_ID,
  appId: serverEnv.FIREBASE_APP_ID,
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedFirestore: Firestore | null = null;

export function getFirebaseApp() {
  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

export function getFirebaseAuth() {
  if (cachedAuth) {
    return cachedAuth;
  }

  cachedAuth = getAuth(getFirebaseApp());
  ensureAuthEmulatorConnected(cachedAuth);
  return cachedAuth;
}

export function getFirebaseFirestore() {
  if (cachedFirestore) {
    return cachedFirestore;
  }

  cachedFirestore = getFirestore(getFirebaseApp());
  ensureFirestoreEmulatorConnected(cachedFirestore);
  return cachedFirestore;
}
