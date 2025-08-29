import { useRef, useCallback, useEffect } from "react";
import { BOOK_CATEGORIES, type CategoryKey } from "../bookCategories";

export const useTabIndicator = (
  isMobile: boolean,
  activeCategory: CategoryKey
) => {
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const animateTabIndicator = useCallback(
    (categoryKey: CategoryKey) => {
      if (!tabIndicatorRef.current || !tabContainerRef.current || isMobile)
        return;

      const tabElements =
        tabContainerRef.current.querySelectorAll(".tab-button");
      const categoryKeys = Object.keys(BOOK_CATEGORIES);
      const tabIndex = categoryKeys.indexOf(categoryKey);
      const targetTab = tabElements[tabIndex] as HTMLElement;

      if (targetTab) {
        const containerRect = tabContainerRef.current.getBoundingClientRect();
        const tabRect = targetTab.getBoundingClientRect();
        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;

        tabIndicatorRef.current.style.transform = `translateX(${left}px)`;
        tabIndicatorRef.current.style.width = `${width}px`;
        tabIndicatorRef.current.style.transition = "all 0.3s ease-out";
      }
    },
    [isMobile]
  );

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => animateTabIndicator(activeCategory), 100);
    }
  }, [activeCategory, animateTabIndicator, isMobile]);

  return {
    tabIndicatorRef,
    tabContainerRef,
    animateTabIndicator,
  };
};
