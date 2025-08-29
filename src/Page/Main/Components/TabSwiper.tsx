// components/TabSwiper.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { SwiperClass } from "swiper/react";
import { BOOK_CATEGORIES, type CategoryKey } from "../bookCategories";

interface TabSwiperProps {
  activeCategory: CategoryKey;
  isMobile: boolean;
  onCategoryChange: (category: CategoryKey) => void;
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  tabIndicatorRef:React.RefObject<HTMLDivElement | null>;
  onSwiper: (swiper: SwiperClass) => void;
}

export const TabSwiper = ({
  activeCategory,
  isMobile,
  onCategoryChange,
  tabContainerRef,
  tabIndicatorRef,
  onSwiper,
}:TabSwiperProps) => {
  return (
    <div
      ref={tabContainerRef}
      className="border-b border-gray-300 relative mb-8"
    >
      {!isMobile && (
        <div
          ref={tabIndicatorRef}
          className="absolute bottom-0 h-0.5 bg-gray-800 z-10 transition-all"
          style={{ transition: "all 0.3s" }}
        />
      )}
      <Swiper
        onSwiper={onSwiper}
        modules={[FreeMode]}
        spaceBetween={isMobile ? 16 : 0}
        slidesPerView={isMobile ? "auto" : 9}
        freeMode={{
          enabled: isMobile,
          sticky: false,
        }}
        allowTouchMove={true}
        grabCursor={isMobile}
        touchRatio={1}
        resistance={true}
        resistanceRatio={0.85}
        className={`tab-swiper ${!isMobile ? "flex w-full" : "overflow-visible"}`}
        wrapperClass={isMobile ? "!flex !items-center" : undefined}
        style={isMobile ? { 
          paddingLeft: '16px', 
          paddingRight: '16px',
          overflow: 'visible' 
        } : undefined}
      >
        {Object.entries(BOOK_CATEGORIES).map(([key, config]) => (
          <SwiperSlide
            key={key}
            className={`${
              isMobile 
                ? "!w-auto !flex-shrink-0 !h-auto"
                : "flex-1 min-w-0"
            }`}
          >
            <button
              className={`tab-button py-3 transition-all duration-300 whitespace-nowrap block
                ${
                  !isMobile
                    ? "px-2 text-sm lg:text-base flex-1 min-w-0 text-center w-full"
                    : "px-6 text-base font-medium min-w-max"
                }
                ${
                  activeCategory === key
                    ? !isMobile
                      ? "text-gray-800 font-medium"
                      : "text-gray-800 font-semibold border-b-2 border-gray-800"
                    : "text-gray-400 hover:text-gray-600"
                }
              `}
              onClick={() => onCategoryChange(key as CategoryKey)}
            >
              {config.label}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};