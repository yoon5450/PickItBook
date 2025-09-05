// ✅ 프록시 경로는 그대로 사용
const LIB_PROXY_BASE = "/api/data4library";

import type { age, gender } from "@/@types/global";

export const sessionStorageKey = "id";

// 실제 외부 경로는 절대 쓰지 않음. 항상 내 도메인 기준 상대경로로 구성
const endpoints = {
  srchBooks: `${LIB_PROXY_BASE}/api/srchBooks`,
  srchDtlList: `${LIB_PROXY_BASE}/api/srchDtlList`,
  recommandList: `${LIB_PROXY_BASE}/api/recommandList`,
  loanItemSrch: `${LIB_PROXY_BASE}/api/loanItemSrch`,
} as const;

// 공통 유틸: 쿼리스트링 문자열을 만들어서 fetch에 바로 쓰기 쉽게 반환
function withQuery(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export function makeBookDetailURL(
  isbn13: string,
  opts?: { loaninfoYN?: "Y" | "N"; displayInfo?: "age" | "sex" | "region" }
) {
  return withQuery(`${LIB_PROXY_BASE}/api/srchDtlList`, {
    isbn13,
    loaninfoYN: opts?.loaninfoYN ?? "Y",
    displayInfo: opts?.displayInfo ?? "age",
    format: "json",
  });
}

export function makeRecommendURL(isbn13: string) {
  return withQuery(`${LIB_PROXY_BASE}/api/recommandList`, { isbn13, format: "json" });
}

export interface PopularBookSearchFields {
  startDt?: string;
  gender?: gender;
  age?: age;
  kdc?: number;
  dtl_kdc?: number;
}

export function makePopularBookSearchUrl(searchParams: PopularBookSearchFields) {
  const params: Record<string, string> = { format: "json", pageNo: "1", pageSize: "200" };
  for (const [k, v] of Object.entries(searchParams)) {
    if (v == null || v === "") continue;
    params[k] = String(v).trim();
  }
  return withQuery(`${LIB_PROXY_BASE}/api/loanItemSrch`, params);
}
