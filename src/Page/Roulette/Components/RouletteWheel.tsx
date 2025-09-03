import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import type { PopularBookItem } from "@/@types/global";
import { getBookImageURLs } from "@/utils/bookImageUtils";
gsap.registerPlugin(useGSAP);

interface PinReactionConfig {
  enabled?: boolean; // 핀 반응 활성화 여부
  minKick?: number; // 최소 반응 강도
  maxKick?: number; // 최대 반응 강도
  duration?: number; // 핀 애니메이션 지속시간
  ease?: string; // 핀 애니메이션 이징
  elasticStrength?: number; // 탄성 강도 (elastic.out에서 사용)
  elasticPower?: number; // 탄성 파워 (elastic.out에서 사용)
}

interface Props {
  isStart: boolean, // 작동 시킬건지
  books: PopularBookItem[], // 책 데이터
  setPickBook?: React.Dispatch<React.SetStateAction<PopularBookItem | null>>;
  setIsWorking?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenPickBook?: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number; // 지속 시간
  ease?: string; // 가속도
  repeat?: number; // 반복횟수
  pinReaction?: PinReactionConfig; // 핀 반응 설정
  isMainPage?: boolean; // 메인페이지 여부
}

function RouletteWheel({
  isStart,
  books,
  setPickBook,
  setIsWorking,
  setIsOpenPickBook,
  duration = 8,
  ease = "power3.out",
  repeat = 0,
  pinReaction = {
    enabled: true,
    minKick: 4,
    maxKick: 18,
    duration: 0.35,
    ease: "elastic.out(1,0.5)",
    elasticStrength: 1,
    elasticPower: 0.5,
  },
  isMainPage = false,
}: Props) {

  const pinRef = useRef<HTMLImageElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const bookRefs = useRef<HTMLButtonElement[]>([]);
  const [pickBookIndex, setPickBookIndex] = useState<number | null>(null);
  const [prevIsbn, setPrevIsbn] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); 

  // 기본값으로 병합
  const pinConfig = {
    enabled: true,
    minKick: 3,
    maxKick: 18,
    duration: 0.35,
    ease: "elastic.out(1,0.5)",
    elasticStrength: 1,
    elasticPower: 0.5,
    ...pinReaction,
  };

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
      if (!pinConfig.enabled) return;

      const kick = gsap.utils.clamp(
        pinConfig.minKick,
        pinConfig.maxKick,
        gsap.utils.mapRange(
          0,
          25,
          pinConfig.minKick,
          pinConfig.maxKick,
          Math.abs(speed)
        )
      );

      // elastic ease가 아닌 경우 일반 ease 사용
      const easeToUse = pinConfig.ease.includes("elastic")
        ? `elastic.out(${pinConfig.elasticStrength},${pinConfig.elasticPower})`
        : pinConfig.ease;

      gsap.fromTo(
        pin,
        { rotation: -kick },
        {
          rotation: 0,
          duration: pinConfig.duration,
          ease: easeToUse,
          overwrite: "auto",
        }
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
  };

  // 메인페이지용 단순 회전 함수
  const runMainPageRoulette = () => {
    const wheel = wheelRef.current;
    const pin = pinRef.current;
    if (!wheel || !pin) return;

    gsap.set(pin, { transformOrigin: "50% 0%" });

    // 일정한 속도로 핀 튕기기
    const simulatedSpeed = 15;

    const kickPin = () => {
      if (!pinConfig.enabled) return;

      const kick = gsap.utils.clamp(
        pinConfig.minKick,
        pinConfig.maxKick,
        gsap.utils.mapRange(
          0,
          25,
          pinConfig.minKick,
          pinConfig.maxKick,
          simulatedSpeed
        )
      );

      const easeToUse = pinConfig.ease.includes("elastic")
        ? `elastic.out(${pinConfig.elasticStrength},${pinConfig.elasticPower})`
        : pinConfig.ease;

      gsap.fromTo(
        pin,
        { rotation: -kick },
        {
          rotation: 0,
          duration: pinConfig.duration,
          ease: easeToUse,
          overwrite: "auto",
        }
      );
    };

    // 무한 회전
    gsap.to(wheel, {
      rotation: 360,
      duration: duration,
      ease: "none",
      repeat: -1,
    });

    // 일정 간격으로 핀 튕기기
    const interval = setInterval(kickPin, (duration * 900) / books.length);

    // 클린업을 위해 ref에 저장
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = interval;
  };

   // === 버튼 클릭 여부에 따라 룰렛 실행 ===
  useEffect(() => {
    if (isMainPage) {
      // 메인페이지에서는 바로 단순 회전 시작
      runMainPageRoulette();
      return;
    }

    if (!isStart) return;
    runRoulette(); // 기존 복잡한 룰렛
  }, [isStart, isMainPage]);

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleOpenPickBook = (book: PopularBookItem) => {
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
                inert={index === pickBookIndex ? false : true}
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
                <img className="w-[100%] h-[100%] rounded-2xl object-cover" src={getBookImageURLs(book.isbn13)[0]} alt={`${book.bookname} 표지`} />
              </button>
            ))}
        </div>
      </div>
    </>
  )
}
export default RouletteWheel