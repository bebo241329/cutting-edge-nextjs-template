"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExampleEntity } from "@/features/example-entity/api";

export function useDeleteExampleEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExampleEntity,
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: ["example-entities"] });
      await queryClient.invalidateQueries({ queryKey: ["example-entity", id] });
    },
  });
}
