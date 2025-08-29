import { useEffect, useState } from "react"

interface Props {
  category: string[]
  isOpen: boolean
}

function FilterModal({ category, isOpen }: Props) {
  const [selectCategory, setSelectCategory] = useState<string | null>(null);
  // api 요청시 어떻게 하냐에 따라 문자 리팩터 해야할듯

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    setSelectCategory(target.textContent)
  }
  // active 됐을때 active 클래스를 어케 넣지? -> active대신 focus로 주면 된다

  // useEffect(() => {
  //   console.log(selectCategory)
  // }, [selectCategory])

  return (
    <>
      {
        isOpen &&
        <div className="flex flex-col justify-center items-center shadow-sm py-4 gap-2 rounded-xl bg-pattern">
          {category.map((item, index) => (
            <button
              type="button"
              key={index}
              aria-label={item}
              className=" 
                w-19 rounded-xl py-1 px-2
                hover:bg-primary/50 hover:text-white 
                focus:bg-primary focus:text-white"
              onClick={(e) => handleSelect(e)}
            >
              {item}
            </button>
          ))}
        </div>
      }
    </>
  )
}
export default FilterModal