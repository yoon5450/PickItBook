import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { missionsRepo } from "./missions.repo.supabase";
import type { MissionItemType } from "@/@types/global";
import { logicRpcRepo } from "./logicRpc.repo.supabase";

type UseMissionsFetchingOptions = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
};

// ISBN 기반한 미션 목록을 받아옵니다.
// 추가 포함 데이터 : assigned - 이 미션을 수락했는지, bundle_id - 미션의 번들 id
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

// 해당 isbn에 대한 미션들을 로그인한 유저에게 수락 처리합니다.
export const useAssignMissions = (
  isbn13: string | undefined,
  options?: UseMutationOptions<unknown, Error, void>
) => {
  return useMutation({
    mutationKey: ["missionAssign", isbn13],
    mutationFn: async () => {
      if (!isbn13) throw new Error("isbn13 is required");
      return await logicRpcRepo.setBundle(isbn13);
    },
    retry: 0,
    ...options
  });
};
