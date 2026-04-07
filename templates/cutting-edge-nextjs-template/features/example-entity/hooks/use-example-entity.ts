"use client";

import { useQuery } from "@tanstack/react-query";

import { getExampleEntity } from "@/features/example-entity/api";

export function useExampleEntity(id: string) {
  return useQuery({
    queryKey: ["example-entity", id],
    queryFn: () => getExampleEntity(id),
    enabled: id.length > 0,
  });
}
