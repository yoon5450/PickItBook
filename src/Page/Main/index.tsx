import Hero from "./Components/Hero";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoopSlider from "./Components/LoopSlider";
import RecommendedBook from "./Components/RecommendedBook";
import Attractiveness from "./Components/Attractiveness";
import { Link } from "react-router";
import { getMockDataByCategory } from "./utils/mockData";
//import Loading from "@/Components/Loading";
import MainRoulette from "./Components/MainRoulette";
import { useMemo } from "react";
import WordCloud, { type WordData } from "./Components/WordCloud";
import Example from "./Components/Example";

gsap.registerPlugin(ScrollTrigger);

const Main = () => {
  const mockBooks = useMemo(
    () => getMockDataByCategory("all").slice(0, 24),
    []
  );

  // 샘플 데이터
  const sampleWords: WordData[] = [
    { text: "React", value: 100 },
    { text: "TypeScript", value: 95 },
    { text: "JavaScript", value: 90 },
    { text: "TailwindCSS", value: 85 },
    { text: "Node.js", value: 80 },
    { text: "Next.js", value: 75 },
    { text: "CSS", value: 70 },
    { text: "HTML", value: 65 },
    { text: "Vue.js", value: 60 },
    { text: "Angular", value: 55 },
    { text: "Svelte", value: 50 },
    { text: "GraphQL", value: 45 },
    { text: "REST API", value: 40 },
    { text: "MongoDB", value: 35 },
    { text: "PostgreSQL", value: 30 },
  ];
  // const sampleWords = useMemo(() => WordData, [WordData]);

  const books = useMemo(
    () =>
      mockBooks.map((book) => ({
        src: book.bookImageURL,
        alt: book.bookname,
      })),
    [mockBooks]
  );

  return (
    <main className="w-full">
      <Hero />

      <RecommendedBook />

      <LoopSlider />

      <Attractiveness />

      <section className="relative pt-[50px] md:pt-20">
        <div className="absolute left-[50%] bottom-[10%] -translate-x-[50%] inline-flex flex-col items-center gap-8">
          <h2 className="relative inline-block px-7 text-4xl text-center text-primary-black font-semibold">
            <span className="absolute left-0">
              <svg
                width="21"
                height="19"
                viewBox="0 0 21 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.92 17.44V18.04L4.52 18.72L0.52 16.72V8.88C0.52 7.09333 0.853333 5.58666 1.52 4.36C2.21333 3.10666 3.2 2.02667 4.48 1.12L8.48 3.12L9.68 4.24C10.32 2.72 11.4267 1.42666 13 0.359999L17 2.36L20.12 5.44C19.0533 6.08 18.3467 6.90667 18 7.92L20.4 9.12V17.32L12.96 17.96L11.92 17.44ZM13.32 7.76C13.32 6.66667 13.5067 5.76 13.88 5.04C14.2533 4.32 14.7733 3.76 15.44 3.36L12.92 0.879997C11.8 1.62667 10.92 2.6 10.28 3.8C9.66667 4.97333 9.36 6.41333 9.36 8.12V15.52L16 14.96V7.56L13.32 7.76ZM4.84 8.52C4.84 7.42667 5.02667 6.52 5.4 5.8C5.8 5.05333 6.33333 4.48 7 4.08L4.44 1.64C3.34667 2.38667 2.48 3.36 1.84 4.56C1.22667 5.73333 0.92 7.17333 0.92 8.88V16.28L7.52 15.68V8.28L4.84 8.52Z"
                  fill="#292929"
                />
              </svg>
            </span>
            고민 끝, <span className="font-accent">PickItBook</span> 시작!
            <span className="absolute right-0">
              <svg
                width="21"
                height="19"
                viewBox="0 0 21 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.28 15C10.64 16.5733 9.53333 17.8667 7.96 18.88L3.96 16.88L0.84 13.8C1.90667 13.1867 2.61333 12.3733 2.96 11.36L0.52 10.16V1.96L7.96 1.32L9 1.84V1.24L16.4 0.559999L20.4 2.56V10.4C20.4 12.1867 20.0533 13.7067 19.36 14.96C18.6933 16.1867 17.7333 17.24 16.48 18.12L12.48 16.12L11.28 15ZM9.4 1.6V9L12.08 8.76C12.08 9.85333 11.88 10.7733 11.48 11.52C11.1067 12.24 10.5867 12.8 9.92 13.2L12.48 15.64C13.5733 14.8667 14.4267 13.8933 15.04 12.72C15.68 11.5467 16 10.1067 16 8.4V0.999998L9.4 1.6ZM0.92 2.32V9.72L3.6 9.48C3.6 10.5733 3.41333 11.4933 3.04 12.24C2.66667 12.96 2.14667 13.52 1.48 13.92L4 16.4C5.12 15.6267 5.98667 14.6533 6.6 13.48C7.24 12.3067 7.56 10.8667 7.56 9.16V1.76L0.92 2.32Z"
                  fill="#292929"
                />
              </svg>
            </span>
          </h2>
          <Link to="/roulette">
            <button
              type="button"
              className="text-2xl text-white font-medium h-15 px-8 bg-primary rounded-2xl"
            >
              랜덤 룰렛 시작
            </button>
          </Link>
        </div>

        <div className="relative flex justify-center h-[600px] z-[-1]">
          <MainRoulette books={books} />
        </div>
      </section>

      <hr />
      {/* WordCloud 컴포넌트 사용 */}
      <div className="flex justify-center mb-8">
        <Example />
      </div>

      {/* <Loading /> */}
    </main>
  );
};
export default Main;
