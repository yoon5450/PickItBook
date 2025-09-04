import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BookmarkItem, PopularBookItem } from "@/@types/global";
import { getBookImageURLs } from "@/Page/Main/utils/bookImageUtils";
gsap.registerPlugin(useGSAP);

interface Props {
  isStart: boolean, // 작동 시킬건지
  books: PopularBookItem[] | BookmarkItem[], // 책 데이터
  filterTap?: "장르" | "연령" | "추천" | null, // 필터 바뀌었는지
  setPickBook?: React.Dispatch<React.SetStateAction<PopularBookItem | BookmarkItem | null>>; // 뽑힌 책 설정
  setIsWorking?: React.Dispatch<React.SetStateAction<boolean>>; // 룰렛 작동중인지 설정
  setIsOpenPickBook?: React.Dispatch<React.SetStateAction<boolean>>; // 뽑힌 책 클릭했는지(책 팝업 열건지) 설정
  duration?: number; // 지속 시간
  ease?: string; // 가속도
  repeat?: number; // 반복횟수
}

function RouletteWheel({
  isStart,
  books,
  filterTap,
  setPickBook,
  setIsWorking,
  setIsOpenPickBook,
  duration = 8,
  ease = "power3.out",
  repeat = 0
}: Props) {

  // 1. 애니메이션용 ref
  const pinRef = useRef<HTMLImageElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const bookRefs = useRef<HTMLButtonElement[]>([]);

  // 2. 필터가 바뀌었을때 같은 책이 같은 위치에 등장하는 경우 스타일 예외처리를 위한 조건
  // 2-1. 이전의 뽑힌책 isbn 기록
  const [prevIsbn, setPrevIsbn] = useState<string | null>(null);
  // 2-2. 이전의 룰렛 돌힌 뒤 배치 기록
  const [prevBooksArrange, setPrevBooksArragne] = useState<string | null>(null);
  // 2-3. 현재 룰렛 배치 기록
  const booksArrange = useMemo(() => books?.map(b => b.isbn13).join('|'), [books])
  // 2-4. 클릭한 필터탭에 따라 조건 처리용 문자열 조합하기
  const acitveStyleCondition = `${filterTap ?? 'none'}|${booksArrange}`


  // 3. 룰렛 배치
  useGSAP(() => {
    if (!wheelRef.current) return;

    // 3-1. 배치용 좌표, 각도 계산
    const radius = wheelRef.current.offsetWidth / 2; // 반지름
    const centerX = radius; // 중심x
    const centerY = wheelRef.current.offsetHeight / 2; // 중심y
    const total = bookRefs.current.length; // 배치할 책 갯수 (=17)
    const slice = (2 * Math.PI) / total; // 각 책마다 위치할 각도

    // 3-2. 책 배치
    bookRefs.current.forEach((book, index) => {
      const rad = index * slice; // 책이 차지할 각도
      const x = radius * Math.sin(rad) + centerX; // 반지름 길이, 중심에 따라 배치될 X 좌표
      const y = -radius * Math.cos(rad) + centerY;// 반지름 길이, 중심에 따라 배치될 Y 좌표
      gsap.set(book, {
        rotation: `${rad}rad`, // 책 자체도 회전하게(정각도로 존재하지 않게)
        xPercent: -50, // 책 너비에 따른 좌표 보정
        yPercent: -50, // 책 너비에 따른 좌표 보정
        x,
        y,
      });
    });
  }, { scope: wheelRef, dependencies: [books.length], revertOnUpdate: true });

  // 4. 각도 보정
  // 여러 바퀴를 돌았을때 360 내에서 배치되도록
  const normalizeAngle = (deg: number) => {
    const r = deg % 360;
    return r < 0 ? r + 360 : r;
  }

  // 5. 핀 각도 계산 유틸 (핀 좌표 보정)
  const getPinOffsetDeg = (wheelEl: HTMLDivElement, pinEl: HTMLImageElement) => {
    const w = wheelEl.getBoundingClientRect();
    const p = pinEl.getBoundingClientRect();
    const cx = w.left + w.width / 2;
    const cy = w.top + w.height / 2;

    const pinTipX = p.left + p.width / 2;
    const pinTipY = p.bottom;

    const dx = pinTipX - cx;
    const dy = pinTipY - cy;
    const rad = Math.atan2(dx, -dy);
    return normalizeAngle(rad * 180 / Math.PI);
  };

  // 6. 룰렛 실행
  const runRoulette = () => {

    const wheel = wheelRef.current;
    const pin = pinRef.current;
    if (!wheel || !pin) return;

    const total = bookRefs.current.length;
    const sliceDeg = 360 / total;

    // 6-1. 핀 배치
    gsap.set(pin, { transformOrigin: "50% 0%" });

    // 6-1-2. 핀 튕기는 시점 계산을 위한 값 정의
    let prevAngle = Number(gsap.getProperty(wheel, "rotation")) || 0;
    const pinAngle = getPinOffsetDeg(wheel, pin);
    let prevIdx = Math.round(normalizeAngle(pinAngle - prevAngle) / sliceDeg) % total;


    // 6-1-3. 핀 튕기기 함수
    const kickPin = (speed: number) => {
      // 6-1-3-1. 룰렛 도는 속도에 따라 핀 튕김 정도 조절
      const kick = gsap.utils.clamp(3, 18, gsap.utils.mapRange(0, 25, 4, 18, Math.abs(speed)));
      gsap.fromTo(
        pin,
        { rotation: -kick },
        { rotation: 0, duration: 0.35, ease: "elastic.out(1,0.5)", overwrite: "auto" }
      );
    };


    // 6-2. 목표 각도(pick 될 책 좌표) 설정
    const cur = Number(gsap.getProperty(wheel, "rotation")) || 0;
    const curNorm = normalizeAngle(cur);

    const k = gsap.utils.random(0, total - 1, 1);    // 멈출 책 인덱스
    const targetCenterDeg = k * sliceDeg;            // 그 책의 중심 각도(너비의 중간에 멈추게)
    const want = normalizeAngle(pinAngle - targetCenterDeg);     // 목표 최종 각도
    const extraSpins = gsap.utils.random(3, 5, 1);   // 랜덤 회전수
    const offset = (want - curNorm + 360) % 360;
    const delta = extraSpins * 360 + offset;         // 총 회전 증가량(시계방향)


    // 6-3. 애니메이션 시작/끝 시 실행할 함수 설정
    const tl = gsap.timeline({
      // 6-3-1. 룰렛 버튼 비활성화
      onStart: () => setIsWorking?.(true),

      // 6-3-2. 룰렛 핀이 가리키는 책 도출
      onComplete: () => {
        setIsWorking?.(false);

        const finalRot = Number(gsap.getProperty(wheel, "rotation")) || 0;
        const norm = normalizeAngle(pinAngle - finalRot);
        const finalIdx = Math.abs(Math.round(norm / sliceDeg) % total);


        // 6-3-3. 책 하이라이팅 여부용
        const el = document.querySelector<HTMLButtonElement>(`.img[data-index="${finalIdx}"]`);
        if (!el || !el.dataset.isbn13) return;
        setPrevIsbn(el.dataset.isbn13)
        setPrevBooksArragne(acitveStyleCondition)
      },
    });

    // 6-4. 룰렛 회전
    tl.to(wheel, {
      rotation: `+=${delta}`,
      duration: duration,
      ease: ease,
      repeat: repeat,
      // 6-4-1. 룰렛이 실행되는 동안 핀 튕기기
      onUpdate: () => {
        const curAngle = Number(gsap.getProperty(wheel, "rotation")) || 0;
        const speed = curAngle - prevAngle;
        prevAngle = curAngle;

        // 중앙 기준으로 책 인덱스 계산 (가장 가까운 중앙)
        const idx = Math.round(normalizeAngle(pinAngle - curAngle) / sliceDeg) % total;
        if (idx !== prevIdx) {
          kickPin(speed);
          prevIdx = idx;
        }
      },
    });
  }

  // 7. 룰렛 실행 여부
  useEffect(() => {
    if (!isStart) return;
    runRoulette();
  }, [isStart])

  // 8. 룰렛 결과 전달 및 책 팝업 열지 여부를 결정
  const handleOpenPickBook = (book: PopularBookItem | BookmarkItem) => {
    setIsOpenPickBook?.(true);
    setPickBook?.(book);
  }

  // 9. 룰렛 돌렸을때, 돌리지 않았을때 스타일 구분
  const activeStyle = "img absolute top-0 left-0 h-50 w-33 rounded-2xl transition-all ease-in duration-300 shadow-book-pick"
  const inactiveStyle = "img absolute top-0 left-0 h-50 w-33 rounded-2xl transition-all shadow-book"
  const isActiveContext = prevBooksArrange === acitveStyleCondition


  return (
    <>
      <img ref={pinRef} className="absolute bottom-125 z-[9]" src="/pin.svg" alt="룰렛 핀" />

      <div className="wrapper absolute bottom-0 w-full h-[550px] overflow-hidden flex flex-row items-center justify-center">
        <div ref={wheelRef} className="wheel absolute top-30 w-[1000px] h-[1000px] origin-[50%_50%]">
          {
            books.map((book, index) => (
              <button
                inert={(prevIsbn === book.isbn13) && isActiveContext ? false : true}
                type="button"
                key={index}
                ref={(el) => { if (el) bookRefs.current[index] = el; }}
                data-index={index}
                data-isbn13={book.isbn13}
                onClick={() => handleOpenPickBook(book)}
                className={
                  !isStart && (prevIsbn === book.isbn13) && isActiveContext ? activeStyle : inactiveStyle
                }
              >
                <img className="w-[100%] h-[100%] rounded-2xl object-cover" src={getBookImageURLs(book.isbn13)[0]} alt='표지' />
              </button>
            ))}
        </div>
      </div>
    </>
  )
}
export default RouletteWheel