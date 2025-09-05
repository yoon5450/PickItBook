import { useState } from "react";
import RouletteButton from "./RouletteButton";
import RouletteWheel from "./RouletteWheel";
import type { BookmarkItem, PopularBookItem } from "@/@types/global";

interface Props {
  books: PopularBookItem[] | BookmarkItem[],
  filterTap?: "장르" | "연령" | "추천" | null
  setPickBook?: React.Dispatch<React.SetStateAction<PopularBookItem | BookmarkItem | null>>;
  setIsOpenPickBook?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Roulette({ books, filterTap, setPickBook, setIsOpenPickBook }: Props) {
  const [isStart, setIsStart] = useState<boolean>(false); // 버튼 눌렀는지
  const [isWorking, setIsWorking] = useState<boolean>(false); // 룰렛이 작동중인지

  return (
    <>
      <RouletteWheel isStart={isStart} filterTap={filterTap} books={books} setPickBook={setPickBook} setIsWorking={setIsWorking} setIsOpenPickBook={setIsOpenPickBook} />
      <RouletteButton setIsStart={setIsStart} isWorking={isWorking} />
    </>
  )
}
export default Roulette






