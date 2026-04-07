"use client";

import { useQuery } from "@tanstack/react-query";

import { listExampleEntities } from "@/features/example-entity/api";

export function useExampleEntities() {
  return useQuery({
    queryKey: ["example-entities"],
    queryFn: listExampleEntities,
  });
}
