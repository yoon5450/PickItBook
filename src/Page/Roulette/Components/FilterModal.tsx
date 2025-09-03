import type { SearchParam } from ".."


type Category = {
  8?: "초등",
  14?: "청소년",
  20?: "20대",
  30?: "30대",
  40?: "40대",
  50?: "50대",
  60?: "60대 이상",
  all?: "인기작",
  bookmark?: "북마크",
  0?: "남성 추천",
  1?: "여성 추천"
}


interface Props {
  category: Category
  text: string
  isOpen: boolean
  setSearchParam: React.Dispatch<React.SetStateAction<SearchParam[] | null>>
  setIsBookmarkSelect: React.Dispatch<React.SetStateAction<boolean>>
}

function FilterModal({ isOpen, text, category, setSearchParam, setIsBookmarkSelect }: Props) {

  const handleSelect = (key: string) => {
    if (key === 'bookmark') {
      setIsBookmarkSelect(true);
    }
    else {
      setIsBookmarkSelect(false);

      if (key === 'all') setSearchParam(null)
      else {
        setSearchParam([{
          key: text,
          value: key
        }])
      }

    }
  }

  return (
    <>
      {
        isOpen &&
        <div className="flex flex-col justify-center items-center shadow-sm py-4 gap-2 rounded-xl bg-pattern">
          {Object.entries(category).map(([key, values], index) => (
            <button
              type="button"
              key={index}
              aria-label={values}
              className=" 
                w-19 rounded-xl py-1 px-2 transition
                hover:bg-primary/50 hover:text-white 
                focus:bg-primary focus:text-white"
              onClick={() => handleSelect(key)}
            >
              {values}
            </button>
          ))}
        </div>
      }
    </>
  )
}
export default FilterModal