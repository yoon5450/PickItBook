// 글로벌로 정의된 타입들을 저장하는 장소입니다. db구조 등
export type BookItemType = {
  isbn13: string;
  bookname: string;
  authors: string;
  publisher: string;
  class_nm: string;
  bookImageURL: string;
  publication_year: string;
};