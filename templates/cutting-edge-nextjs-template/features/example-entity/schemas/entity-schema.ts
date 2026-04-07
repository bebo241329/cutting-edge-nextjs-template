import { z } from "zod";

export const exampleEntitySchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
});

export type ExampleEntitySchema = z.infer<typeof exampleEntitySchema>;
