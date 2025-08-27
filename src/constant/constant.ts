// 세션스토리지, 로컬스토리지 키, url 등을 보관하는 공간입니다.

export const sessionStorageKey = "id";

export const libSearchUrl = "https://data4library.kr/api/srchBooks";

const LIBRARY_API_KEY = import.meta.env.VITE_LIBRARY_API_KEY;

export type SearchFields = Partial<Record<"keyword" | "title" | "author", string>>;

export const makeSearchURL = (searchParams:SearchFields, pageNo: number | string = 1, pageSize:number | string = 20) => {  
  const url = new URL(libSearchUrl);
  const sp = new URLSearchParams({
    authKey: LIBRARY_API_KEY,
    pageNo: typeof pageNo === "number" ? pageNo.toString() : pageNo,
    pageSize: typeof pageSize === "number" ? pageSize.toString() : pageSize,
    exactMatch:"true",
    format:"json",
  })

  for (const [k, v] of Object.entries(searchParams)) {
    const val = v?.trim();
    if (val) sp.set(k, val);
  }

  url.search = sp.toString();

  return url;
};


