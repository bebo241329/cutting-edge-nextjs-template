"use client";

import { useQuery } from "@tanstack/react-query";

import { getSession } from "@/features/auth/api";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
}
