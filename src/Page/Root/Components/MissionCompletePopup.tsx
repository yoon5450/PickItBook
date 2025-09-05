import { useBookDetail } from "@/api/useBookDetail";
import { useGetMissionDetailByTemplateID } from "@/api/useGetMissionDetailByTemplateID";
import { useUserBadges } from "@/api/useUserBadges";
import ConfettiCongrats from "@/Components/ConfettiCongrats";
import Progress from "@/Page/Library/Progress";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useMemo } from "react";

interface Props {
  isbn13?: string
  missionCompletePopup: boolean
  missionTemplateID: string
  onClose: () => void;
}

function MissionCompletePopup({ isbn13, missionCompletePopup, missionTemplateID, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  // 미션 세부 정보 가져오기
  const {
    data: missionDetailData,
    isPending: isMissionDetailDataPending,
    error: missionDetailDataError
  } = useGetMissionDetailByTemplateID(missionTemplateID ?? '');
  console.log(missionDetailData?.[0].reward.code);

  // 미션에 관련된 책 제목 가져오기
  const {
    data: bookName,
    isPending: isBookNamePending,
    error: bookNameError
  } = useBookDetail(isbn13);

  // 뱃지 목록 가져오기
  const {
    data: badges,
    isPending: isBadgesPending,
    error: badgesError
  } = useUserBadges(user?.id ?? '');
  console.log(badges);

  // 달성한 미션의 뱃지 이미지 가져오기
  const filterBadge = badges?.filter((b) => b.code === missionDetailData?.[0].reward.code)
  const badgeImage = filterBadge?.[0].image;
  console.log('뱃지 이미지: ', badgeImage)

  // 미션 종류 분기
  const isOpen = useMemo(() => {
    if (!missionCompletePopup) return false;

    const kind = missionDetailData?.[0].kind;
    if (!kind) return false;
    if (kind === "achievement") return true;

    return !!bookName?.book.bookname;
  }, [missionCompletePopup, missionDetailData, bookName?.book.bookname])



  // 미션 팝업 배경 스크롤 방지 처리
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    }

  }, [isOpen])


  // 디버깅 로그
  if (isMissionDetailDataPending) console.log("미션 상세 정보 가져오는중...");
  if (isBookNamePending) console.log("책 정보 가져오는중...");
  if (isBadgesPending) console.log('뱃지 정보 가져오는중...');

  if (missionDetailDataError) console.error(missionDetailDataError, "미션 상세 정보 불러오기 실패");
  if (bookNameError && missionDetailData?.[0]?.kind !== "achievement") console.log("책 이름 가져오기 실패");
  if (badgesError) console.log('뱃지 정보 불러오기 실패');



  // 닫기 이벤트
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const kind = missionDetailData?.[0].kind



  return (
    missionDetailData &&
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm w-screen h-screen flex items-center justify-center" onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        <ConfettiCongrats onPointerDown={(e) => e.stopPropagation()} message="" count={301} />
        <div className="popup bg-pattern shadow-lg w-2/3 max-w-[500px] min-x-[300px] md:min-h-[600px] rounded-3xl"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="w-full h-full px-10 py-10 flex flex-col justify-between items-center">
            <Progress
              stylefire="hidden"
              styleWrraper="py-0 shadow-none mx-0 rounded-none px-2 sm:px-8"
              styleNickname=""
              styleMissionCount="md:absolute md:right-2"
              styleMiddle="mt-9"
              styleLevel="md:right-5 text-[9px] md:text-sm"
              styleProgress="mb-3 md:mb-10"
              styleTrophy="absolute right-0 w-8 h-8 bottom-2 md:bottom-8 md:w-11 md:h-11 md:ml-2 mb-0"
              styleTop='flex-col sm:flex-row justify-between items-center'
            />
            {
              kind === 'mission' ?
                (<>
                  {/* 폭죽 터지는 애니메이션이면 좋을듯 */}
                  <img className="w-20 md:w-30 h-fit pb-4" src="/missionComplete.png" alt="미션 완료 축하" />
                  <h1 className="text-primary-black text-lg sm:text-xl md:text-3xl font-bold pb-4 sm:pb-8">Congratulations!</h1>
                  <div className="font-medium text-sm md:text-xl pb-7 text-center md:pb-12 flex items-center flex-col break-keep">
                    <div>
                      <span>{bookName?.book.bookname}의<br /></span>
                      <span className="text-primary">{missionDetailData[0].name} &nbsp;</span>
                      <span>미션을 완료했습니다</span>
                    </div>
                  </div>
                </>) : (
                  <>
                    {/* 진강님 뱃지 이미지 유틸 사용 */}
                    <img className="w-20 md:w-30 h-fit pb-4" src={badgeImage} alt="미션 완료 축하" />
                    <h1 className="text-primary-black text-lg sm:text-xl md:text-3xl font-bold pb-4 sm:pb-8">Congratulations!</h1>
                    <div className="font-medium text-sm md:text-xl pb-7 text-center md:pb-12 flex items-center flex-col break-keep">
                      <div>
                        <span className="text-primary">{missionDetailData[0].name} &nbsp;</span>
                        <span>업적을 달성했습니다</span>
                      </div>
                    </div>
                  </>
                )

            }
            <button type="button" onClick={onClose} className="bg-primary w-full h-[40px] md:h-[60px] rounded-2xl text-white md:text-xl">확인</button>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
export default MissionCompletePopup