import { useUserMissions } from "@/api/useUserMissions";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState, useMemo } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import tw from "@/utils/tw";

interface Props {
  stylefire?: string;
  styleWrraper?: string;
  styleNickname?: string;
  styleMissionCount?: string;
  styleMiddle?: string;
  styleLevel?: string;
  styleProgress?: string;
  styleTrophy?: string;
  styleTop?: string;
}

export default function Progress({
  stylefire = "",
  styleWrraper = "",
  styleNickname = "",
  styleMissionCount = "",
  styleMiddle = "",
  styleLevel = "",
  styleProgress = "",
  styleTrophy = "",
  styleTop = "",
}: Props) {
  const { user } = useAuthStore();
  const { nickname, fetchUser } = useProfileStore();
  const { data, isLoading, error } = useUserMissions(user?.id ?? "");
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [showIcons, setShowIcons] = useState(false);

  const progressPercent = data?.progressPercent ?? 0;
  const level = data?.level ?? 0;
  const missions = data?.missions ?? [];
  const completedCount = missions.filter((m) => m.completed).length;

  useEffect(() => {
    if (user?.id) fetchUser(user.id);
  }, [user?.id, fetchUser]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAnimatedPercent(progressPercent);
      setTimeout(() => setShowIcons(true), 1500);
    });
    return () => cancelAnimationFrame(id);
  }, [progressPercent]);

  // 불 아이콘 갯수 계산 (보라 25 / 노랑 5 / 빨강 1)
  const { purple, yellow, red } = useMemo(() => {
    const PURPLE_UNIT = 25;
    const YELLOW_UNIT = 5;
    const CAP = 5;

    let p = Math.floor(completedCount / PURPLE_UNIT);
    let y = Math.floor((completedCount % PURPLE_UNIT) / YELLOW_UNIT);
    let r = completedCount % YELLOW_UNIT;

    // 최대 CAP개까지만 표시 (우선 제거: 빨강 → 노랑 → 보라)
    let overflow = p + y + r - CAP;
    if (overflow > 0) {
      const trim = (n: number) => {
        const t = Math.min(n, overflow);
        overflow -= t;
        return n - t;
      };
      r = trim(r);
      y = trim(y);
      p = trim(p);
    }

    return { purple: p, yellow: y, red: r };
  }, [completedCount]);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!data) return null;


const wrapperClass = styleWrraper;



  return (
    <div
      className={tw(
        // 너비는 부모 컨테이너가 책임지도록: w-full만 사용
        "w-full rounded-xl px-4 md:px-6 py-6 shadow-md relative bg-white/70",
        wrapperClass
      )}
    >
      {/* 상단: 좌측 인사 / 우측 (미션 수 + 아이콘) */}
      <div
        className={tw(
          "flex flex-col md:flex-row md:items-start md:justify-between gap-3",
          styleTop
        )}
      >
        <div className={tw("text-[28px] font-bold", styleNickname)}>
          Hello as {nickname ?? "Any"} !
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className={tw("text-sm font-medium", styleMissionCount)}>
            미션 {completedCount}개 클리어
          </div>

          {/* 불 아이콘 줄: 높이 고정으로 레이아웃 점프 방지 */}
          <div
            className={tw(
              "flex items-center gap-1 min-h-[28px] transition-opacity duration-700",
              showIcons ? "opacity-100" : "opacity-0",
              stylefire
            )}
            aria-label={`연속 클리어 아이콘: 보라 ${purple}개, 노랑 ${yellow}개, 빨강 ${red}개`}
          >
            {Array.from({ length: purple }).map((_, i) => (
              <img key={`purple-${i}`} src="/fire_book_pup.svg" alt="purple streak (25)" className="w-7 h-7" />
            ))}
            {Array.from({ length: yellow }).map((_, i) => (
              <img key={`yellow-${i}`} src="/fire_book_yellow.svg" alt="yellow streak (5)" className="w-7 h-7" />
            ))}
            {Array.from({ length: red }).map((_, i) => (
              <img key={`red-${i}`} src="/fire_book.svg" alt="red streak (1)" className="w-7 h-7" />
            ))}
          </div>
        </div>
      </div>

      {/* 프로그래스 + LV + 트로피 */}
      <div className={tw("mt-6 flex items-center gap-3", styleMiddle)}>
        <div className="flex-1">
          <div
            className={tw(
              "w-full h-5 bg-gray-200 rounded-full overflow-hidden",
              styleProgress
            )}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Number(animatedPercent) || 0}
          >
            <div
              className="h-full bg-yellow-500 transition-all duration-1000 ease-out"
              style={{ width: `${animatedPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <span className={tw("text-sm font-semibold", styleLevel)}>LV.{level}</span>
          <img src="/trophy.svg" alt="trophy" className={tw("w-11 h-11", styleTrophy)} />
        </div>
      </div>
    </div>
  );
} 