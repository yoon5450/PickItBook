import type { TestBook } from "@/@types/global";
import tw from "@/utils/tw";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react"


/**
 * 중복되는 style component css로 만들어서 처리해보기
 * 스타일 분리해보고도 코드 길면 컴포넌트 분리하기
 * 하이라이팅 스타일 수정하기
 * 책 닫힐때 스르륵 사라지게 애니메이션 넣기
 */

interface Props {
  pickBook: TestBook | null;
  isOpenPickBook: boolean;
  setIsOpenPickBook: React.Dispatch<React.SetStateAction<boolean>>;
}

const openBook = cva(
  'absolute origin-left transition-transform duration-1000 ease-in-out border border-2 border-gray-500 ',
  {
    variants: {
      intent: {
        cover: 'w-full h-full scale-[1.01] transform-[translateZ(2px)_rotateY(-2deg)] bg-yellow-500',
        pageLeft: 'w-full h-full bg-pattern transform-[translateZ(1px)_translateX(2px)_rotateY(0deg)]',
        pageRight: 'w-full h-full bg-pattern translate-x-2 rotate-y-0',
        coverEnd: 'w-full h-full scale-[1.01] transform-[translateX(10px)_rotateY(0deg)] bg-yellow-500'
      },
      isOpen: {
        true: '',
        false: ''
      }
    },
    // 책 열릴때 중앙정렬
    compoundVariants: [
      { intent: 'cover', isOpen: true, class: 'transform-[translateZ(0px)_rotateY(-180deg)]' },
      { intent: 'pageLeft', isOpen: true, class: 'transform-[translateZ(1px)_translateX(2px)_rotateY(-180deg)]' },
    ]
  }
)


function PickBook({ pickBook, isOpenPickBook, setIsOpenPickBook }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBookMark, setIsBookMark] = useState<boolean>(false);

  useEffect(() => {
    if (pickBook) console.log(pickBook)
    // 책 애니메이션
  }, [pickBook])

  // const calcRatioHeight = (width: number): number => {
  //   return Math.round((696 * width) / 473)
  // }

  const handleOpenBook = () => {
    console.log('책 열기')
    setIsOpen(prev => !prev);
  }

  const handleCloseBook = () => {
    console.log('책 닫기')
    setIsOpen(false);
    setIsOpenPickBook(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsOpenPickBook(false);

      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleBookMark = () => {
    setIsBookMark(prev => !prev);
  }
  // xl : 1280 lg : 1024 md : 768 sm : 640

  useEffect(() => {
    const app = document.getElementById('app-root'); // 페이지 본문 래퍼
    if (!app) return;
    if (isOpen) app.setAttribute('inert', '');
    else app.removeAttribute('inert');
    return () => app.removeAttribute('inert');
  }, [isOpen]);

  return (
    <>
      <h1 hidden>Pick Book</h1>
      {
        isOpenPickBook && (
          <div className="fixed inset-0 z-[1000]">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
              <section className="book w-screen h-screen flex flex-col items-center justify-center">
                <div className="container relative z-20 perspective-distant [perspective-origin:center] flex justify-center">
                  <div className={tw("book relative w-[320px] h-[470px] lg:w-[400px] lg:h-[588px] xl:w-[473px] xl:h-[696px] left-0 transform-3d transition-left duration-700 ease-in-out",
                    isOpen ? 'left-[160px] lg:left-[200px] xl:left-[236px]' : '')}>

                    <div className={tw(openBook({ intent: 'coverEnd', isOpen }), "coverEnd")}>
                      <img className="w-[100%] h-[100%]" src={pickBook?.src} alt={pickBook?.alt + '뒷면'} />
                    </div>

                    <div className="absolute w-3 h-full origin-left bg-gray-500 pageGap"></div>

                    <div className={tw(openBook({ intent: 'pageRight', isOpen }), "pt-20 pb-9 px-9 flex flex-col", "pageRight")}>
                      <button type="button" onClick={handleBookMark} className="absolute -top-2">
                        <img className="w-10" src={isBookMark ? "/bookmarkOn.svg" : "/bookmarkOff.svg"} alt="책갈피" />
                      </button>

                      <button type="button" onClick={handleCloseBook} className="absolute top-9 right-9">
                        <img src="/close.svg" alt="닫기" /></button>

                      <div className="flex flex-col gap-3 lg:gap-6 xl:gap-8">
                        <p className="font-semibold text-2xl text-primary-black pl-1">미션</p>
                        {/* 미션 map으로 렌더링하기 */}
                        <div className="w-full border border-gray-300 bg-white px-6 py-3 lg:px-7 lg:py-4 xl:px-8 xl:py-5 rounded-3xl flex flex-row justify-between gap-1" >
                          <div>
                            <p className="text-xs lg:text-sm xl:text-[16px]"><span className="text-primary">자몽살구클럽</span> 미션이 도착했어요!</p>
                            <p className="text-xs lg:text-sm xl:text-[16px]">이 책을 읽고 인상 깊은 구절을 남겨주세요</p>
                          </div>
                          <img className="w-5 lg:w-6 xl:w-8" src="/fire_book_yellow.svg" alt="책 미션" />
                        </div>
                        <div className="w-full bg-white px-6 py-3 lg:px-7 lg:py-4 xl:px-8 xl:py-5 rounded-3xl flex flex-col">
                          <p className="text-xs lg:text-sm xl:text-[16px]">오늘의 미션이 도착했어요!</p>
                          <p className="text-xs lg:text-sm xl:text-[16px]">이 책을 읽고 인상 깊은 구절을 남겨주세요</p>
                        </div>
                        <div className="w-full bg-white px-6 py-3 lg:px-7 lg:py-4 xl:px-8 xl:py-5 rounded-3xl flex flex-col">
                          <p className="text-xs lg:text-sm xl:text-[16px]">오늘의 미션이 도착했어요!</p>
                          <p className="text-xs lg:text-sm xl:text-[16px]">이 책을 읽고 인상 깊은 구절을 남겨주세요</p>
                        </div>
                        <div className="w-full bg-white px-6 py-3 lg:px-7 lg:py-4 xl:px-8 xl:py-5 rounded-3xl flex flex-col">
                          <p className="text-xs lg:text-sm xl:text-[16px]">오늘의 미션이 도착했어요!</p>
                          <p className="text-xs lg:text-sm xl:text-[16px]">이 책을 읽고 인상 깊은 구절을 남겨주세요</p>
                        </div>
                      </div>
                    </div>

                    <div className={tw(openBook({ intent: 'pageLeft', isOpen }), "pt-13 pb-9 px-9", "pageLeft")}>
                      <div className="-rotate-y-180 flex flex-col gap-2">
                        <p className="font-semibold text-3xl text-primary-black">자몽살구클럽</p>
                        <div className="flex flex-row gap-1 pb-2">
                          {
                            Array.from({ length: 5 }).map((_i, index) => (
                              <img key={index} src="/star.svg" alt="별점" />
                            ))
                            // 소숫점은 어떻게 처리할지?
                          }
                        </div>
                        <div className="flex flex-row flex-wrap gap-4 lg:gap-6 pb-2">
                          <div className="flex items-center w-fit px-5 py-2.5 bg-stone-200 rounded-2xl" aria-label="작가">
                            <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">한로로</p></div>
                          <div className="font-semibold text-primary-black flex items-center w-fit px-5 py-2.5 bg-stone-200 rounded-2xl" aria-label="출판사">
                            <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">어센딩</p></div>
                          <div className="font-semibold text-primary-black flex items-center w-fit px-5 py-2.5 bg-stone-200 rounded-2xl" aria-label="장르">
                            <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">소설</p></div>
                        </div>
                        <div>
                          <p className="text-xs lg:text-sm xl:text-[16px]">
                            {/* 텍스트 overflow 처리하기 ... 으로 뜨게(css 제공하는 속성 이용) */}
                            로렘 입섬은 인쇄 및 조판 산업의 더미 텍스트일 뿐입니다. 로렘 입섬은 1500년대부터 업계의 표준 더미 텍스트로 자리 잡았습니다. 당시 무명의 프린터가 활자 갤러리를 가져와 활자 표본 책을 만들기 위해 스크램블링을 했습니다. 그것은 5세기 동안만 살아남았을 뿐만 아니라 전자 조판으로 도약하면서 본질적으로 변하지 않았습니다. 1960년대에 Lorem Ipsum 구절이 포함된 Letraset 시트가 출시되면서 대중화되었고, 최근에는 Lorem Ipsum 버전을 포함한 Aldus PageMaker와 같은 데스크톱 퍼블리싱 소프트웨어와 함께 출시되었습니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={tw(openBook({ intent: 'cover', isOpen, }), "cover")}>
                      <button type='button' onClick={handleOpenBook} className="w-full h-full">
                        <img className="w-[100%] h-[100%]" src={pickBook?.src} alt={pickBook?.alt} />
                      </button>
                    </div>
                  </div>
                </div>
              </section >
            </div>
          </div>
        )
      }
    </>

  )
}
export default PickBook
