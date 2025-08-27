import { useState, useRef, useEffect } from "react";
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";
import { gsap } from "gsap";

const NewBook = () => {
  const [activeTab, setActiveTab] = useState(0);
  const swiperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);

  // 탭 데이터
  const tabs = [
    { id: 0, label: "카테고리1", category: "popular" },
    { id: 1, label: "카테고리2", category: "new" },
    { id: 2, label: "카테고리3", category: "recommended" },
    { id: 3, label: "카테고리4", category: "recommended" },
    { id: 4, label: "카테고리5", category: "recommended" },
    { id: 5, label: "카테고리6", category: "recommended" },
    { id: 6, label: "카테고리7", category: "recommended" },
    { id: 7, label: "카테고리8", category: "recommended" },
    { id: 8, label: "카테고리9", category: "recommended" },
  ];

  // 각 탭별 슬라이드 데이터 (여러 슬라이드로 구성)
  const slideData = {
    popular: [
      // 첫 번째 슬라이드
      [
        { title: "그냥 하는 사람", author: "정철원", color: "bg-blue-100" },
        {
          title: "50년 후에는 어떻게 살 것인가",
          author: "이영희",
          color: "bg-blue-100",
        },
        { title: "DBR 디자인", author: "편집부", color: "bg-blue-100" },
        { title: "최애의 칠리", author: "김영수", color: "bg-blue-100" },
        { title: "편안함의 습격", author: "박민호", color: "bg-blue-100" },
        {
          title: "분야를 아끼는 11궁의 표계법칙",
          author: "홍길동",
          color: "bg-blue-100",
        },
      ],
      // 두 번째 슬라이드
      [
        {
          title: "트렌드 코리아 2024",
          author: "김난도",
          color: "bg-blue-100",
        },
        { title: "불편한 편의점", author: "김호연", color: "bg-blue-100" },
        {
          title: "달러구트 꿈 백화점",
          author: "이미예",
          color: "bg-blue-100",
        },
        { title: "세이노의 가르침", author: "세이노", color: "bg-blue-100" },
        { title: "아몬드", author: "손원평", color: "bg-blue-100" },
        { title: "코스모스", author: "칼 세이건", color: "bg-blue-100" },
      ],
    ],
    new: [
      [
        { title: "2024 신간 베스트", author: "작가1", color: "bg-blue-100" },
        { title: "최신 트렌드 도서", author: "작가2", color: "bg-blue-100" },
        { title: "화제의 신작", author: "작가3", color: "bg-blue-100" },
        { title: "올해의 발견", author: "작가4", color: "bg-blue-100" },
        { title: "신진 작가 특집", author: "작가5", color: "bg-blue-100" },
        { title: "미래를 읽는 책", author: "작가6", color: "bg-blue-100" },
      ],
    ],
    recommended: [
      [
        { title: "AI 시대의 독서", author: "김철수", color: "bg-blue-100" },
        { title: "디지털 문해력", author: "이영희", color: "bg-blue-100" },
        { title: "메타버스 가이드", author: "박민수", color: "bg-blue-100" },
        { title: "블록체인 혁명", author: "정수진", color: "bg-blue-100" },
        { title: "지속가능한 미래", author: "강영호", color: "bg-blue-100" },
        { title: "창의성의 과학", author: "윤미래", color: "bg-blue-100" },
      ],
    ],
  };

  // 현재 활성화된 탭의 데이터
  const getCurrentSlides = () => {
    const category = tabs[activeTab].category as keyof typeof slideData;
    return slideData[category];
  };

  // 탭 변경 시 슬라이드 애니메이션
  useEffect(() => {
    const slides = slideRefs.current;
    if (!slides.length) return;

    // 기존 슬라이드 페이드 아웃
    gsap.to(slides, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        // 새 슬라이드 페이드 인
        gsap.fromTo(
          slides,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: 0.2,
          }
        );
      },
    });
  }, [activeTab]);

  // Swiper 슬라이드 제어
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = getCurrentSlides().length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 자동 슬라이드
  // useEffect(() => {
  //   const interval = setInterval(nextSlide, 4000);
  //   return () => clearInterval(interval);
  // }, [totalSlides]);

  return (
    <section className="py-[80px] border-t border-primary-black">
      <div className="w-[1200px] m-auto">
        <h2 className="relative text-3xl text-center text-primary-black font-semibold pb-2 mb-[60px] before:absolute  before:content-[''] before:inline-block before:w-[50px] before:h-0.5 before:bg-primary before:left-[50%] before:-translate-[50%] before:bottom-0">
          따끈따끈 새로 들어온 책
        </h2>

        {/* 탭 메뉴 */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-none shadow-none border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentSlide(0);
                }}
                className={`px-8 py-4 font-medium transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swiper 컨테이너 */}
        <div className="relative">
          <div
            ref={swiperRef}
            className="flex transition-transform duration-500 ease-in-out overflow-hidden"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {getCurrentSlides().map((slideBooks, slideIndex) => (
              <div
                key={`${activeTab}-slide-${slideIndex}`}
                className="w-full flex-shrink-0"
              >
                <div className="grid grid-cols-6 gap-4">
                  {slideBooks.map((book, bookIndex) => (
                    <div
                      key={`${activeTab}-${slideIndex}-${bookIndex}`}
                      ref={(el) => {
                        if (el && slideIndex === 0)
                          slideRefs.current[bookIndex] = el;
                      }}
                      className="group cursor-pointer"
                    >
                      {/* 책 표지 */}
                      <div
                        className={`aspect-[3/4] ${book.color} mb-3 transition-all duration-300 group-hover:scale-105 flex flex-col justify-between p-4`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 네비게이션 버튼 */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-15 "
          >
            <CiCircleChevLeft size={40} className="text-primary-black" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-15"
          >
            <CiCircleChevRight size={40} className="text-primary-black" />
          </button>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center mt-6 gap-2">
          {getCurrentSlides().map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-black w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewBook;
