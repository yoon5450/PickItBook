import type { BookItemType } from "@/@types/global";

export const MOCK_BOOKS: BookItemType[] = [
  {
    isbn13: "9791173323027",
    bookname: "호의에 대하여",
    authors: " 문형배",
    publisher: "감영사",
    publication_year: "2025",
    class_no: "189",
    class_nm: "자기계발",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791173323027.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791162544327",
    bookname: "렛뎀 이론",
    authors: "The Let Them Theory/Mel Robbins",
    publisher: "비지니스북스",
    publication_year: "2025",
    class_no: "833",
    class_nm: "",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791162544327.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791140705207",
    bookname: "편안함의 습격",
    authors: "마이클 이스터",
    publisher: "수오서재",
    publication_year: "2025",
    class_no: "189",
    class_nm: "자기계발",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788934933878.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9788936440237",
    bookname: "혼모노",
    authors: "성해나",
    publisher: "창비",
    publication_year: "2025",
    class_no: "813",
    class_nm: "한국소설",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791198754080.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791168341275",
    bookname: "박곰희 연금 부자 수업",
    authors: "박곰희",
    publisher: "인플루엔셜",
    publication_year: "2025",
    class_no: "327",
    class_nm: "경제",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936439743.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791169090388",
    bookname: "손자병법",
    authors: "임용한",
    publisher: "교보문고",
    publication_year: "2025",
    class_no: "392",
    class_nm: "군사학",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788998441012.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791198461711",
    bookname: "워런 버핏 삶의 원칙",
    authors: "구와바라 데루야",
    publisher: "필름",
    publication_year: "2025",
    class_no: "325",
    class_nm: "경제인물",
    bookImageURL:
      "	https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791193937686.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791197377143",
    bookname: "읽는 기도",
    authors: "무명의 기도자",
    publisher: "더하트",
    publication_year: "2025",
    class_no: "234",
    class_nm: "기독교",
    bookImageURL:
      "	https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791191669930.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791168470996",
    bookname: "우리의 낙원에서 만나자",
    authors: "하태완",
    publisher: "북로망스",
    publication_year: "2025",
    class_no: "814",
    class_nm: "한국에세이",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791170612759.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9788954699488",
    bookname: "글로벌 주식 투자 빅 시프트",
    authors: "메리츠증권 리서치센터",
    publisher: "에프엔미디어",
    publication_year: "2025",
    class_no: "327",
    class_nm: "투자",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434120.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9788954699921",
    bookname: "안녕이라 그랬어",
    authors: "김애란",
    publisher: "문학동네",
    publication_year: "2025",
    class_no: "813",
    class_nm: "한국소설",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788954677158.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
  {
    isbn13: "9791158513801",
    bookname: "료의 생각 없는 생각",
    authors: "료",
    publisher: "열림원",
    publication_year: "2025",
    class_no: "814",
    class_nm: "한국에세이",
    bookImageURL:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791191056372.jpg",
    addition_symbol: "",
    vol: "",
    bookDtlUrl: "",
    loan_count: "",
  },
];

// 카테고리별 필터링된 목 데이터 반환
export const getMockDataByCategory = (category: string): BookItemType[] => {
  const categoryFilters: Record<string, string[]> = {
    all: [],
    literature: ["8"], // 문학
    humanities: ["1", "2", "9"], // 철학, 종교, 역사
    social: ["3"], // 사회과학
    science_tech: ["4", "5"], // 자연과학, 기술과학
    arts_culture: ["6"], // 예술
    language: ["7"], // 언어
    children: ["0"], // 총류 (임시)
    practical: ["5"], // 기술과학 일부
  };

  if (category === "all") {
    return MOCK_BOOKS;
  }

  const filterCodes = categoryFilters[category] || [];
  return MOCK_BOOKS.filter((book) => {
    if (!book.class_no) return false;
    const firstDigit = book.class_no.charAt(0);
    return filterCodes.includes(firstDigit);
  }).slice(0, 12);
};
