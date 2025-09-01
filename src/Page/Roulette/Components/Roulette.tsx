import { useState } from "react";
import RouletteButton from "./RouletteButton";
import RouletteWheel from "./RouletteWheel";
import type { TestBook } from "@/@types/global";


interface Props {
  books: TestBook[],
  setPickBook?: React.Dispatch<React.SetStateAction<TestBook | null>>;
  setIsOpenPickBook?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Roulette({ books, setPickBook, setIsOpenPickBook }: Props) {
  const [isStart, setIsStart] = useState<boolean>(false); // 버튼 눌렀는지
  const [isWorking, setIsWorking] = useState<boolean>(false); // 룰렛이 작동중인지

  return (
    <>
      <RouletteWheel isStart={isStart} books={books} setPickBook={setPickBook} setIsWorking={setIsWorking} setIsOpenPickBook={setIsOpenPickBook} />
      <RouletteButton setIsStart={setIsStart} isWorking={isWorking} />
    </>
  )
}
export default Roulette






