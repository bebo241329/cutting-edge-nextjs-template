import { serverEnv } from "../env/server";

import type { ExampleEntityProvider } from "./contracts";
import { createFirebaseExampleEntityProvider } from "./providers/firebase";
import { createRestExampleEntityProvider } from "./providers/rest";

export function createExampleEntityProvider(): ExampleEntityProvider {
  return serverEnv.DATA_PROVIDER === "firebase"
    ? createFirebaseExampleEntityProvider()
    : createRestExampleEntityProvider();
}
