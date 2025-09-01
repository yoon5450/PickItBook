import { useState } from "react";
import RouletteButton from "./RouletteButton";
import RouletteWheel from "./RouletteWheel";

type Book = {
  src: string;
  alt: string;
}

interface Props {
  books: Book[],
  setPickBook?: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

function Roulette({ books, setPickBook }: Props) {
  const [isStart, setIsStart] = useState<boolean>(false); // 버튼 눌렀는지
  const [isWorking, setIsWorking] = useState<boolean>(false); // 룰렛이 작동중인지


  // 디버깅
  // useEffect(() => {
  //   // 룰렛 휠에 전달해서 애니메이션 시작하게
  //   if (isStart) {
  //     console.log('룰렛 작동 시작')
  //   } else if (!isStart) {
  //     console.log('버튼 비활성화')
  //   }
  //   if (isWorking) {
  //     console.log('룰렛 작동중')
  //   } else if (!isWorking) {
  //     console.log('룰렛 다 돌았음')
  //   }
  // }, [isStart, isWorking])

  return (
    <>
      <RouletteWheel isStart={isStart} books={books} setPickBook={setPickBook} setIsWorking={setIsWorking} />
      <RouletteButton setIsStart={setIsStart} isWorking={isWorking} />
    </>
  )
}
export default Roulette






