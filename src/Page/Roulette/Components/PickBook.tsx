import type { PopularBookItem } from "@/@types/global";
import { logicRpcRepo } from "@/api/logicRpc.repo.supabase";
import { useBookDetail } from "@/api/useBookDetail";
import { useGetMissionByISBN } from "@/api/useMissionsFetching";
import { useGetReview } from "@/api/useReviewFetching";
import RatingStars from "@/Components/RatingStar";
import { getBookImageURLs } from "@/Page/Main/utils/bookImageUtils";
import tw from "@/utils/tw";
import { cva } from "class-variance-authority";
import { useEffect, useMemo, useState } from "react"


/**
 * 중복되는 style component css로 만들어서 처리해보기
 * 스타일 분리해보고도 코드 길면 컴포넌트 분리하기
 * 하이라이팅 스타일 수정하기
 * 책 닫힐때 스르륵 사라지게 애니메이션 넣기
 * 
 * 리뷰 아예 등록 안 된 경우는 5점으로
 */

interface Props {
  pickBook: PopularBookItem | null;
  isOpenPickBook: boolean;
  setIsOpenPickBook: React.Dispatch<React.SetStateAction<boolean>>;
}

// type Missions = {
//   name: string
//   description: string
//   completed: boolean
//   reward: {
//     amount: number
//   }
// }

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
  // setIsOpenPickBook : 모달을 띄울지 여부 설정 함수
  // isOpenPickBook : 모달을 띄우는지 값이 불린으로 저장된 상태
  const [isOpen, setIsOpen] = useState<boolean>(false); // 모달이 떠 있는 상태에서 책을 펼쳤는지의 여부
  const [isBookMark, setIsBookMark] = useState<boolean>(false);
  // const currentUser = useProfileStore((s) => s.id);

  const isbn13 = pickBook?.isbn13 ?? undefined;
  const open = !!(isbn13 && isOpenPickBook);

  // isbn13이 없을수있다는 오류 잡기 (type narrowing 해주기)
  const { status: bookStatus, data: bookData } = useBookDetail(isbn13 ?? '');

  const { data: missionData } = useGetMissionByISBN(isbn13 ?? '');

  const missions = missionData ?
    missionData
      .map(({ name, description, completed, reward, }) => ({ name, description, completed, reward }))
      .sort((a, b) => b.reward.amount - a.reward.amount)
      .filter(m => !m.completed) : [];
  // console.log(missions);


  const { data: reviewData } = useGetReview(isbn13 ?? '')
  // const { data: reviewData } = useGetReview('9788936433598')
  // console.log('reviewData: ', reviewData);

  const ratingAvg = useMemo(() => {
    let summary = 0;
    if (!reviewData) return 0;
    reviewData.map((item) => (summary += item.score));
    return summary === 0
      ? summary
      : Math.ceil((summary / reviewData?.length) * 10) / 10;
  }, [reviewData]);
  // console.log('review average : ', ratingAvg)



  // 미션 insert 진행
  // 미션 할당됐는지 여부 확인해보기
  // 이미 이 책에 대해서 미션을 받았다면 또 안받아지도록 ->
  useEffect(() => {
    if (isOpenPickBook) {
      const insertMissionsToUser = () => {
        logicRpcRepo.setBundle(isbn13 ?? '');
        console.log('번들 호출');
      }
      insertMissionsToUser();
    }
  }, [isbn13, isOpenPickBook])



  useEffect(() => {
    setIsOpen(false);
    if (pickBook) console.log(pickBook)
  }, [isbn13])

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

  return (
    <>
      <h1 hidden>Pick Book</h1>
      {
        open &&
        (bookStatus === 'pending' || !bookData?.book ? (<p>로딩중</p>)
          : (
            <div key={isbn13} className="fixed inset-0 z-[1000]">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
                <section className="book w-screen h-screen flex flex-col items-center justify-center">
                  <div className="container relative z-20 perspective-distant [perspective-origin:center] flex justify-center">
                    <div className={tw("book relative w-[320px] h-[470px] lg:w-[400px] lg:h-[588px] xl:w-[473px] xl:h-[696px] left-0 transform-3d transition-left duration-700 ease-in-out",
                      isOpen ? 'left-[160px] lg:left-[200px] xl:left-[236px]' : '')}>

                      <div className={tw(openBook({ intent: 'coverEnd', isOpen }), "coverEnd")}>
                        <img
                          className="w-[100%] h-[100%]"
                          src={getBookImageURLs(bookData.book.isbn13)[0]}
                          alt={`${bookData.book.bookname} 뒷면`}
                        />
                      </div>

                      <div className="absolute w-3 h-full origin-left bg-gray-500 pageGap"></div>

                      <div className={tw(openBook({ intent: 'pageRight', isOpen }), "pt-13 lg:pt-20 pb-9 px-9 flex flex-col", "pageRight")}>
                        <button type="button" onClick={handleBookMark} className="absolute -top-2">
                          <img className="w-8 lg:w-10" src={isBookMark ? "/bookmarkOn.svg" : "/bookmarkOff.svg"} alt="책갈피" />
                        </button>

                        <button type="button" onClick={handleCloseBook} className="absolute top-9 right-9">
                          <img className="w-4 lg:w-6" src="/close.svg" alt="닫기" /></button>

                        <div className="flex flex-col gap-3 lg:gap-6 xl:gap-8">
                          <p className="font-semibold text-lg lg:text-2xl text-primary-black pl-1">미션</p>
                          <p className="text-xs lg:text-sm xl:text-[16px]"><span className="text-primary">{bookData.book.bookname}</span> 미션이 도착했어요!</p>
                          {/* 미션 map으로 렌더링하기 */}
                          {
                            missions.map(({ name, description }, index) => (
                              index === 0 ? (
                                <div key={index} className="w-full border border-gray-300 bg-white px-6 py-3 lg:px-7 lg:py-4 xl:px-8 xl:py-5 rounded-3xl flex flex-row justify-between gap-1" >
                                  <div>
                                    <p className="text-xs lg:text-sm xl:text-[16px]">{name}</p>
                                    <p className="text-xs lg:text-sm xl:text-[16px]">{description}</p>
                                  </div>
                                  <img className="w-5 lg:w-6 xl:w-8" src="/fire_book_yellow.svg" alt="책 미션" />
                                </div>
                              ) : (
                                <div key={index} className="w-full bg-white px-6 py-3 lg:px-7 lg:py-4 xl:px-8 xl:py-5 rounded-3xl flex flex-col">
                                  <p className="text-xs lg:text-sm xl:text-[16px]">{name}</p>
                                  <p className="text-xs lg:text-sm xl:text-[16px]">{description}</p>
                                </div>
                              )
                            ))
                          }

                        </div>
                      </div>

                      <div className={tw(openBook({ intent: 'pageLeft', isOpen }), "pt-13 pb-9 px-9", "pageLeft")}>
                        <div className="-rotate-y-180 flex flex-col gap-1">
                          <p className="font-semibold text-lg md:text-xl lg:text-2xl text-primary-black">{bookData.book.bookname}</p>
                          <RatingStars value={ratingAvg ? ratingAvg : 5} size={28} gap={2} />
                          <div className="flex flex-row flex-wrap gap-2.5 lg:gap-4 xl:gap-6 pb-2">
                            <div className="flex items-center w-fit px-3 py-1.5 lg:px-5 lg:py-2.5 bg-stone-200 rounded-2xl" aria-label="작가">
                              <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">{bookData.book.authors}</p></div>
                            <div className="font-semibold text-primary-black flex items-center w-fit px-3 py-1.5 lg:px-5 lg:py-2.5 bg-stone-200 rounded-2xl" aria-label="출판사">
                              <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">{bookData.book.publisher}</p></div>
                            {
                              bookData.book.class_nm.length === 0 ? null : (
                                <div className="font-semibold text-primary-black flex items-center w-fit px-3 py-1.5 lg:px-5 lg:py-2.5 bg-stone-200 rounded-2xl" aria-label="장르">
                                  <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">{bookData.book.class_nm}</p></div>
                              )
                            }
                            <div className="font-semibold text-primary-black flex items-center w-fit px-3 py-1.5 lg:px-5 lg:py-2.5 bg-stone-200 rounded-2xl" aria-label="isbn13">
                              <p className="text-xs lg:text-sm xl:text-[16px] font-semibold text-primary-black ">{isbn13}</p></div>
                          </div>
                          <div>
                            <p className="text-xs lg:text-sm xl:text-[16px] line-clamp-[9] lg:line-clamp-[12]">
                              {bookData.book.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={tw(openBook({ intent: 'cover', isOpen, }), "cover")}>
                        <button type='button' onClick={handleOpenBook} className="w-full h-full">
                          <img
                            className="w-[100%] h-[100%]"
                            src={getBookImageURLs(bookData.book.isbn13)[0]}
                            alt={`${bookData.book.bookname} 표지`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </section >
              </div>
            </div>
          )
        )
      }
    </>

  )
}
export default PickBook
