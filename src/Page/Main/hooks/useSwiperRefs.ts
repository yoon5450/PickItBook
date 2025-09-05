import { useRef, useEffect } from "react";
import type { SwiperClass } from "swiper/react";

export const useSwiperRefs = (isMobile: boolean) => {
  const bookSwiperRef = useRef<SwiperClass | null>(null);
  const tabSwiperRef = useRef<SwiperClass | null>(null);

  // 모바일에서 Swiper 재초기화
  useEffect(() => {
    if (isMobile && tabSwiperRef.current) {
      setTimeout(() => {
        tabSwiperRef.current?.update?.();
      }, 100);
    }
  }, [isMobile]);

  const resetBookSwiper = () => {
    if (bookSwiperRef.current) {
      bookSwiperRef.current.slideTo(0);
    }
  };

  return {
    bookSwiperRef,
    tabSwiperRef,
    resetBookSwiper,
  };
};
