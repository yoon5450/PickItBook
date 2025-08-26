// 글로벌로 정의된 타입들을 저장하는 장소입니다. db구조 등
export type BookItemType = {
    bookname: string;
    authors: string;
    publisher: string;
    publication_year: string;
    isbn13: string;
    addition_symbol: string;
    vol: string;
    class_no: string;
    class_nm: string;
    bookImageURL: string;
    bookDtlUrl: string;
    loan_count: string;
};

export type BookDocRaw = { doc: BookItemType };
export type BookSearchRaw = { response?: { docs?: BookDocRaw[] } };
export type SearchKey = "keyword" | "title" | "author" | "isbn13";