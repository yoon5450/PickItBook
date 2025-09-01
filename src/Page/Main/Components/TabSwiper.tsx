import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { SwiperClass } from "swiper/react";
import { BOOK_CATEGORIES, type CategoryKey } from "../bookCategories";
import tw from "@/utils/tw";

interface TabSwiperProps {
  activeCategory: CategoryKey;
  isMobile: boolean;
  onCategoryChange: (category: CategoryKey) => void;
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  tabIndicatorRef: React.RefObject<HTMLDivElement | null>;
  onSwiper: (swiper: SwiperClass) => void;
}

export const TabSwiper = ({
  activeCategory,
  isMobile,
  onCategoryChange,
  tabContainerRef,
  tabIndicatorRef,
  onSwiper,
}: TabSwiperProps) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);

  return (
    <div
      ref={tabContainerRef}
      className="border-b border-gray-300 relative mb-8"
    >
      {!isMobile && (
        <div
          ref={tabIndicatorRef}
          className="absolute bottom-0 h-0.5 bg-gray-800 z-10 transition-all duration-300"
        />
      )}

      <Swiper
        onSwiper={(swiper) => {
          setSwiperRef(swiper);
          onSwiper(swiper);
        }}
        modules={[FreeMode]}
        spaceBetween={0}
        slidesPerView={isMobile ? "auto" : 9}
        allowTouchMove={true}
        simulateTouch={true}
        threshold={3}
        touchAngle={30}
        passiveListeners={false}
        touchStartPreventDefault={true}
        preventClicks={true}
        preventClicksPropagation={true}
        freeMode={{
          enabled: true,
          sticky: false,
          momentum: true,
          momentumRatio: 1,
        }}
        grabCursor={true}
        resistance={true}
        resistanceRatio={0.35}
        className={tw("tab-swiper", !isMobile ? "flex w-full" : "")}
        wrapperClass={isMobile ? "!flex !items-center" : undefined}
        style={
          isMobile ? { paddingLeft: "20px", paddingRight: "20px" } : undefined
        }
        slidesOffsetBefore={isMobile ? 0 : 0}
        slidesOffsetAfter={isMobile ? 0 : 0}
        speed={300}
      >
        {Object.entries(BOOK_CATEGORIES).map(([key, config], index) => (
          <SwiperSlide
            key={key}
            className={`${isMobile ? "!w-auto !flex-shrink-0" : "flex-1 min-w-0"}`}
            style={isMobile ? { width: "auto" } : undefined}
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
              className={tw(
                "tab-button py-3 transition-all duration-300 whitespace-nowrap block",
                !isMobile
                  ? "px-2 text-sm lg:text-base flex-1 min-w-0 text-center w-full"
                  : "px-6 text-base",
                activeCategory === key
                  ? !isMobile
                    ? "text-primary-black"
                    : "text-primary-black border-b-2 border-primary-black"
                  : "text-gray-400 hover:text-gray-800"
              )}
              onClick={() => {
                onCategoryChange(key as CategoryKey);
                swiperRef?.slideTo(index, 300);
              }}
              style={isMobile ? { minWidth: "fit-content" } : undefined}
            >
              {config.label}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
