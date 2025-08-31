import Hero from "./Components/Hero";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoopSlider from "./Components/LoopSlider";
import NewBook from "./Components/NewBook";
import Roulette from "./Components/Roulette";
import { useState } from "react";
import Attractiveness from "./Components/Attractiveness";
// import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const books = new Array(17)
  .fill(0)
  .map(() => ({ src: "main/hero_bg.png", alt: "책 표지" }));

const Main = () => {
  const [pickBook, setPickBook] = useState<HTMLDivElement | null>(null);

  return (
    <main className="w-full">
      <Hero />

      <NewBook />

      <LoopSlider />

      <Attractiveness />
      <section className="pt-[80px]">
        <h2 className="text-4xl text-center text-primary-black font-semibold">
          고민 끝, <span className="font-accent">PickItBook</span> 시작!
        </h2>
        <div className="relative flex justify-center h-[600px]">
          <Roulette books={books} setPickBook={setPickBook} />
        </div>
      </section>
    </main>
  );
};
export default Main;
