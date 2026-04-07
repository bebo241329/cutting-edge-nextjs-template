import type {
  ExampleEntity,
  ExampleEntityInput,
} from "@/lib/example-entity/types";

type ErrorResponse = {
  error?: string;
};

async function getErrorCode(response: Response) {
  try {
    const body = (await response.json()) as ErrorResponse;
    return body.error ?? "request_failed";
  } catch {
    return "request_failed";
  }
}

export async function listExampleEntities() {
  const res = await fetch("/api/example-entities", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await getErrorCode(res));
  }

  return (await res.json()) as ExampleEntity[];
}

export async function getExampleEntity(id: string) {
  const res = await fetch(`/api/example-entities/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(await getErrorCode(res));
  }

  return (await res.json()) as ExampleEntity;
}

export async function createExampleEntity(payload: ExampleEntityInput) {
  const res = await fetch("/api/example-entities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await getErrorCode(res));
  }

  return (await res.json()) as ExampleEntity;
}

export async function updateExampleEntity(params: {
  id: string;
  payload: ExampleEntityInput;
}) {
  const res = await fetch(`/api/example-entities/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params.payload),
  });

  if (!res.ok) {
    throw new Error(await getErrorCode(res));
  }

  return (await res.json()) as ExampleEntity;
}

export async function deleteExampleEntity(id: string) {
  const res = await fetch(`/api/example-entities/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await getErrorCode(res));
  }

  return (await res.json()) as { ok: true };
}
