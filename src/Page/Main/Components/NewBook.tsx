import { useState, useRef, useEffect } from "react";
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";
import { gsap } from "gsap";
import tw from "@/utils/tw";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

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

// 각 탭별 책 데이터
const booksData = {
  popular: [
    { title: "그냥 하는 사람", author: "정철원", color: "bg-blue-100" },
    {
      title: "50년 후에는 어떻게 살 것인가",
      author: "이영희",
      color: "bg-green-100",
    },
    { title: "DBR 디자인", author: "편집부", color: "bg-purple-100" },
    { title: "최애의 칠리", author: "김영수", color: "bg-pink-100" },
    { title: "편안함의 습격", author: "박민호", color: "bg-yellow-100" },
    {
      title: "분야를 아끼는 11궁의 표계법칙",
      author: "홍길동",
      color: "bg-indigo-100",
    },
    { title: "트렌드 코리아 2024", author: "김난도", color: "bg-red-100" },
    { title: "불편한 편의점", author: "김호연", color: "bg-orange-100" },
    { title: "달러구트 꿈 백화점", author: "이미예", color: "bg-teal-100" },
    { title: "세이노의 가르침", author: "세이노", color: "bg-cyan-100" },
    { title: "아몬드", author: "손원평", color: "bg-lime-100" },
    { title: "코스모스", author: "칼 세이건", color: "bg-emerald-100" },
  ],
  new: [
    { title: "2024 신간 베스트", author: "작가1", color: "bg-rose-100" },
    { title: "최신 트렌드 도서", author: "작가2", color: "bg-violet-100" },
    { title: "화제의 신작", author: "작가3", color: "bg-amber-100" },
    { title: "올해의 발견", author: "작가4", color: "bg-slate-100" },
    { title: "신진 작가 특집", author: "작가5", color: "bg-stone-100" },
    { title: "미래를 읽는 책", author: "작가6", color: "bg-neutral-100" },
    { title: "혁신의 시대", author: "작가7", color: "bg-sky-100" },
    { title: "창작의 비밀", author: "작가8", color: "bg-fuchsia-100" },
  ],
  recommended: [
    { title: "AI 시대의 독서", author: "김철수", color: "bg-blue-200" },
    { title: "디지털 문해력", author: "이영희", color: "bg-green-200" },
    { title: "메타버스 가이드", author: "박민수", color: "bg-purple-200" },
    { title: "블록체인 혁명", author: "정수진", color: "bg-pink-200" },
    { title: "지속가능한 미래", author: "강영호", color: "bg-yellow-200" },
    { title: "창의성의 과학", author: "윤미래", color: "bg-indigo-200" },
    { title: "혁신 리더십", author: "한미래", color: "bg-red-200" },
    { title: "디지털 전환", author: "박혁신", color: "bg-orange-200" },
    { title: "미래 교육", author: "김교육", color: "bg-teal-200" },
  ],
};

const NewBook = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentBookSlide, setCurrentBookSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const tabSwiperRef = useRef(null);
  const bookSwiperRef = useRef(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // 모바일 해상도 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 현재 활성화된 탭의 책들
  const getCurrentBooks = () => {
    const category = tabs[activeTab].category as keyof typeof booksData;
    return booksData[category];
  };

  // 탭 인디케이터 애니메이션 (PC에서만 작동)
  const animateTabIndicator = (tabIndex: number) => {
    if (!tabIndicatorRef.current || !tabContainerRef.current || isMobile)
      return;

    const tabElements = tabContainerRef.current.querySelectorAll(".tab-button");
    const targetTab = tabElements[tabIndex] as HTMLElement;

    if (targetTab) {
      const containerRect = tabContainerRef.current.getBoundingClientRect();
      const tabRect = targetTab.getBoundingClientRect();

      const left = tabRect.left - containerRect.left;
      const width = tabRect.width;

      tabIndicatorRef.current.style.transform = `translateX(${left}px)`;
      tabIndicatorRef.current.style.width = `${width}px`;
      tabIndicatorRef.current.style.transition = "all 0.3s ease-out";
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    setCurrentBookSlide(0);

    // PC에서만 인디케이터 애니메이션
    if (!isMobile) {
      setTimeout(() => animateTabIndicator(tabId), 50);
    }
  };

  // 책 슬라이드 핸들러 (1개씩 이동)
  const handleBookSlide = (direction: "prev" | "next") => {
    const books = getCurrentBooks();
    const maxSlide = Math.max(0, books.length - 6);

    if (direction === "prev") {
      setCurrentBookSlide((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentBookSlide((prev) => Math.min(maxSlide, prev + 1));
    }
  };

  // 초기 인디케이터 설정
  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => animateTabIndicator(activeTab), 100);
    }
  }, [activeTab, isMobile]);

  return (
    <section className="py-20 border-t border-gray-800">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="relative text-3xl text-center text-gray-800 font-semibold pb-2 mb-16">
          따끈따끈 새로 들어온 책
          <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-12 h-0.5 bg-blue-600"></span>
        </h2>

        {/* 탭 메뉴 */}
        <div className="relative mb-8">
          <div
            ref={tabContainerRef}
            className="border-b border-gray-300 relative"
          >
            {/* PC: 고정 탭 레이아웃 */}
            {!isMobile ? (
              <>
                {/* 애니메이션 인디케이터 */}
                <div
                  ref={tabIndicatorRef}
                  className="absolute bottom-0 h-0.5 bg-gray-800 z-10"
                />

                <div className="flex justify-between">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`tab-button py-3 px-4 text-lg transition-all duration-300 flex-1 ${
                        activeTab === tab.id
                          ? "text-gray-800 font-medium"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* 모바일: Swiper 탭 레이아웃 */
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-3 px-6 text-lg transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-gray-800 font-medium border-b-2 border-gray-800"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 책 슬라이더 */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${(currentBookSlide * 100) / 6}%)`,
              }}
            >
              {getCurrentBooks().map((book, index) => (
                <div
                  key={`${activeTab}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: "calc(100% / 6)" }}
                >
                  <div className="group cursor-pointer px-2">
                    {/* 책 표지 */}
                    <div
                      className={`aspect-[3/4] ${book.color} mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg rounded-lg flex flex-col justify-between p-4 border border-gray-200`}
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600">{book.author}</p>
                      </div>
                      <div className="flex justify-center items-center h-16 bg-white/50 rounded">
                        <span className="text-xs text-gray-500">책 표지</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <button
            onClick={() => handleBookSlide("prev")}
            disabled={currentBookSlide === 0}
            className={`book-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 transition-all duration-200 ${
              currentBookSlide === 0
                ? "opacity-30 cursor-not-allowed"
                : "opacity-100 hover:scale-110"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border">
              <CiCircleChevLeft size={24} className="text-gray-700" />
            </div>
          </button>

          <button
            onClick={() => handleBookSlide("next")}
            disabled={
              currentBookSlide >= Math.max(0, getCurrentBooks().length - 6)
            }
            className={`book-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 transition-all duration-200 ${
              currentBookSlide >= Math.max(0, getCurrentBooks().length - 6)
                ? "opacity-30 cursor-not-allowed"
                : "opacity-100 hover:scale-110"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border">
              <CiCircleChevRight size={24} className="text-gray-700" />
            </div>
          </button>
        </div>

        {/* 진행 인디케이터 */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{getCurrentBooks().length}권의 책</span>
            <span>•</span>
            <span>
              {currentBookSlide + 1}-
              {Math.min(currentBookSlide + 6, getCurrentBooks().length)} 표시 중
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};
export default NewBook;
