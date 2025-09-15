import type { SearchKey } from "@/@types/global";
import BookItem from "./BookItem";
import tw from "@/utils/tw";
import type { listMode, MergedType } from "..";


type Props = {
  bookList: MergedType[];
  className?: string;
  onSearch: ({ key, value }: { key: SearchKey; value: string }) => void;
  mode: listMode;
};

const modeUlClass = {
  line: "flex flex-col justify-center",
  grid: "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 justify-items-center pt-6"
} as const

function BookList({ bookList, className, onSearch, mode = "line" }: Props) {
  // console.log(bookList);
  return (
    <ul className={tw("min-h-screen", modeUlClass[mode], className)}>
      {bookList && bookList.length === 0 ? (
        <div className="text-center text-2xl text-slate-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        bookList.map((item) => (
          <BookItem mode={mode} item={item} key={item.isbn13} onSearch={onSearch} />
        ))
      )}
    </ul>
  );
}

export default BookList;
