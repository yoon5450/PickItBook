// components/NewBook.tsx
import { useState } from "react";
import type { CategoryKey } from "../bookCategories";

// Custom hooks
import { useMobileDetection } from "../hooks/useMobileDetection";
import { useTabIndicator } from "../hooks/useTabIndicator";
import { useSwiperRefs } from "../hooks/useSwiperRefs";
import { useBookCategory } from "../hooks/useBookCategory";

// Components
import { TabSwiper } from "./TabSwiper";
import { BookSwiper } from "./BookSwiper";
import { LoadingSkeleton } from "./LoadingSkeleton";

const NewBook = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  // Custom hooks
  const isMobile = useMobileDetection();
  const { tabIndicatorRef, tabContainerRef, animateTabIndicator } = useTabIndicator(
    isMobile,
    activeCategory
  );
  const { bookSwiperRef, tabSwiperRef, resetBookSwiper } = useSwiperRefs(isMobile);
  const { isLoading, isError, error, filteredBooks } = useBookCategory(activeCategory);

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
            <div className="text-center py-12">
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