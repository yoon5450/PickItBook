import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getBookmarks, type BookmarkBook } from "@/utils/getBookmarks";
import { makeBookDetailURL } from "@/constant/constant";
import { fetcher } from "@/api/fetcher";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useMobileDetection } from "../Main/hooks/useMobileDetection";

export interface WordData {
  text: string;
  value: number;
}

export interface WordCloudProps {
  minFontSize?: number;
  maxFontSize?: number;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
  userId?: string;
}

// 불용어 + 조사/접미사
const stopWords = [
  "그리고", "하지만", "그러나", "또한", "이것", "그것", "저것", "우리", "나는", "당신", "그들", "이런", "그런", "지은이",
  "저런", "에서", "으로", "에게", "하다", "된다", "같은", "the", "and", "for", "with", "was", "are", "this", "that",
];

// 키워드 추출
const extractKeywordsFromText = (text: string): string[] => {
  if (!text) return [];
  const koreanWords = text.match(/[가-힣]{2,}/g) || [];
  const englishWords = text.match(/[a-zA-Z]{3,}/g) || [];
  return [...koreanWords, ...englishWords]
    .map((w) => w.toLowerCase().trim())
    .filter((w) => w.length > 1 && !stopWords.includes(w));
};

// 단일 책 내 키워드 빈도수 세기 함수
const countKeywords = (keywords: string[]) => {
  const counts: Record<string, number> = {};
  keywords.forEach((k) => {
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
};

const WordCloud = ({
  minFontSize,
  maxFontSize,
  fontFamily = "Pretendard Variable, sans-serif",
  style = {},
  className = "",
  userId,
}: WordCloudProps) => {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BookmarkBook[]>([]);
  const [bookmarkKeywords, setBookmarkKeywords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const isMobile = useMobileDetection();

  // 화면 크기 기반 반응형 폰트
  const responsiveFont = useMemo(() => {
    return {
      min: minFontSize || (isMobile ? 12 : 16),
      max: maxFontSize || (isMobile ? 32 : 50),
    };
  }, [minFontSize, maxFontSize, isMobile]);

  // 도서 상세 정보 API 기반 키워드 추출
  const extractKeywordsFromBookDetail = async (
    isbn13: string
  ): Promise<string[]> => {
    try {
     const url = makeBookDetailURL(isbn13);
      const raw = await fetcher(url);
      if (!raw.response) return [];
      const book = raw.response.detail?.[0]?.book;
      if (!book) return [];

      const keywords: string[] = [];

      if (book.class_nm)
        keywords.push(...extractKeywordsFromText(book.class_nm)); // 분류명

      if (book.description)
        keywords.push(
          ...extractKeywordsFromText(book.description).slice(0, 20)
        ); // 최대 20개

      if (book.publisher)
        keywords.push(...extractKeywordsFromText(book.publisher)); // 출판사

      if (book.book_name)
        keywords.push(...extractKeywordsFromText(book.book_name)); // 제목

      if (book.authors) keywords.push(...extractKeywordsFromText(book.authors)); // 저자

      if (book.keyword)
        keywords.push(
          ...book.keyword
            .split(/[,;]/)
            .map((k: string) => k.trim())
            .filter((k: string) => k.length > 0)
        );

      return keywords;
    } catch {
      return [];
    }
  };

  // 북마크 → 키워드 변환 (빈도 반영)
  const extractKeywordsFromBookmarks = useCallback(
  async (bookmarks: BookmarkBook[]): Promise<WordData[]> => {
    const keywordCount: Record<string, number> = {};
    for (let i = 0; i < bookmarks.length; i++) {
      const book = bookmarks[i];
      setProcessedCount(i + 1);
      let keywords: string[] = [];

      if (book.isbn13) {
        const extracted = await extractKeywordsFromBookDetail(book.isbn13);
        if (extracted.length > 0) keywords = extracted;
      }

      if (keywords.length === 0) {
        const titleKeywords = extractKeywordsFromText(book.book_name || "");
        const authorKeywords = extractKeywordsFromText(book.authors || "");
        keywords = [...titleKeywords, ...authorKeywords];
      }

      if (keywords.length === 0 && book.keyword) {
        keywords = book.keyword
          .split(/[,;]/)
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
      }

      // 키워드 빈도수 계산 후 누적 업데이트
      if (keywords.length > 0) {
        const counts = countKeywords(keywords);
        Object.entries(counts).forEach(([k, c]) => {
          keywordCount[k] = (keywordCount[k] || 0) + c;
        });
      }

      if (i < bookmarks.length - 1)
        await new Promise((res) => setTimeout(res, 100));
    }

    // 키워드를 빈도순으로 정렬
    const sortedKeywords = Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 100);

    // 폰트 크기 차이를 강화
    return enhanceFontSizeVariation(sortedKeywords);
  },
  []
);

// 폰트 크기 차이를 강화하는 함수
const enhanceFontSizeVariation = (sortedKeywords: [string, number][]): WordData[] => {
  if (sortedKeywords.length === 0) return [];
  
  const maxCount = sortedKeywords[0][1];
  const minCount = sortedKeywords[sortedKeywords.length - 1][1];
  
  // 빈도수 차이가 작은 경우 인위적으로 차이를 증가
  if (maxCount === minCount || (maxCount - minCount) < 3) {
    return sortedKeywords.map(([text, value], index) => {

      // 순위에 따라 가중치 적용 
      const totalKeywords = sortedKeywords.length;
      
      // 로그 스케일을 사용하여 차이 증폭
      const logWeight = Math.pow(2, (totalKeywords - index) / totalKeywords);
      const enhancedValue = Math.round(value * 50 * logWeight) + (totalKeywords - index) * 5;
      
      return {
        text,
        value: Math.max(enhancedValue, 1) // 최소값 1 보장
      };
    });
  }
  
  // 빈도수 차이가 충분한 경우 기본 로직 사용
  return sortedKeywords.map(([text, value]) => ({ text, value }));
};

  // 북마크 데이터 가져오기
  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    const fetchBookmarkKeywords = async () => {
      setLoading(true);
      setProcessedCount(0);
      try {
        const bookmarkData = await getBookmarks(targetUserId);
        setBookmarks(bookmarkData);
        if (!bookmarkData || bookmarkData.length === 0) {
          setBookmarkKeywords([]);
          return;
        }
        const keywords = await extractKeywordsFromBookmarks(bookmarkData);
        setBookmarkKeywords(keywords);
      } finally {
        setLoading(false);
        setProcessedCount(0);
      }
    };

    fetchBookmarkKeywords();
  }, [userId, user?.id, extractKeywordsFromBookmarks]);

  useEffect(() => {
  if (loading || bookmarkKeywords.length === 0) return;

  am4core.useTheme(am4themes_animated);
  const chart = am4core.create(
    "wordcloud-chart",
    am4plugins_wordCloud.WordCloud
  );
  chart.logo.disabled = true;

  const series = chart.series.push(
    new am4plugins_wordCloud.WordCloudSeries()
  );
  series.data = bookmarkKeywords.map((w) => ({
    tag: w.text,
    count: w.value,
  }));
  series.dataFields.word = "tag";
  series.dataFields.value = "count";
  series.minFontSize = responsiveFont.min;
  series.maxFontSize = responsiveFont.max;
  series.fontFamily = fontFamily;
  series.colors = new am4core.ColorSet();

  // 폰트 크기 스케일링 방식 조정
  series.randomness = 0.2; // 약간의 랜덤성 추가
  series.rotationThreshold = 0.5; // 회전 임계값
  
  const hoverState = series.labels.template.states.create("hover");
  hoverState.properties.scale = 1.1;
  hoverState.transitionDuration = 300;

  return () => chart.dispose();
}, [bookmarkKeywords, loading, responsiveFont, fontFamily]);

  return (
    <div className="py-12 max-[1250px]:mx-5">
      <div className="flex items-center justify-center w-[1200px] max-[1250px]:w-full mx-auto h-[400px] rounded-2xl border bg-background-white border-gray-300 p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full border-b-2 border-gray-400 h-8 w-8 mb-4"></div>
            <p>
              키워드를 분석하는 중... {processedCount}/{bookmarks.length}
            </p>
          </div>
        ) : bookmarkKeywords.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-center text-gray-400">
            북마크한 책이 없습니다. <br />
            책을 북마크하면 관심사를 분석해드려요!
          </div>
        ) : (
          <div
            id="wordcloud-chart"
            style={{ width: "100%", height: "100%", ...style }}
            className={className}
          />
        )}
      </div>
    </div>
  );
};

export default WordCloud;
