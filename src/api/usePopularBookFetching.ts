import { makePopularBookSearchUrl, type PopularBookSearchFields } from "@/constant/constant";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher";
import type { PopularBookItem, RawDoc } from "@/@types/global";

type UseBookFetchingOptions = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
};

export const usePopularBookFetching = (
  { startDt = '2025-01-01', ...rest }: PopularBookSearchFields,
  {
    enabled = true,
    staleTime = 5 * 60_000, // 5분
    gcTime = 30 * 60_000, // 30분
    refetchOnWindowFocus = false,
    retry = 0,
  }: UseBookFetchingOptions = {}
) => {
  const searchParams = { startDt, ...rest }
  return useQuery({
    queryKey: ['popularBooks', searchParams],
    queryFn: ({ signal }) => fetcher(makePopularBookSearchUrl(searchParams), { signal }),
    placeholderData: keepPreviousData,
    staleTime,
    enabled,
    gcTime,
    refetchOnWindowFocus,
    retry,
    select: (raw) => {
      if (!raw?.response?.docs) {
        throw new Error(raw?.errMsg || "인기 도서가 없습니다");
      }

      const books: PopularBookItem[] = raw.response.docs.map(({ doc }: { doc: RawDoc }) => ({
        ...doc,
        ranking: Number(doc.ranking),
        loan_count: Number(doc.loan_count),
      }))

      return {
        books
      }
    }
  })
}