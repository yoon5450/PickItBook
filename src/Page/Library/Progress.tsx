import { useUserMissions } from "@/api/useUserMissions";
import { useAuthStore } from "@/store/useAuthStore";

export default function Progress() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useUserMissions(user?.id ?? "");

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!data) return null;

  const { totalScore, level, progressPercent } = data;

  return (
    <div className="w-full max-w-[600px] mx-auto mt-6">
      <div className="flex justify-between mb-2 text-sm font-medium">
        <span>Lv. {level}</span>
        <span>{totalScore}점</span>
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-right text-xs mt-1">
        다음 레벨까지 {100 - progressPercent}점 남음
      </p>
    </div>
  );
}
