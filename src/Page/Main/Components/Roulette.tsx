import RouletteWheel from "@/Page/Roulette/Components/RouletteWheel";
import { useState } from "react";

type Book = {
  src: string;
  alt: string;
};

interface Props {
  books: Book[];
  setPickBook?: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

function Roulette({ books }: Props) {
  const [isStart, setIsStart] = useState<boolean>(false); // 버튼 눌렀는지

  return (
    <>
      <RouletteWheel
        books={books}
        repeat={-1}
        isStart={true}
        duration={40} // 더 길게 (한 바퀴 도는데 20초)
        ease="none"
      />
    </>
  );
}
export default Roulette;
