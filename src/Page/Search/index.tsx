import BookList from "./Component/BookList";
import type {BookItemType} from '@/@types/global';

function Search() {
  const bookItemList:BookItemType[] = [
    {
      isbn13: "9788971421307",
      bookname: "용의자 X의 헌신",
      authors: "히가시노 게이고",
      publisher: "현대문학",
      class_nm: "문학 > 일본문학 > 소설",
      publication_year: "2006",
      bookImageURL:
        "https://bookthumb-phinf.pstatic.net/cover/060/596/06059601.jpg?type=m1&udate=20110930",
    },
    {
      isbn13: "9788971421307",
      bookname: "용의자 X의 헌신",
      authors: "히가시노 게이고",
      publisher: "현대문학",
      class_nm: "문학 > 일본문학 > 소설",
      publication_year: "2006",
      bookImageURL:
        "https://bookthumb-phinf.pstatic.net/cover/060/596/06059601.jpg?type=m1&udate=20110930",
    },
    {
      isbn13: "9788971421307",
      bookname: "용의자 X의 헌신",
      authors: "히가시노 게이고",
      publisher: "현대문학",
      class_nm: "문학 > 일본문학 > 소설",
      publication_year: "2006",
      bookImageURL:
        "https://bookthumb-phinf.pstatic.net/cover/060/596/06059601.jpg?type=m1&udate=20110930",
    },
    {
      isbn13: "9788971421307",
      bookname: "용의자 X의 헌신",
      authors: "히가시노 게이고",
      publisher: "현대문학",
      class_nm: "문학 > 일본문학 > 소설",
      publication_year: "2006",
      bookImageURL:
        "https://bookthumb-phinf.pstatic.net/cover/060/596/06059601.jpg?type=m1&udate=20110930",
    },
  ];

  return (
    <div className="min-h-full">
      <BookList bookList={bookItemList}/>
    </div>
  );
}
export default Search;
