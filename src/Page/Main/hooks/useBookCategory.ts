import type { BookItemType } from "@/@types/global";
import { useBookFetching } from "@/api/useBookFetching";
import { type CategoryKey, BOOK_CATEGORIES } from "../bookCategories";
import {
  filterByKDC,
  makeSearchParams,
  refineChildren,
} from "../utils/bookUtils";

export const useBookCategory = (activeCategory: CategoryKey) => {
  const { data, isLoading, isError, error } = useBookFetching(
    makeSearchParams(activeCategory),
    1,
    {
      enabled: !!activeCategory,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    }
  );

  const getFilteredBooks = (): BookItemType[] => {
    if (!data?.items) return [];
    if (activeCategory === "children") {
      const categoryConfig = BOOK_CATEGORIES[activeCategory];
      if (categoryConfig.useKeywordSearch) {
        return data.items;
      } else {
        return refineChildren(data.items);
      }
    } else {
      return filterByKDC(data.items, activeCategory);
    }
  };

  return {
    data,
    isLoading,
    isError,
    error,
    filteredBooks: getFilteredBooks(),
  };
};
