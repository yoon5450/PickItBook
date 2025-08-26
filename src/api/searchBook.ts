import { makeSearchURL } from "@/constant/constant";
import { fetcher } from "./fetcher";
import type { BookItemType } from "@/@types/global";
import { useQuery, type QueryKey } from "@tanstack/react-query";

type BooksData = {
  items: BookItemType[];
  total: number;
  pageSize: number;
  page: number;
};

const EMPTY: BooksData = { items: [], total: 0, pageSize: 10, page: 1 };


type Raw = {
  response?: {
    request?: { keyword?: string; pageNo?: number | string; pageSize?: number | string };
    numFound?: number | string;
    docs?: { doc: BookItemType }[];
  };
};


export const buildBooksKey = (keyword: string, page: number): QueryKey =>
  ["books", keyword, page] as const;

type UseBookFetchingOptions = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
};

export const useBookFetching = (
  keyword: string,
  page: number,
  opts: UseBookFetchingOptions = {}
) => {
  const {
    enabled = !!keyword,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = true,
  } = opts;

  const query = useQuery<Raw, Error, BookItemType[]>({
    queryKey: ["books", keyword, page],
    queryFn: ({ signal }) =>
      fetcher(makeSearchURL(keyword, page).href, { signal }),
    enabled,
    placeholderData: (prev) => prev,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    select: (raw) => {
      const r = raw.response ?? {};
      const req = r.request ?? {};
      const items = (r.docs ?? []).map((i) => i.doc);
      const total = Number(r.numFound ?? 0);
      const pageSize = Number(req.pageSize ?? 10) || 10;
      const pg = Number(req.pageNo ?? page) || page;
      return { items, total, pageSize, page: pg };
    },
  });

  return {
    ...query,
    data: query.data ?? EMPTY,
  };
};
