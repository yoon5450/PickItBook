export const getKyoboImageURL = (isbn13: string): string => {
  if (!isbn13 || isbn13.length !== 13) return "";
  return `https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/${isbn13}.jpg`;
};

export const getAladinImageURL = (
  isbn13: string,
  size: "medium" | "large" = "large"
): string => {
  if (!isbn13) return "";

  const sizeMap = {
    medium: "cover200",
    large: "cover500",
  };

  return `https://image.aladin.co.kr/product/${isbn13.slice(-4)}/${sizeMap[size]}/${isbn13}_1.jpg`;
};

export const getBookImageURLs = (
  isbn13: string,
  originalURL?: string
): string[] => {
  const urls: string[] = [];

  if (isbn13 && isbn13.length === 13) {
    // 1순위: 교보문고
    urls.push(getKyoboImageURL(isbn13));
    // 2순위: 알라딘 대형 이미지
    urls.push(getAladinImageURL(isbn13, "large"));
  }
  // 3순위: 원본 URL (도서관 정보나루)
  if (originalURL) {
    urls.push(originalURL);
  }

  return urls.filter((url) => url.length > 0);
};

export const isValidISBN13 = (isbn: string): boolean => {
  return /^97[89]\d{10}$/.test(isbn);
};
