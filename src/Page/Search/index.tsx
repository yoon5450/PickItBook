import { useSearchParams } from "react-router";
import BookList from "./Component/BookList";
import SearchForm from "./Component/SearchForm";
import { useEffect, useMemo } from "react";
import loaderIcon from "@/assets/loading.svg";
import { useBookFetching } from "@/api/searchBook";
import { normalizeSearchFields } from "@/utils/normalizeSearchParams";
import type { SearchKey } from "@/@types/global";
import tw from "@/utils/tw";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = (searchParams.get("keyword") ?? "").trim();
  const title = (searchParams.get("title") ?? "").trim();
  const author = (searchParams.get("author") ?? "").trim();

  const handleSearch = ({ key, value }: { key: SearchKey; value: string }) => {
    const v = value.trim();
    const sp = new URLSearchParams(searchParams);

    // 단일 키 검색이라면, 다른 검색 키는 지워서 AND를 피함
    ["keyword", "title", "author", "isbn13", "publisher"].forEach((k) =>
      sp.delete(k)
    );

    if (v) sp.set(key, v);
    sp.set("page", "1");
    setSearchParams(sp);
  };

  const renderPageAnchors = (cur: number) => {
    const anchors = [];
    for (let i = -2; i <= 2; i++) {
      const pageNum = cur + i;
      if (cur > 0 && cur < totalPages) {
        anchors.push(
          <a
            className={tw("cursor-pointer", i === 0 && "font-semibold")}
            key={"anchor" + cur}
            onClick={() => movePage(pageNum)}
          >
            {pageNum}
          </a>
        );
      }
    }
    return anchors;
  };

  const page = useMemo(() => {
    const n = Number(searchParams.get("page") ?? 1);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [searchParams]);

  const movePage = (next: number) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(Math.max(1, next)));
    setSearchParams(sp);
  };

  const { data, isFetching } = useBookFetching(
    normalizeSearchFields({ keyword, title, author }),
    page
  );

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
        onSearch={handleSearch}
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
          {renderPageAnchors(page)}
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
