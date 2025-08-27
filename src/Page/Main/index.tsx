import PickImage from "/main/pick_img.png";
import ItImage from "/main/it_img.png";
import BookImage from "/main/book_img.png";
import Hero from "./Components/hero";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoopSlider from "./Components/LoopSlider";
import NewBook from "./Components/NewBook";
// import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Main = () => {
  return (
    <main className="w-full">
      <Hero />

      <NewBook />

      <LoopSlider />

      <section className="py-[80px] border-b border-primary-black">
        <div className="w-[1200px] m-auto">
          <h2 className="relative text-3xl text-center text-primary-black font-semibold pb-2 mb-[60px] before:absolute  before:content-[''] before:inline-block before:w-[50px] before:h-0.5 before:bg-primary before:left-[50%] before:-translate-[50%] before:bottom-0">
            <span className="font-accent">PickItBook</span>만의 매력
          </h2>
          <ul className="flex">
            <li className="relative pr-7 mr-7 after:absolute after:content-[''] after:inlin-block after:w-[1px] after:h-[78%] after:bg-gray-300 after:right-0 after:top-0">
              <figure className="mb-6">
                <img src={PickImage} alt="" />
                <figcaption className="a11y">Pick</figcaption>
              </figure>
              <div>
                <h3 className="text-[28px] leading-[0.6] text-primary-black font-accent mb-5 pl-3 border-b border-primary-black">
                  Pick
                </h3>
                <p className="text-xl text-primary-black text-center">
                  룰렛으로 재미있고 빠른 책 선정
                </p>
              </div>
            </li>
            <li className="relative pr-7 mr-7 after:absolute after:content-[''] after:inlin-block after:w-[1px] after:h-[78%] after:bg-gray-300 after:right-0 after:top-0">
              <figure className="mb-6">
                <img src={ItImage} alt="" />
                <figcaption className="a11y">It</figcaption>
              </figure>
              <div>
                <h3 className="text-[28px] leading-[0.6] text-primary-black font-accent mb-5 pl-3 border-b border-primary-black">
                  It
                </h3>
                <p className="text-xl text-primary-black text-center">
                  독서를 행동으로 이어주는 챌린지
                </p>
              </div>
            </li>
            <li>
              <figure className="mb-6">
                <img src={BookImage} alt="" />
                <figcaption className="a11y">Book</figcaption>
              </figure>
              <div>
                <h3 className="text-[28px] leading-[0.6] text-primary-black font-accent mb-5 pl-3 border-b border-primary-black">
                  Book
                </h3>
                <p className="text-xl text-primary-black text-center">
                  나만의 독서 데이터 확인
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="py-[80px]">
        <h2 className="text-4xl text-center text-primary-black font-semibold">
          고민 끝, <span className="font-accent">PickItBook</span> 시작!
        </h2>
      </section>
    </main>
  );
};
export default Main;
