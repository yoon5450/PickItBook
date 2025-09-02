// import { useEffect } from "react"
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
}

function FilterModal({ isOpen, text, category, setSearchParam }: Props) {

  // 모달을 닫았을때는 인기작 전체에서 렌더링 되게끔 SearchParam 비우기
  // 비우니까 pickBook 모달을 열때는 얘를 닫아야하는데 그럼 책 정보가 꼬이는 현상 발생 .. ㅎ
  // useEffect(() => {
  //   if (!isOpen) { setSearchParam(null) }
  // }, [isOpen])

  const handleSelect = (key: string) => {
    // 여기에 서치파람을 비우는걸 넣었더니 isOpen 이 바꼈는지에 따라 작동 하는게 아니라 반영이 안됨 이전 값이 유지되게됨
    setSearchParam([{
      key: text,
      value: key
    }])

    // key가 all일때 인기작 전체
    if (key === 'all') setSearchParam(null)

    // bookmark일때는 supabase에서 유저가 북마크한거 가져오기(usePopularBookFetching 실행이 안돼야함)
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