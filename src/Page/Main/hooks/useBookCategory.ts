import type { BookItemType } from "@/@types/global";
import { useBookFetching } from "@/api/searchBook";
import { type CategoryKey } from "../bookCategories";
import { filterByKDC, makeSearchParams, refineChildren } from "../utils/bookUtils";


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
      return refineChildren(data.items);
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