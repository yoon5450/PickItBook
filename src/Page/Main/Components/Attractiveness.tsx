import PickImage from "/main/pick_img.png";
import ItImage from "/main/it_img.png";
import BookImage from "/main/book_img.png";

const Attractiveness = () => {
  return (
    <section className="py-[50px] md:py-20 border-b border-primary-black">
      <div className="w-[1200px] max-[1250px]:w-full m-auto max-[1250px]:px-5">
        <h2 className="relative text-2xl md:text-3xl text-center text-primary-black font-semibold pb-2 mb-[30px] md:mb-16 before:absolute  before:content-[''] before:inline-block before:w-[50px] before:h-0.5 before:bg-primary before:left-[50%] before:-translate-[50%] before:bottom-0">
          <span className="font-accent">PickItBook</span>만의 매력
        </h2>
        <ul className="flex flex-col md:flex-row">
          <li className="relative mb-6 md:mb-0 md:pr-7 md:mr-7 after:absolute md:after:content-[''] after:content-none after:inlin-block after:w-[1px] after:h-[78%] after:bg-gray-300 after:right-0 after:top-0">
            <figure className="mb-6">
              <img className="w-full" src={PickImage} alt="" />
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
          <li className="relative mb-6 md:mb-0 md:pr-7 md:mr-7 after:absolute md:after:content-[''] after:content-none after:inlin-block after:w-[1px] after:h-[78%] after:bg-gray-300 after:right-0 after:top-0">
            <figure className="mb-6">
              <img className="w-full" src={ItImage} alt="" />
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
              <img className="w-full" src={BookImage} alt="" />
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
  );
};
export default Attractiveness;
