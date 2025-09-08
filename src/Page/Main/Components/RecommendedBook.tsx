import { useEffect, useRef, useState } from "react";
import type { CategoryKey } from "../bookCategories";
import { useMobileDetection } from "../hooks/useMobileDetection";
import { useTabIndicator } from "../hooks/useTabIndicator";
import { useSwiperRefs } from "../hooks/useSwiperRefs";
import { useBookCategory } from "../hooks/useBookCategory";
import { TabSwiper } from "./TabSwiper";
import BookSwiper from "./BookSwiper";
import LoadingSkeleton from "./LoadingSkeleton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RecommendedBook = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const isMobile = useMobileDetection();
  const { tabIndicatorRef, tabContainerRef, animateTabIndicator } =
    useTabIndicator(isMobile, activeCategory);
  const { bookSwiperRef, tabSwiperRef, resetBookSwiper } =
    useSwiperRefs(isMobile);
  const { isLoading, isError, error, filteredBooks } =
    useBookCategory(activeCategory);

  // Handlers
  const handleCategoryChange = (category: CategoryKey) => {
    setActiveCategory(category);
    resetBookSwiper();
    if (!isMobile) {
      setTimeout(() => animateTabIndicator(category), 50);
    }
  };

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const swiper = swiperRef.current;

    if (!section || !title || !swiper) return;

    gsap.set([title, swiper], {
      opacity: 0,
      y: 50,
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      anticipatePin: 1,
      animation: gsap
        .timeline()
        .to(
          title,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          swiper,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.3,
            ease: "power2.inOut",
          },
          0
        ),
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [isMobile]);

  return (
    <section className="py-[50px] md:py-20" ref={sectionRef}>
      <div className="w-[1200px] m-auto px-0 max-[1340px]:w-full max-[1340px]:px-20 max-[768px]:px-0">
        <h2
          className="relative text-2xl md:text-3xl text-center text-primary-black font-semibold pb-2 mb-[30px] md:mb-16"
          ref={titleRef}
        >
          분야별 추천 도서
          <span className="absolute left-1/2 bottom-0 -translate-x-1/2 w-12 h-0.5 bg-primary"></span>
        </h2>

        {/* Error Message */}
        {isError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </div>
        )}

        <div ref={swiperRef}>
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
      </div>
    </section>
  );
};

export default RecommendedBook;
