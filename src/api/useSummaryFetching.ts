import type { FetchingOptions } from "@/@types/global";
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { summaryRepo, type SetSummaryType } from "./summary.repo.supabase";
import type { Tables } from "@/@types/database.types";
import { logicRpcRepo } from "./logicRpc.repo.supabase";

type SummaryType = Tables<"v_summary_with_author">;

export const useGetSummaryByIsbn = (
  isbn13: string | undefined,
  opts: FetchingOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = false,
  } = opts;

  return useQuery<SummaryType[]>({
    queryKey: ["getSummary", isbn13],
    queryFn: () => summaryRepo.getSummaryByIsbn(isbn13),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });
};

export const useSetSummary = (
  options?: UseMutationOptions<unknown, Error, SetSummaryType>
) => {
  return useMutation({
    mutationKey: ["setSummary"],
    mutationFn: async ({ summary, isbn13 }: SetSummaryType) => {
      const row = await summaryRepo.setSummary(summary, isbn13);
      logicRpcRepo.setProcessEvent("SUMMARY_CREATED", {
        book_id: isbn13,
        summary_id: String(row.id),
      });

      return row;
    },
    ...options,
  });
};
