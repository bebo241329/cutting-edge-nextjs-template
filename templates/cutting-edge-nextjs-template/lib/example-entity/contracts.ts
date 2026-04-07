import type { ExampleEntity, ExampleEntityInput } from "./types";

export interface ExampleEntityProvider {
  kind: "rest" | "firebase";
  list(): Promise<ExampleEntity[]>;
  get(id: string): Promise<ExampleEntity | null>;
  create(input: ExampleEntityInput): Promise<ExampleEntity>;
  update(id: string, input: ExampleEntityInput): Promise<ExampleEntity>;
  remove(id: string): Promise<{ ok: true }>;
}
