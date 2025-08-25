// 세션스토리지, 로컬스토리지 키, url 등을 보관하는 공간입니다.

export const sessionStorageKey = "id";

export const libSearchUrl = "https://data4library.kr/api/srchBooks";

const LIBRARY_API_KEY = import.meta.env.VITE_LIBRARY_API_KEY;


export const makeSearchURL = (keyword: string, pageNo: number | string = 1, pageSize:number | string = 10) => {
  const searchKeyword = keyword.trim();
  
  const url = new URL(libSearchUrl);
  url.search = new URLSearchParams({
    authKey: LIBRARY_API_KEY,
    keyword: searchKeyword,
    pageNo: typeof pageNo === "number" ? pageNo.toString() : pageNo,
    pageSize: typeof pageSize === "number" ? pageSize.toString() : pageSize,
    exactMatch:"true",
    format:"json"
  }).toString();

  return url;
};
