import { useMemo } from "react";
import { type CategoryKey } from "../bookCategories";
import { getMockDataByCategory } from "../utils/mockData";
import { filterByKDC, refineChildren } from "../utils/bookUtils";

export const useBookCategoryMock = (activeCategory: CategoryKey) => {
  const filteredBooks = useMemo(() => {
    const mockData = getMockDataByCategory(activeCategory);

    // 실제 로직과 동일하게 필터링
    if (activeCategory === "children") {
      return refineChildren(mockData);
    } else {
      return filterByKDC(mockData, activeCategory);
    }
  }, [activeCategory]);

  return {
    data: { items: filteredBooks },
    isLoading: false,
    isError: false,
    error: null,
    filteredBooks,
  };
};
