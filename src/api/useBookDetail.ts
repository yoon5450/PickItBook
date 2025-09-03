import { makeBookDetailURL } from "@/constant/constant";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher";
import { ensureArray } from "@/utils/ensureArray";

export type BookDetailRaw = {
  response?: {
    request: {
      isbn13: string;
      loaninfoYN: string;
      displayInfo: string;
    };
    detail:
    | {
      book: {
        no: number;
        bookname: string;
        authors: string;
        publisher: string;
        publication_date: string;
        publication_year: string;
        isbn: string;
        isbn13: string;
        addition_symbol: string;
        vol: string;
        class_no: string;
        class_nm: string;
        description: string;
        bookImageURL: string;
      };
    }[]
    | null;
    loanInfo:
    | (
      | {
        Total: {
          ranking?: number;
          name?: string;
          loanCnt?: number;
        };
        ageResult?: undefined;
      }
      | {
        ageResult: {
          age: {
            ranking?: number;
            name?: string;
            loanCnt?: number;
          };
        }[];
        Total?: undefined;
      }
    )[]
    | null;
  };
  errMsg?: string;
};

export type LoanTotal = { ranking?: number; name?: string; loanCnt?: number };
export type LoanAge = { ranking?: number; name?: string; loanCnt?: number };

export type BookDetailData = {
  book: {
    no: number;
    bookname: string;
    authors: string;
    publisher: string;
    publication_date: string;
    publication_year: string;
    isbn: string;
    isbn13: string;
    addition_symbol: string;
    vol: string;
    class_no: string;
    class_nm: string;
    description: string;
    bookImageURL: string;
  };
  loan: {
    total: {
      ranking?: number;
      name?: string;
      loanCnt?: number;
    };
    ageResult:
    {
      ranking?: number;
      name?: string;
      loanCnt?: number;
    }[];
  };
  meta: {
    isbn13: string;
    displayInfo: string;
  };
};

// isbn에 기반한 유저 디테일 데이터를 가져옵니다.
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
        }),
        { signal }
      ),
    enabled,
    // placeholderData: (prev) => prev, 필요 없어 보이는데
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 0,
    select: (raw): BookDetailData => {
      if (!raw.response) {
        throw new Error(raw?.errMsg || "useBookDetail 오류");
      }

      const { request: meta, detail, loanInfo } = raw.response;

      const book = detail?.[0]?.book;
      if (!book) throw new Error("책 정보가 없습니다.");

      const total = loanInfo?.find(
        (x): x is { Total: LoanTotal } => "Total" in x
      )?.Total ?? {};

      const ageData = loanInfo?.find(
        (x): x is { ageResult: { age: LoanAge }[] } => "ageResult" in x
      )?.ageResult;

      const ageResult = ensureArray(ageData).map((item) => item.age)

      // 안 오는 애들이 있는데? 예외사항이 있는듯?
      if (!total || !ageResult) {
        console.log("제공되지 않는 통계");
      }

      return {
        book,
        loan: {
          total,
          ageResult,
        },
        meta: {
          isbn13: meta.isbn13,
          displayInfo: meta.displayInfo,
        },
      };
    },
  });
}