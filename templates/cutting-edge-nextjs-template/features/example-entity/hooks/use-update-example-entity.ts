"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateExampleEntity } from "@/features/example-entity/api";

export function useUpdateExampleEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExampleEntity,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["example-entities"] });
      await queryClient.invalidateQueries({
        queryKey: ["example-entity", variables.id],
      });
    },
  });
}
