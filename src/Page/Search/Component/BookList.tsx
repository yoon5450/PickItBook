import type { BookItemType } from "@/@types/global";
import BookItem from "./BookItem";
import tw from "@/utils/tw";

type Props = {
  bookList: BookItemType[];
  className?: string;
};

function BookList({ bookList, className }: Props) {
  return (
    <ul className={tw("flex flex-col justify-center px-22", className)}>
      {bookList && bookList.length === 0 ? (
        <div>검색 결과가 없습니다.</div>
      ) : (
        bookList.map((item) => <BookItem item={item} key={item.isbn13} />)
      )}
    </ul>
  );
}

export default BookList;
