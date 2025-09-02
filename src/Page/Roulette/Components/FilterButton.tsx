

interface Props {
  text: '장르' | '연령' | '추천';
  setAction?: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterTap?: React.Dispatch<React.SetStateAction<'장르' | '연령' | '추천' | null>>
}

function FilterButton({ text, setAction, setFilterTap }: Props) {

  return (
    <button
      type="button"
      aria-label={`필터 카테고리 ${text}`}
      className="flex flex-row gap-2 w-25 h-12 px-6 py-4 mb-2 rounded-xl items-center justify-center shadow-sm bg-pattern"
      onClick={() => {
        setAction && setAction(prev => !prev)
        setFilterTap?.(prev => {
          if (prev === text) return null
          else return text
        });
      }}
    >
      <p className="font-semibold">{text}</p>
      <img className="w-3 h-3" src="/arrowDown.svg" alt="화살표 아래" />
    </button>
  )
}
export default FilterButton