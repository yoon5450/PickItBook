import type { BookItemType } from "@/@types/global";
import type { SearchFields } from "@/constant/constant";
import {
  BOOK_CATEGORIES,
  KEYWORD_MAP,
  type CategoryKey,
} from "../bookCategories";

export const makeSearchParams = (category: CategoryKey): SearchFields => {
  if (category === "all") {
    return {};
  }
  if (category === "children") {
    return { keyword: KEYWORD_MAP["children"] };
  }
  return { keyword: KEYWORD_MAP[category] };
};

export const filterByKDC = (
  books: BookItemType[],
  activeCategory: CategoryKey
): BookItemType[] => {
  if (activeCategory === "all" || activeCategory === "children")
    return books.slice(0, 12);

  const kdcCodes = BOOK_CATEGORIES[activeCategory].kdcCodes;
  return books
    .filter((book) => {
      if (!book.class_no) return true;
      const code2 = book.class_no.substring(0, 2);
      return kdcCodes.includes(code2 as never);
    })
    .slice(0, 12);
};

export const refineChildren = (books: BookItemType[]): BookItemType[] => {
  const childrenTerms = [
    "어린이",
    "아동",
    "유아",
    "초등",
    "청소년",
    "동화",
    "그림책",
    "아기",
  ];

  return books
    .filter((book) => {
      const bookname = book.bookname?.toLowerCase() || "";
      const className = book.class_nm?.toLowerCase() || "";
      return childrenTerms.some(
        (term) => bookname.includes(term) || className.includes(term)
      );
    })
    .slice(0, 12);
};
