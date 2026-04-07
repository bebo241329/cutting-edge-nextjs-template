"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExampleEntity } from "@/features/example-entity/api";

export function useCreateExampleEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExampleEntity,
    onSuccess: async (createdEntity) => {
      await queryClient.invalidateQueries({ queryKey: ["example-entities"] });
      await queryClient.invalidateQueries({
        queryKey: ["example-entity", createdEntity.id],
      });
    },
  });
}
