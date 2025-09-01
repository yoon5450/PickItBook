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

export interface BookDetailMain {
  response: BookDetailResponse;
  errMsg?: string;
}

export interface BookDetailResponse {
  request: Request;
  detail: Detail[];
  loanInfo: LoanInfo[];
}

export interface Detail {
  book: Book;
}

export interface Book {
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
}

export interface LoanInfo {
  Total?: Total;
  ageResult?: AgeResult[];
}

export interface Total {
  ranking: number;
  name: string;
  loanCnt: number;
}

export interface AgeResult {
  age: Total;
}

export interface Request {
  isbn13: string;
  loaninfoYN: string;
  displayInfo: string;
}

interface MissionItemType {
  missionType: string;
  missionTitle: string;
  score: number;
  userArchiveRate: number;
  isComplete: boolean;
}

export interface ReviewItemType {
  id: number;
  create_at: string;
  isbn13: string;
  user_id: string;
  title: string;
  content: string;
  score: number;
  image_url?: string;
  like_count: number,
  nickname: string,
  profile_image: string,
  liked_by_me: boolean
}

