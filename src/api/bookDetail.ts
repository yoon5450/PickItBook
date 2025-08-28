import type { BookItemType } from "@/@types/global";
import { makeBookDetailURL } from "@/constant/constant";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher";

const toNum = (x?: string | number | null) => (x === null ? 0 : Number(x) || 0);
const ensureArray = <T,>(x: T | T[] | null | undefined): T[] =>
  Array.isArray(x) ? x : x ? [x] : [];


export type BookDetailRaw = {
  response?: {
    request?: {
      isbn13?: string;
      loaninfoYN?: "Y" | "N";
      displayInfo?: string;
    };
    detail?: {
      book?:
        | (BookItemType & {
            description?: string;
            publication_date?: string;
            isbn?: string;
          })[]
        | null;
    }[];
    loanInfo?: {
      Total?: {
        ranking?: string | number;
        name?: string;
        loanCnt?: string | number;
      } | null;
      ageResult?: {
        age?:
          | {
              ranking?: string | number;
              name?: string;
              loanCnt?: string | number;
            }
          | Array<{
              ranking?: string | number;
              name?: string;
              loanCnt?: string | number;
            }>
          | null;
      } | null;
    }[] | null;
  };
  errMsg?: string;
};

export type LoanTotal = { ranking: number; name: string; loanCnt: number };
export type LoanAge = { ranking: number; name: string; loanCnt: number };

export type BookDetailData = {
  book:
    | (BookItemType & {
        description?: string;
        publication_date?: string;
        isbn?: string;
      })
    | null;
  loan: {
    total: LoanTotal | null;
    byAge: LoanAge[];
  };
  meta: {
    isbn13?: string;
    displayInfo?: string;
  };
};

export function useBookDetail(
  isbn13: string | undefined,
  opts?: { displayInfo?: "age" | "sex" | "region"; loaninfoYN: "Y" | "N" }
) {
  const enabled = !!isbn13;

  return useQuery<BookDetailRaw, Error, BookDetailData>({
    queryKey: [
      "bookDetail",
      isbn13,
      opts?.displayInfo ?? "age",
      opts?.loaninfoYN,
    ],
    queryFn: ({ signal }) =>
      fetcher(
        makeBookDetailURL(isbn13!, {
          displayInfo: opts?.displayInfo,
          loaninfoYN: opts?.loaninfoYN,
        }).href,
        { signal }
      ),
    enabled,
    // placeholderData: (prev) => prev, 필요 없어 보이는데
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 0,
    select: (raw) => {
      if (!raw.response) {
        throw new Error(raw?.errMsg || "useBookDetail 오류");
      }

      const r = raw.response;
      console.log(r);
      const book = r.detail?.map((item) => item).find(Boolean)

      let total: LoanTotal | null = null;
      const t = r.loanInfo?.map(item => item) || null;
      console.log(t);
      if (t) {
        total = { ranking: toNum(t?[0]), name: t.name ?? "전체", loanCnt:toNum(t.loanCnt) };
      }

      const agesRaw = r.loanInfo?.ageResult?.age ?? null;
      const byAge: LoanAge[] = ensureArray(agesRaw).map((a) => ({
        ranking: toNum(a?.ranking),
        name:a.name ?? "",
        loanCnt: toNum(a.loanCnt),
      }));

      return {
        book,
        loan: {total, byAge},
        meta: {
          isbn13:r.request?.isbn13,
          displayInfo: r.request?.displayInfo,
        }
      }
    },
  });
}
