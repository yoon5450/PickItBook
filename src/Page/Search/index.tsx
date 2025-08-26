import { useSearchParams } from "react-router";
import BookList from "./Component/BookList";
import SearchForm from "./Component/SearchForm";
import { useEffect, useMemo } from "react";
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

  const { data, isFetching } = useBookFetching(keyword, page);

  console.log(data.items);

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  const prevDisabled = isFetching || page <= 1;
  const nextDisabled = isFetching || page >= totalPages;

  useEffect(() => {
    if (data.total > 0) {
      const tp = Math.max(1, Math.ceil(data.total / data.pageSize));
      if (page > tp) {
        const sp = new URLSearchParams(searchParams);
        sp.set("page", String(tp));
        setSearchParams(sp, { replace: true }); // 히스토리 오염 방지
      }
    }
  }, [data.total, data.pageSize, page]);

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
      <BookList bookList={data.items} className="w-full" />

      <nav className="mt-4 flex items-center gap-2">
        <button onClick={() => movePage(page - 1)} disabled={prevDisabled}>
          이전
        </button>
        <span className="flex gap-2 text-center">
          <a className="cursor-pointer" onClick={() => movePage(page-2)}>{page- 2}</a> 
          <a onClick={() => movePage(page-1)}>{page- 1}</a> 
          <a onClick={() => movePage(page)}>{page}</a> 
          <a onClick={() => movePage(page+1)}>{page+1}</a> 
          <a onClick={() => movePage(page+2)}>{page+2}</a> 
        </span>
        <button onClick={() => movePage(page + 1)} disabled={nextDisabled}>
          다음
        </button>
        <span className="ml-2 text-sm text-gray-500">
          총 {data.total.toLocaleString()}권
        </span>
      </nav>
    </div>
  );
}

export default Search;
