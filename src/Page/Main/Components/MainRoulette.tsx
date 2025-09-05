import RouletteWheel from "@/Page/Roulette/Components/RouletteWheel";
import { useMemo } from "react";
import { MOCK_BOOKS } from "../utils/mockData";
import type { PopularBookItem } from "@/@types/global";

type Book = {
  src: string;
  alt: string;
};

interface Props {
  books?: Book[];
}

function MainRoulette({ books }: Props) {
  const transformedBooks = useMemo((): PopularBookItem[] => {
    return MOCK_BOOKS.slice(0, 17).map((book, index) => ({
      // 실제 사용되는 필드
      isbn13: book.isbn13,
      bookImageURL: book.bookImageURL,
      bookname: book.bookname,
      // 나머지 기본값
      no: index + 1,
      ranking: index + 1,
      authors: "",
      publisher: "",
      publication_year: "",
      addition_symbol: "",
      vol: "",
      class_no: "",
      class_nm: "",
      bookDtlUrl: "",
      loan_count: 0,
    }));
  }, [books]);
  return (
    <>
      <RouletteWheel
        isStart={false}
        books={transformedBooks}
        duration={20}
        pinReaction={{
          enabled: true,
          minKick: 5,
          maxKick: 10,
          duration: 1.5,
          ease: "elastic.out",
          elasticStrength: 2,
          elasticPower: 0.8,
        }}
        isMainPage={true}
      />
    </>
  );
}
export default MainRoulette;
