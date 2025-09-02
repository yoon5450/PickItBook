import RouletteWheel from "@/Page/Roulette/Components/RouletteWheel";
import { useMemo } from "react";

type Book = {
  src: string;
  alt: string;
};

interface Props {
  books: Book[];
}

function MainRoulette({ books }: Props) {
  const memoizedBooks = useMemo(() => books, [books]);
  return (
    <>
      <RouletteWheel
        isStart={false}
        books={memoizedBooks}
        duration={20}
        pinReaction={{
          enabled: true,
          minKick: 5,
          maxKick: 10,
          duration: 1.5,
          ease: "elastic.out",
          elasticStrength: 2,
          elasticPower: 0.8
        }}
        isMainPage={true}
      />
    </>
  );
}
export default MainRoulette;
