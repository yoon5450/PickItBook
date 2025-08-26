import { useSearchParams } from "react-router";
import BookList from "./Component/BookList";
import SearchForm from "./Component/SearchForm";
import { useMemo } from "react";
import { makeSearchURL } from "@/constant/constant";
import { useQuery } from "@tanstack/react-query";
import type { BookItemType } from "@/@types/global";
import { fetcher } from "@/api/fetcher";
import loaderIcon from "@/assets/loading.svg";
import { useBookFetching } from "@/api/searchBook";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = (searchParams.get("keyword") ?? "").trim();

  const page = useMemo(() => {
    const n = Number(searchParams.get("page") ?? 1);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [searchParams]);

  const movePage = (next: number) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(Math.max(1, next)));
    setSearchParams(sp);
  };

  // queryKey : 중복 호출 방지를 위한 쿼리키
  // queryFn : 쿼리 함수
  // enabled : 키워드가 없다면 호출 x
  // placeholderData : 다음 데이터 불러오기 전까지 지정할 데이터
  // staleTime : 같은 요청에 대해서 어떻게 지정할지
  // abortingsignal 관련 공부
  const { data, isFetching } = useQuery({
    queryKey: ["books", keyword, page],
    queryFn: ({ signal }) =>
      fetcher(makeSearchURL(keyword, page).href, { signal }),
    enabled: !!keyword,
    placeholderData: (prev) => prev,
    select: (raw) =>
      raw.response.docs.map((item: { doc: BookItemType }) => item.doc),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  useBookFetching("히가시노", 1)

  return (
    <div className="flex flex-col  items-center min-h-screen w-[1200px] bg-background-white">
      <SearchForm
        key={keyword}
        initialValue={keyword}
        onSearch={(v: string) => setSearchParams({ keyword: v, page: "1" })}
      />

      {isFetching ? (
        <img
          className="h-25 text-center p-1 inline"
          src={loaderIcon}
          alt="로딩중"
        />
      ) : null}
      <BookList bookList={data} className="w-full"/>

      <nav className="mt-4">
        <button onClick={() => movePage(page - 1)} disabled={page <= 1}>
          이전
        </button>
        <span className="mx-2">{page}</span>
        <button onClick={() => movePage(page + 1)} disabled={page >= 2}>다음</button>
      </nav>
    </div>
  );
}

export default Search;
