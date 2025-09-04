interface Props {
  text: "장르" | "연령" | "추천";
  setIsBookmarkSelect?: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterTap?: React.Dispatch<
    React.SetStateAction<"장르" | "연령" | "추천" | null>
  >;
}

function FilterButton({ text, setIsBookmarkSelect, setFilterTap }: Props) {
  return (
    <button
      type="button"
      aria-label={`필터 카테고리 ${text}`}
      className="flex flex-row gap-2 w-25 h-12 px-6 py-4 mb-2 rounded-xl items-center justify-center shadow-sm bg-pattern"
      onClick={() => {
        // 필터'탭'을 누른 경우 북마크 필터 꺼짐 처리
        setIsBookmarkSelect?.(false);
        // 이전 필터값에 따라 필터 바뀜 처리
        setFilterTap?.((prev) => (prev === text ? null : text));
      }}
    >
      <p className="font-semibold">{text}</p>
      <img className="w-3 h-3" src="/arrowDown.svg" alt="화살표 아래" />
    </button>
  );
}
export default FilterButton;
