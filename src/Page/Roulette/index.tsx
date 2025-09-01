import { useState } from "react";
import FilterButton from "./Components/FilterButton";
import FilterModal from "./Components/FilterModal";
import Roulette from "./Components/Roulette";
import PickBook from "./Components/PickBook";

const books = new Array(17).fill(0).map(() => ({ src: "/main/hero_bg.png", alt: "책 표지" }));


type Book = {
  src: string;
  alt: string;
}

function RandomRoulette() {
  const [isOpenAge, setIsOpenAge] = useState(false);
  const [isOpenRecomended, setIsOpenRecomended] = useState(false);
  const [pickBook, setPickBook] = useState<Book | null>(null);
  const [isOpenPickBook, setIsOpenPickBook] = useState<boolean>(false);

  return (
    <div className="relative w-full max-w-[1200px] h-screen mx-auto justify-items-center pt-17 py-2">

      <h1 hidden>Filter header</h1>
      <section className="absolute left-2 flex flex-row gap-6">
        <div className="z-10"><FilterButton text="장르" /></div>
        <div className="z-10">
          <FilterButton text="연령" setAction={setIsOpenAge} />
          <FilterModal isOpen={isOpenAge} category={["10대", "20대", "30대", "40대", "50대", "60대", "70대"]} />
        </div>
        <div className="z-10">
          <FilterButton text="추천" setAction={setIsOpenRecomended} />
          <FilterModal isOpen={isOpenRecomended} category={["인기작", "스크랩", "남성 추천", "여성 추천"]} />
        </div>
      </section>
      <div className="overflow-y-scroll">
        <PickBook pickBook={pickBook} isOpenPickBook={isOpenPickBook} setIsOpenPickBook={setIsOpenPickBook} />
      </div>
      <Roulette books={books} setPickBook={setPickBook} setIsOpenPickBook={setIsOpenPickBook} />



    </div>
  );
}

export default RandomRoulette;


