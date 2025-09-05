// src/Page/Library/BadgeList.tsx
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserBadges } from "@/api/useUserBadges";
import BadgeModal from "./BadgeModal";

function BadgeList() {
  const { user } = useAuthStore();
  const { data: badges = [], isLoading, error } = useUserBadges(user?.id ?? "");
  const [open, setOpen] = useState(false);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;

  // 활성화(획득한) 배지 필터
  const activeBadges = badges.filter((b) => b.completed);
  const previewBadges = activeBadges.slice(0, 4);

  return (
    <div className="w-full mb-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-semibold">Badge</div>
        {badges.length > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="text-sm text-gray-500 hover:underline"
          >
            더보기
          </button>
        )}
      </div>

      <div className="flex gap-10 ml-10 flex-wrap ">
        {previewBadges.map((b) => (
          <div
            key={b.code}
            className="flex flex-col items-center text-center w-20"
          >
            <img src={b.image} alt={b.name} className="w-25 h-25" />
            <span className="mt-2 text-sm">{b.name}</span>
          </div>
        ))}

        {activeBadges.length === 0 && (
          <span className="text-sm text-gray-500">
            아직 획득한 배지가 없어요
          </span>
        )}
      </div>

      {open && <BadgeModal badges={badges} onClose={() => setOpen(false)} />}
    </div>
  );
}

export default BadgeList;
