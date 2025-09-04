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
  template_id: number;
  code: string;
  name: string;
  description: string;
  reward: {
    type: string;
    amount: number;
  };
  progress: null;
  completed: boolean;
  completed_at: null;
  assigned: boolean;
  bundle_id: number;
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
  like_count: number;
  nickname: string;
  profile_image: string;
  liked_by_me: boolean;
}


// 1) 이벤트 타입
export type EventType =
  | "REVIEW_CREATED"
  | "SUMMARY_CREATED"
  | "QUOTE_CREATED"
  | "REVIEW_LIKED"
  | "BOOKMARK_ADDED"
  | "MISSION_COMPLETED";

export type BookEventType =
  | "REVIEW_CREATED"
  | "SUMMARY_CREATED"
  | "QUOTE_CREATED"
  | "REVIEW_LIKED";

export type GlobalEventType = "BOOKMARK_ADDED" | "MISSION_COMPLETED";

// 2) 페이로드 맵
export type EventPayloadMap = {
  REVIEW_CREATED: { book_id: string; review_id: string };
  SUMMARY_CREATED: { book_id: string; summary_id: string };
  QUOTE_CREATED: { book_id: string; quote_id: string };
  REVIEW_LIKED: { book_id: string; like_id: string };
  BOOKMARK_ADDED: { bookmark_id: string };
  MISSION_COMPLETED: { mission_id: string | number };
};

// 3)
export type EventEnvelope<T extends EventType = EventType> = {
  type: T;
  payload: EventPayloadMap[T];
  idempotencyKey?: string;
};



// 0:남성 1:여성 2:미상
export type gender = 0 | 1 | 2

// 0:영유아 6:유아 8:초등 14:청소년 20:20대 30:30대 40:40대 50:50대 60:60대 이상 -1:미상 
export type age = 0 | 6 | 8 | 14 | 20 | 30 | 40 | 50 | 60 | -1

export interface RawDoc {
  no: number;
  ranking: string;
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
}

export interface PopularBooksRaw {
  response?: {
    request?: Record<string, unknown>;
    resultNum?: number;
    numFound?: number;
    docs?: Array<{ doc: RawDoc }>;
  };
  errMsg?: string;
}

export interface PopularBookItem extends Omit<RawDoc, 'ranking' | 'loan_count'> {
  ranking: number;
  loan_count: number;
}

export interface BookmarkItem {
  book_id: number | null;
  created_at: string;
  id: number;
  isbn13: string;
  user_id: string;
}

export interface TemplateItem {
  active: boolean | null;
  code: string;
  description: string | null;
  id: number;
  kind: "mission" | "achievement";
  name: string;
  reward: Json;
  rule: Json;
  scope: "book" | "global";
  valid_from: string | null;
  valid_to: string | null;
  version: number | null;
  weight: number | null;
}