import { NextResponse } from "next/server";
import { z } from "zod";

import { getHttpStatusForError, isExampleEntityError } from "@/lib/example-entity/errors";
import { createExampleEntityProvider } from "@/lib/example-entity/factory";

const requestSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
});

export async function GET() {
  try {
    const provider = createExampleEntityProvider();
    const entities = await provider.list();

    return NextResponse.json(entities);
  } catch (error) {
    if (isExampleEntityError(error)) {
      return NextResponse.json(
        { error: error.code },
        { status: getHttpStatusForError(error) },
      );
    }

    return NextResponse.json({ error: "example_entity_request_failed" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const payload = requestSchema.safeParse(parsedBody);

  if (!payload.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const provider = createExampleEntityProvider();
    const entity = await provider.create(payload.data);

    return NextResponse.json(entity, { status: 201 });
  } catch (error) {
    if (isExampleEntityError(error)) {
      return NextResponse.json(
        { error: error.code },
        { status: getHttpStatusForError(error) },
      );
    }

    return NextResponse.json({ error: "example_entity_request_failed" }, { status: 502 });
  }
}
