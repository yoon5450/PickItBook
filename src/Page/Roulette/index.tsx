import { useEffect, useMemo, useState } from "react";
import FilterButton from "./Components/FilterButton";
import FilterModal from "./Components/FilterModal";
import Roulette from "./Components/Roulette";
import PickBook from "./Components/PickBook";
import { usePopularBookFetching } from "@/api/usePopularBookFetching";
import { shuffle } from "./utils/shuffle";
import Filter from "@/Components/Filter";
import { KDC_CATEGORY_OPTIONS, type KdcItemType } from "@/constant/kdc";
import type { BookmarkItem, PopularBookItem } from "@/@types/global";
import { useFetchBookmarkList } from "./hooks/useFetchBookmarkList";
import { extendItem } from "./utils/extendItem";

export interface SearchParam {
  key: string
  value: string
}

function RandomRoulette() {
  const [filterTap, setFilterTap] = useState<'장르' | '연령' | '추천' | null>(null);
  const [isOpenPickBook, setIsOpenPickBook] = useState<boolean>(false);
  const [pickBook, setPickBook] = useState<PopularBookItem | BookmarkItem | null>(null);
  const [searchParam, setSearchParam] = useState<SearchParam[] | null>(null);
  const [isBookmarkSelect, setIsBookmarkSelect] = useState<boolean>(false);
  const bookmarkList = useFetchBookmarkList(isBookmarkSelect);

  console.log('북마크 필터링 눌렀냐 ', isBookmarkSelect)
  console.log('북마크 리스트', bookmarkList);

  const [genre, setGenre] = useState<{ top?: KdcItemType, bottom?: KdcItemType } | null>(null)
  const kdc = genre?.top ? genre.top.code[0] : undefined; // 1자리 (0~9)
  const dtl_kdc = genre?.bottom ? genre.bottom.code.slice(0, 2) : undefined; // 2자리(00~99) 
  // 00, 01, 02 이런건 숫자화 시키면 한 자릿수로 들어가서 총류의 소주제 파라미터 값이 이상하게 들어갔다
  // 어짜피 문자로 전달하니 그대로 받기

  const topItems = useMemo<KdcItemType[]>(() => KDC_CATEGORY_OPTIONS.filter((o) => o.code[1] === "0"), []);
  const bottomItems = useMemo<KdcItemType[]>(() => KDC_CATEGORY_OPTIONS.filter((o) => o.code[1] !== "0"), []);


  useEffect(() => {
    // 총류는 kdc 자체가 0으로 시작해서 아래 조건문 kdc&&dtl_kdc 에 어긋나서 파라미터 전달이 안됐다
    if (kdc !== undefined && dtl_kdc !== undefined) {
      setSearchParam([
        { key: 'kdc', value: kdc },
        { key: 'dtl_kdc', value: dtl_kdc }
      ])
    }
    if (kdc !== undefined && dtl_kdc === undefined)
      setSearchParam([{ key: 'kdc', value: kdc }])
  }, [kdc, dtl_kdc])


  const params = useMemo(() => {
    if (!searchParam) return null
    if (searchParam.length > 1) {
      return ({
        [searchParam[0].key]: searchParam[0].value,
        [searchParam[1].key]: searchParam[1].value
      })
    } else {
      return ({ [searchParam[0].key]: searchParam[0].value })
    }
  }, [searchParam, kdc, dtl_kdc])

  // console.log(params)
  const { data, isLoading, error } = usePopularBookFetching(params ?? {})

  if (error) console.error(error, '장르별 책 불러오기 실패');
  if (isLoading) console.log('장르별 책 가져오는중');



  // 북마크 추가할때마다 북마크 리스트가 최신화돼야함

  const filterBooks = useMemo(() => {
    const base = data?.books ?? [];

    if (isBookmarkSelect) {
      const len = bookmarkList?.length ?? 0;
      console.log(len);

      if (len === 0) {
        // 빈 북마크 → 이후 useEffect에서 안내
        return shuffle(base).slice(0, 17);
      }
      if (len >= 17) {
        return shuffle(bookmarkList!).slice(0, 17);
      }
      // 1~16개: 균등 확장 후 셔플
      const extendBookmarkList = extendItem(bookmarkList!);
      return shuffle(extendBookmarkList).slice(0, 17);
    }

    return shuffle(base).slice(0, 17);
  }, [data?.books, isBookmarkSelect, bookmarkList]);

  useEffect(() => {
    if (isBookmarkSelect && (bookmarkList?.length ?? 0) === 0) {
      alert('북마크가 존재하지 않습니다');
    }
  }, [isBookmarkSelect, bookmarkList]);

  useEffect(() => {
    console.log('필터링된 책들 : ', filterBooks);
  }, [filterBooks]);


  return (
    <div className="relative w-full max-w-[1200px] h-screen mx-auto justify-items-center pt-17 py-2">

      <h1 hidden>Filter header</h1>
      <section className="absolute left-2 flex flex-row gap-6 w-[364px]">
        <div className="z-10">
          <FilterButton text={'장르'} setFilterTap={setFilterTap} />
          {filterTap === '장르' && (
            <Filter topItems={topItems} bottomItems={bottomItems} filterItem={genre} setFilterItem={setGenre} />
          )}
        </div>

        <div className="z-10">
          <FilterButton text={'연령'} setFilterTap={setFilterTap} />
          <FilterModal
            isOpen={filterTap === '연령'}
            text='age'
            setSearchParam={setSearchParam}
            setIsBookmarkSelect={setIsBookmarkSelect}
            category={{
              8: "초등",
              14: "청소년",
              20: "20대",
              30: "30대",
              40: "40대",
              50: "50대",
              60: "60대 이상"
            }}
          />
        </div>

        <div className="z-10">
          <FilterButton text={'추천'} setFilterTap={setFilterTap} />
          <FilterModal
            isOpen={filterTap === '추천'}
            text='gender'
            setSearchParam={setSearchParam}
            setIsBookmarkSelect={setIsBookmarkSelect}
            category={{
              all: "인기작",
              bookmark: "북마크",
              0: "남성 추천",
              1: "여성 추천"
            }} />
        </div>
      </section>


      <div className="overflow-y-scroll">
        <PickBook pickBook={pickBook} isOpenPickBook={isOpenPickBook} setIsOpenPickBook={setIsOpenPickBook} />
      </div>
      <Roulette books={filterBooks} setPickBook={setPickBook} setIsOpenPickBook={setIsOpenPickBook} />



    </div>
  );
}

export default RandomRoulette;