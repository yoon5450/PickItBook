import { useMutation, useQuery } from "@tanstack/react-query";
import { missionsRepo } from "./missions.repo.supabase";
import type { MissionItemType } from "@/@types/global";
import { logicRpcRepo } from "./logicRpc.repo.supabase";

type UseMissionsFetchingOptions = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
};

export const useGetMissionByISBN = (
  isbn13: string,
  opts: UseMissionsFetchingOptions = {}
) => {
  const {
    enabled = !!isbn13,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = false,
  } = opts;

  return useQuery<MissionItemType[]>({
    queryKey: ["missions", "book", isbn13],
    queryFn: () => missionsRepo.getMissionsByISBN(isbn13),
    refetchOnWindowFocus,
    enabled,
    staleTime,
    gcTime,
  });
};

export const useApplyMissions = (isbn13: string | undefined) => {
  return useMutation({
    mutationKey: ["bookmark", isbn13],
    mutationFn: async (isbn13: string) => {
      return await logicRpcRepo.setBundle(isbn13);
    },
    retry: 0,
  });
};
