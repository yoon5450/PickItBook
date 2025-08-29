import { useState } from "react";
import type { CategoryKey } from "../bookCategories";
import { useMobileDetection } from "../hooks/useMobileDetection";
import { useTabIndicator } from "../hooks/useTabIndicator";
import { useSwiperRefs } from "../hooks/useSwiperRefs";
import { useBookCategory } from "../hooks/useBookCategory";
import { useBookCategoryMock } from "../hooks/useBookCategoryMock";
import { TabSwiper } from "./TabSwiper";
import { BookSwiper } from "./BookSwiper";
import { LoadingSkeleton } from "./LoadingSkeleton";

const USE_MOCK_DATA = true; // true로 설정하면 목 데이터 사용

const NewBook = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const isMobile = useMobileDetection();
  const { tabIndicatorRef, tabContainerRef, animateTabIndicator } =
    useTabIndicator(isMobile, activeCategory);
  const { bookSwiperRef, tabSwiperRef, resetBookSwiper } =
    useSwiperRefs(isMobile);

  // 목 데이터 또는 실제 API 데이터 사용
  const realData = useBookCategory(activeCategory);
  const mockData = useBookCategoryMock(activeCategory);
  const { isLoading, isError, error, filteredBooks } = USE_MOCK_DATA
    ? mockData
    : realData;

  // Handlers
  const handleCategoryChange = (category: CategoryKey) => {
    setActiveCategory(category);
    resetBookSwiper();
    if (!isMobile) {
      setTimeout(() => animateTabIndicator(category), 50);
    }
  };

  return (
    <section className="py-20 border-t border-primary-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="relative text-3xl text-center text-primary-black font-semibold pb-2 mb-16">
          분야별 추천 도서
          {/* {USE_MOCK_DATA && (
            <span className="absolute top-0 right-0 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
              MOCK DATA
            </span>
          )} */}
          <span className="absolute left-1/2 bottom-0 -translate-x-1/2 w-12 h-0.5 bg-primary"></span>
        </h2>

        {/* Error Message */}
        {isError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </div>
        )}

        {/* Tab Swiper */}
        <TabSwiper
          activeCategory={activeCategory}
          isMobile={isMobile}
          onCategoryChange={handleCategoryChange}
          tabContainerRef={tabContainerRef}
          tabIndicatorRef={tabIndicatorRef}
          onSwiper={(swiper) => (tabSwiperRef.current = swiper)}
        />

        {/* Content Area */}
        <div className="relative">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredBooks.length > 0 ? (
            <BookSwiper
              books={filteredBooks}
              activeCategory={activeCategory}
              onSwiper={(swiper) => (bookSwiperRef.current = swiper)}
            />
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg">
                이 카테고리에는 현재 도서가 없습니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewBook;
