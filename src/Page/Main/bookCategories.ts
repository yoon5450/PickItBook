export const BOOK_CATEGORIES = {
  all: {
    code: "",
    label: "전체",
    kdcCodes: [],
    description: "모든 분야의 도서",
  },
  literature: {
    code: "literature",
    label: "문학/소설",
    kdcCodes: ["80", "81", "82", "83", "84", "85", "86", "87", "88", "89"],
    description: "소설, 시, 수필, 문학 작품",
  },
   humanities: {
    code: "humanities",
    label: "인문/교양",
    kdcCodes: [
      "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", 
      "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", 
      "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", 
    ],
    description: "철학, 종교, 역사, 교양서",
  },
  social: {
    code: "social",
    label: "사회/경제",
    kdcCodes: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39"],
    description: "사회과학, 경제학, 정치학, 경영, 자기계발",
  },
  science_tech: {
    code: "science_tech",
    label: "과학/기술",
    kdcCodes: [
      "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", 
      "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", 
    ],
    description: "과학, 기술, 의학, IT, 공학",
  },
  arts_culture: {
    code: "arts_culture",
    label: "예술/문화",
    kdcCodes: ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69"],
    description: "미술, 음악, 영화, 디자인, 문화",
  },
  language: {
    code: "language",
    label: "언어/어학",
    kdcCodes: ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"],
    description: "한국어, 영어, 외국어, 언어학습",
  },
  children: {
    code: "children",
    label: "아동/청소년",
    kdcCodes: ["37", "38", "82", "83", "84"],
    description: "아동도서, 청소년도서, 교육서",
    // 키워드 검색을 우선 사용
    useKeywordSearch: true,
  },
  practical: {
    code: "practical",
    label: "실용/생활",
    kdcCodes: ["51", "59", "63"],
    description: "요리, 건강, 취미, 여행, 라이프스타일",
  },
} as const;

export const KEYWORD_MAP = {
  literature: "소설",
  humanities: "인문학",
  social: "경제",
  science_tech: "과학",
  arts_culture: "예술",
  language: "토익",
  children: "동화",
  practical: "요리",
} as const;

export type CategoryKey = keyof typeof BOOK_CATEGORIES;
