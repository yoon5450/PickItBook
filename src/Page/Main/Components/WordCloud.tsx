import React, { useMemo } from "react";
import { Text } from "@visx/text";
import { scaleLog, scaleOrdinal } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";

// WordData 인터페이스
export interface WordData {
  text: string;
  value: number;
}

// WordCloud Props 인터페이스
export interface WordCloudProps {
  words: WordData[];
  width?: number;
  height?: number;
  minFontSize?: number;
  maxFontSize?: number;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 단색 블루 계열 색상 스키마
const BLUE_COLOR_SCHEME = [
  "#1E3A8A",
  "#1E40AF",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE",
  "#DBEAFE",
];

const WordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 800,
  height = 400,
  minFontSize = 14,
  maxFontSize = 50,
  fontFamily = "Inter, sans-serif",
  className = "",
  style = {},
}) => {
  // 폰트 크기 스케일 생성
  const fontScale = useMemo(() => {
    if (!words.length) return () => minFontSize;

    const values = words.map((w) => w.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    if (minValue === maxValue) {
      return () => (minFontSize + maxFontSize) / 2;
    }

    return scaleLog({
      domain: [minValue, maxValue],
      range: [minFontSize, maxFontSize],
    });
  }, [words, minFontSize, maxFontSize]);

  // 색상 스케일 생성
  const colorScale = useMemo(() => {
    return scaleOrdinal({
      domain: words.map((_, i) => i.toString()),
      range: BLUE_COLOR_SCHEME,
    });
  }, [words]);

  // 폰트 크기 설정 함수
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  // 고정된 랜덤 값 생성기 (레이아웃 일관성을 위해)
  const fixedValueGenerator = () => 0.5;

  if (words.length === 0) {
    return (
      <div
        className={`relative bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-gray-400 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div>데이터가 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      style={{ width, height, ...style }}
    >
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={fontFamily}
        padding={3}
        spiral="archimedean"
        rotate={0} // 회전 없음
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colorScale(i.toString())}
              textAnchor="middle"
              transform={`translate(${w.x}, ${w.y})`}
              fontSize={w.size}
              fontFamily={w.font}
              className="select-none cursor-default transition-opacity duration-200 hover:opacity-80"
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>
  );
};

export default WordCloud;
