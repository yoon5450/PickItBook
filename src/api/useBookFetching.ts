import {
  makeRecommendURL,
  makeSearchURL,
  type SearchFields,
} from "@/constant/constant";
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

// RawData 타입
type Raw = {
  response?: {
    request?: {
      title?: string;
      author?: string;
      keyword?: string;
      pageNo?: number | string;
      pageSize?: number | string;
    };
    numFound?: number | string;
    docs?: { doc: BookItemType }[];
  };
};

export const buildBooksKey = (
  searchParams: SearchFields,
  page: number
): QueryKey => ["books", searchParams, page] as const;

type UseBookFetchingOptions = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
};

export const useBookFetching = (
  searchParams: SearchFields,
  page: number,
  opts: UseBookFetchingOptions = {}
) => {
  const {
    enabled = !!searchParams,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = false,
  } = opts;

  // queryKey : 중복 호출 방지를 위한 쿼리키
  // queryFn : 쿼리 함수
  // enabled : 키워드가 없다면 호출 x
  // placeholderData : 다음 데이터 불러오기 전까지 지정할 데이터
  // staleTime : 같은 요청에 대해서 어떻게 지정할지
  // abortingsignal 관련 공부
  // refetchOnWindowFocus : refocus시에 재호출하지 않음.
  const query = useQuery<Raw, Error, BooksData>({
    queryKey: ["books", searchParams, page],
    queryFn: ({ signal }) =>
      fetcher(makeSearchURL(searchParams, page), { signal }),
    placeholderData: (prev) => prev, // v5에서 keepPreviousData 역할
    enabled,
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

// Recommend 타입 정의
export interface RecommendMain {
  response: Response;
}

export interface Response {
  request: { isbn: string; pageNo: string };
  resultNum: number;
  docs: Doc[];
}

export interface Doc {
  book: BookItemType;
}

export interface RecommendData {
  items: BookItemType[];
  pageNo: number;
}

export const useGetRecommend = (
  isbn13: string,
  opts: UseBookFetchingOptions = {}
) => {
  const {
    enabled = !!isbn13,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = false,
  } = opts;

  return useQuery<RecommendMain, Error, RecommendData>({
    queryKey: ["recommend", isbn13],
    queryFn: ({ signal }) =>
      fetcher(makeRecommendURL(isbn13).href, { signal }),
    select: (raw) => {
      const r = raw.response ?? {};
      const req = r.request;
      const items = (r.docs ?? []).map((item) => item.book);
      const pageNo = Number(req.pageNo);

      return { items, pageNo };
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });
};
