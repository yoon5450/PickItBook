// 세션스토리지, 로컬스토리지 키, url 등을 보관하는 공간입니다.

import type { age, gender } from "@/@types/global";

export const sessionStorageKey = "id";

export const libSearchUrl = "https://data4library.kr/api/srchBooks";

const LIBRARY_API_KEY = import.meta.env.VITE_LIBRARY_API_KEY;

export type SearchFields = Partial<Record<"keyword" | "title" | "author", string>>;

export const makeSearchURL = (searchParams: SearchFields, pageNo: number | string = 1, pageSize: number | string = 20) => {
  const url = new URL(libSearchUrl);
  const sp = new URLSearchParams({
    authKey: LIBRARY_API_KEY,
    pageNo: typeof pageNo === "number" ? pageNo.toString() : pageNo,
    pageSize: typeof pageSize === "number" ? pageSize.toString() : pageSize,
    exactMatch: "true",
    format: "json",
  })

  for (const [k, v] of Object.entries(searchParams)) {
    const val = v?.trim();
    if (val) sp.set(k, val);
  }

  url.search = sp.toString();

  return url;
};

export const bookInfoURL = `http://data4library.kr/api/srchDtlList`

export function makeBookDetailURL(
  isbn13: string,
  opts?: { loaninfoYN?: "Y" | "N"; displayInfo?: "age" | "sex" | "region" }
): URL {
  const url = new URL(bookInfoURL);
  const sp = new URLSearchParams({
    authKey: LIBRARY_API_KEY,
    isbn13,
    loaninfoYN: opts?.loaninfoYN ?? "Y",
    displayInfo: opts?.displayInfo ?? "age",
    format: "json",
  });
  url.search = sp.toString();
  return url;
}

export const popularBookSearchURL = `http://data4library.kr/api/loanItemSrch`;

export interface PopularBookSearchFields {
  startDt?: string;
  gender?: gender;
  age?: age;
  kdc?: number;
  dtl_kdc?: number;
}

export const makePopularBookSearchUrl = (searchParams: PopularBookSearchFields): URL => {
  const url = new URL(popularBookSearchURL);
  const sp = new URLSearchParams({
    authKey: LIBRARY_API_KEY,
    format: "json",
    pageNo: '1',
    pageSize: '200',
  })

  for (const [k, v] of Object.entries(searchParams)) {
    if (v == null || v === '') continue;
    if (typeof v === 'number') sp.set(k, String(v));
    if (typeof v === 'string') {
      const val = v?.trim();
      sp.set(k, val);
    }
  }

  url.search = sp.toString();

  return url
}

