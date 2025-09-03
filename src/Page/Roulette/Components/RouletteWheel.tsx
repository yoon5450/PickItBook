import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import type { BookmarkItem, PopularBookItem } from "@/@types/global";
import { getBookImageURLs } from "@/Page/Main/utils/bookImageUtils";
gsap.registerPlugin(useGSAP);

interface Props {
  isStart: boolean, // 작동 시킬건지
  books: PopularBookItem[] | BookmarkItem[], // 책 데이터
  setPickBook?: React.Dispatch<React.SetStateAction<PopularBookItem | BookmarkItem | null>>;
  setIsWorking?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenPickBook?: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number; // 지속 시간
  ease?: string; // 가속도
  repeat?: number; // 반복횟수
}

function RouletteWheel({
  isStart,
  books,
  setPickBook,
  setIsWorking,
  setIsOpenPickBook,
  duration = 8,
  ease = "power3.out",
  repeat = 0
}: Props) {

  const pinRef = useRef<HTMLImageElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const bookRefs = useRef<HTMLButtonElement[]>([]);
  const [pickBookIndex, setPickBookIndex] = useState<number | null>(null);
  const [prevIsbn, setPrevIsbn] = useState<string | null>(null);

  // === 룰렛 배치 ===
  useGSAP(() => {
    if (!wheelRef.current) return;

    const radius = wheelRef.current.offsetWidth / 2;
    const centerX = radius;
    const centerY = wheelRef.current.offsetHeight / 2;
    const total = bookRefs.current.length;
    const slice = (2 * Math.PI) / total;

    bookRefs.current.forEach((book, index) => {
      const rad = index * slice;
      const x = radius * Math.sin(rad) + centerX;
      const y = -radius * Math.cos(rad) + centerY;
      gsap.set(book, {
        rotation: `${rad}rad`,
        xPercent: -50,
        yPercent: -50,
        x,
        y,
      });
    });
  }, { scope: wheelRef, dependencies: [books.length], revertOnUpdate: true });

  const normalizeAngle = (deg: number) => {
    const r = deg % 360;
    return r < 0 ? r + 360 : r;
  }



  // === 핀 끝 각도 계산 유틸 (핀 좌표 보정) ===
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

  // === 룰렛 실행 ===
  const runRoulette = () => {

    const wheel = wheelRef.current;
    const pin = pinRef.current;
    if (!wheel || !pin) return;

    const total = bookRefs.current.length;
    const sliceDeg = 360 / total;

    gsap.set(pin, { transformOrigin: "50% 0%" });

    let prevAngle = Number(gsap.getProperty(wheel, "rotation")) || 0;
    const pinAngle = getPinOffsetDeg(wheel, pin);
    let prevIdx = Math.round(normalizeAngle(pinAngle - prevAngle) / sliceDeg) % total;


    // --- 핀 튕기기 ---
    const kickPin = (speed: number) => {
      const kick = gsap.utils.clamp(3, 18, gsap.utils.mapRange(0, 25, 4, 18, Math.abs(speed)));
      gsap.fromTo(
        pin,
        { rotation: -kick },
        { rotation: 0, duration: 0.35, ease: "elastic.out(1,0.5)", overwrite: "auto" }
      );
    };


    // --- 목표 각도(pick 될 책 좌표) 설정 ---
    const cur = Number(gsap.getProperty(wheel, "rotation")) || 0;
    const curNorm = normalizeAngle(cur);

    const k = gsap.utils.random(0, total - 1, 1);    // 멈출 카드 인덱스
    const targetCenterDeg = k * sliceDeg;            // 그 카드의 중앙 각도
    const want = normalizeAngle(pinAngle - targetCenterDeg);     // 목표 최종 각도
    const extraSpins = gsap.utils.random(3, 5, 1);   // 회전수(랜덤)
    const offset = (want - curNorm + 360) % 360;
    const delta = extraSpins * 360 + offset;         // 총 회전 증가량(시계방향 고정)


    // --- 애니메이션 시작/끝 시 실행할 함수 설정 ---
    const tl = gsap.timeline({
      // --- 룰렛 버튼 비활성화 ---
      onStart: () => setIsWorking?.(true),

      // --- 룰렛 핀이 가리키는 책 도출 ---
      onComplete: () => {
        setIsWorking?.(false);

        const finalRot = Number(gsap.getProperty(wheel, "rotation")) || 0;
        const norm = normalizeAngle(pinAngle - finalRot);
        const finalIdx = Math.abs(Math.round(norm / sliceDeg) % total);


        // 책 하이라이팅 여부용
        const el = document.querySelector<HTMLButtonElement>(`.img[data-index="${finalIdx}"]`);
        if (!el || !el.dataset.isbn13) return;
        setPrevIsbn(el.dataset.isbn13)

        // 아래 두 줄과 기능도 디버깅용이라 추후에 지우기
        setPickBookIndex(finalIdx);
        console.log("[FINAL] index:", finalIdx);
      },
    });

    // --- 룰렛 회전 ---
    tl.to(wheel, {
      rotation: `+=${delta}`,
      duration: duration,
      ease: ease,
      repeat: repeat,
      // --- 룰렛이 실행되는 동안 핀 튕기기 ---
      onUpdate: () => {
        const curAngle = Number(gsap.getProperty(wheel, "rotation")) || 0;
        const speed = curAngle - prevAngle;
        prevAngle = curAngle;

        // 중앙 기준으로 인덱스 계산 (가장 가까운 중앙)
        const idx = Math.round(normalizeAngle(pinAngle - curAngle) / sliceDeg) % total;
        if (idx !== prevIdx) {
          kickPin(speed);
          prevIdx = idx;
        }
      },
    });
  }

  // === 버튼 클릭 여부에 따라 룰렛 실행 ===
  useEffect(() => {
    if (!isStart) return;
    runRoulette();
  }, [isStart])

  const handleOpenPickBook = (book: PopularBookItem | BookmarkItem) => {
    console.log('pickBookIndex : ', pickBookIndex)
    setIsOpenPickBook?.(true);
    setPickBook?.(book);
  }

  const activeStyle = "img absolute top-0 left-0 h-50 w-33 rounded-2xl transition-all ease-in duration-300 shadow-book-pick"
  const inactiveStyle = "img absolute top-0 left-0 h-50 w-33 rounded-2xl transition-all shadow-book"


  return (
    <>
      <img ref={pinRef} className="absolute bottom-125 z-[9]" src="/pin.svg" alt="룰렛 핀" />

      <div className="wrapper absolute bottom-0 w-full h-[550px] overflow-hidden flex flex-row items-center justify-center">
        <div ref={wheelRef} className="wheel absolute top-30 w-[1000px] h-[1000px] origin-[50%_50%]">
          {
            books.map((book, index) => (
              <button
                inert={(index === pickBookIndex) && (prevIsbn === book.isbn13) ? false : true}
                type="button"
                key={index}
                ref={(el) => { if (el) bookRefs.current[index] = el; }}
                data-index={index}
                data-isbn13={book.isbn13}
                onClick={() => handleOpenPickBook(book)}
                className={
                  (index === pickBookIndex) && !isStart && (prevIsbn === book.isbn13) ? activeStyle : inactiveStyle
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