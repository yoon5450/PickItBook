import type { SearchKey } from "@/@types/global";

const DUMMY_POPULAR = [
  "히가시노 게이고",
  "양철북",
  "1Q84",
  "어느 세일즈맨의 죽음",
  "소년이 온다",
];

interface Props {
  onSearch: ({ key, value }: { key: SearchKey; value: string }) => void;
}

function PopularKeywords({ onSearch }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <span className="font-semibold">인기 검색어</span>
      {DUMMY_POPULAR.map((item, index) => (
        <a key={index} className="cursor-pointer" onClick={() => onSearch({ key: "keyword", value: item })}>{item}</a>
      ))}
    </div>
  );
}
export default PopularKeywords;
