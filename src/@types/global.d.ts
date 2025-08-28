// 글로벌로 정의된 타입들을 저장하는 장소입니다. db구조 등
export type BookItemType = {
    bookname: string;
    authors: string;
    publisher: string;
    publication_year: string;
    isbn13: string;
    addition_symbol: string;
    vol: string;
    class_no: string;
    class_nm: string;
    bookImageURL: string;
    bookDtlUrl: string;
    loan_count: string;
};

export type BookDocRaw = { doc: BookItemType };
export type BookSearchRaw = { response?: { docs?: BookDocRaw[] } };
export type SearchKey = "keyword" | "title" | "author" | "isbn13" | "publisher";

import type { BookItemType } from "@/@types/global";

// 공용 유틸 타입
type OneOrMany<T> = T | T[];
type Maybe<T> = T | null | undefined;

// 원시 필드들
export type LoanCountRaw = { ranking?: string | number; name?: string; loanCnt?: string | number };
export type AgeRaw = { ranking?: string | number; name?: string; loanCnt?: string | number };

export type DetailNodeRaw = {
  book?: OneOrMany<
    BookItemType & { description?: string; publication_date?: string; isbn?: string }
  > | null;
};

export type LoanInfoNodeRaw =
  | { Total?: LoanCountRaw | null }
  | { ageResult?: OneOrMany<{ age?: OneOrMany<AgeRaw> | null } | null> | null };

export type BookDetailRaw = {
  response?: {
    request?: {
      isbn13?: string;
      loaninfoYN?: "Y" | "N";
      displayInfo?: string;
    };
    detail?: OneOrMany<DetailNodeRaw> | null;
    loanInfo?: OneOrMany<LoanInfoNodeRaw> | null;
  };
  errMsg?: string;
};

export type LoanTotal = { ranking: number; name: string; loanCnt: number };
export type LoanAge   = { ranking: number; name: string; loanCnt: number };

export type BookDetailData = {
  book: (BookItemType & { description?: string; publication_date?: string; isbn?: string }) | null;
  loan: { total: LoanTotal | null; byAge: LoanAge[] };
  meta: { isbn13?: string; displayInfo?: string };
};

interface MissionItemType {
  missionType: string;
  missionTitle: string;
  score: number;
  userArchiveRate: number;
  isComplete: boolean;
}