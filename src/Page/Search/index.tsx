import { useSearchParams } from "react-router";
import BookList from "./Component/BookList";
import SearchForm from "./Component/SearchForm";
import { useEffect, useMemo, useState } from "react";
import loaderIcon from "@/assets/loading.svg";
import { useBookFetching } from "@/api/useBookFetching";
import { normalizeSearchFields } from "@/utils/normalizeSearchParams";
import type { SearchKey } from "@/@types/global";
import tw from "@/utils/tw";
import { scrollTop } from "@/utils/scrollFunctions";
import PopularKeywords from "./Component/PopularKeywords";
import { RxHamburgerMenu, RxGrid } from "react-icons/rx";
import { useGetReviewsScore } from "@/api/useReviewFetching";

export type listMode = "line" | "grid";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listMode, setListMode] = useState<listMode>("line");

  // search Params 관리
  const keyword = (searchParams.get("keyword") ?? "").trim();
  const title = (searchParams.get("title") ?? "").trim();
  const author = (searchParams.get("author") ?? "").trim();

  // search callback
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

  // 페이지 목록 렌더링
  const renderPageAnchors = (cur: number) => {
    const anchors = [];
    for (let i = -2; i <= 2; i++) {
      const pageNum = cur + i;
      if (pageNum > 0 && pageNum <= totalPages) {
        anchors.push(
          <a
            className={tw("cursor-pointer", i === 0 && "font-semibold")}
            key={"anchor" + pageNum}
            onClick={() => movePage(pageNum)}
          >
            {pageNum}
          </a>
        );
      }
    }
    return anchors;
  };

  // 페이지 이동
  const movePage = (next: number) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(Math.max(1, next)));
    setSearchParams(sp);
    scrollTop();
  };

  const page = useMemo(() => {
    const n = Number(searchParams.get("page") ?? 1);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [searchParams]);

  // 목록 fetching
  const { data, isFetching } = useBookFetching(
    normalizeSearchFields({ keyword, title, author }),
    page
  );

  const isbns = data?.items.map((item) => item.isbn13);

  const { data: reviewsScoreData, isFetching: reviewsScoreFetching } =
    useGetReviewsScore(isbns);

  if (!reviewsScoreFetching) {
    const reviewsMap = new Map(data.items.map((s) => [s.isbn13, s]));
    const merged = data.items.map((item) => ({
      ...item,
      avgScore: reviewsMap.get(item.isbn13)?.avg_score ?? null,
      ratingCount: reviewsMap.get(item.isbn13)?.rating_count ?? 0,
    }));
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const prevDisabled = isFetching || page <= 1;
  const nextDisabled = isFetching || page >= totalPages;

  useEffect(() => {
    if (data.total > 0) {
      const tp = Math.max(1, Math.ceil(data.total / data.pageSize));
      if (page > tp) {
        const sp = new URLSearchParams(searchParams);
        sp.set("page", String(tp));
        setSearchParams(sp, { replace: true });
      }
    }
  }, [data.total, data.pageSize, page, searchParams]);

  return (
    <div className="flex flex-col items-center min-h-screen w-[1200px] px-8 bg-background-white py-15">
      {/* 검색창 */}
      <SearchForm
        key={keyword}
        initialValue={keyword}
        onSearch={handleSearch}
      />

      {/* 추천 검색어, 목록 모드 변경 버튼 */}
      <div className="pb-5 px-4 flex w-full border-b border-black items-center justify-between">
        <PopularKeywords onSearch={handleSearch} />
        <div className="flex gap-2 items-center justify-center">
          <button
            className={tw(
              "cursor-pointer hover:text-slate-400 transition rounded-xl active:bg-gray-200",
              listMode === "line" && "text-primary hover:text-primary"
            )}
            type="button"
            onClick={() => setListMode("line")}
          >
            <RxHamburgerMenu size={32} />
          </button>
          <button
            className={tw(
              "cursor-pointer hover:text-slate-400 transition rounded-xl active:bg-gray-200",
              listMode === "grid" && "text-primary hover:text-primary"
            )}
            type="button"
            onClick={() => setListMode("grid")}
          >
            <RxGrid size={32} />
          </button>
        </div>
      </div>

      {/* 로딩중 아이콘 */}
      {isFetching ? (
        <img
          className="h-25 text-center p-1 inline"
          src={loaderIcon}
          alt="로딩중"
        />
      ) : null}

      {/* 목록 */}
      <BookList
        mode={listMode}
        bookList={data.items}
        className="w-full"
        onSearch={handleSearch}
      />

      {/* 목록 네비게이션 */}
      <nav className="mt-4 flex items-center gap-2">
        <button onClick={() => movePage(page - 1)} disabled={prevDisabled}>
          이전
        </button>
        <span key={page} className="flex gap-2 text-center text-xl">
          {renderPageAnchors(page)}
        </span>
        <button onClick={() => movePage(page + 1)} disabled={nextDisabled}>
          다음
        </button>
        {/* <span className="ml-2 text-sm text-gray-500">
          총 {data.total.toLocaleString()}권
        </span> */}
      </nav>
    </div>
  );
}

export default Search;
