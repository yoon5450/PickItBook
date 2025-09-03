import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";
import type { Tables, Json } from "@/@types/supabase";

// 제네릭 JSON 유틸
type JsonOf<T> = T & Json;

// --- 도메인 타입들 ---
export type Reward = {
  type: "coin" | "badge" | "xp"; // 필요하면 확장
  amount: number;
};

export type MissionProgress = {
  count?: number;
  [key: string]: unknown;
};

export type Mission = {
  id: number;
  template_id: number;
  name: string;
  description: string;
  reward: Reward;
  completed: boolean;
  completed_at: string | null;
  progress: MissionProgress | null;
};

// --- Supabase Row + Join 결과 타입 ---
type UserTaskRow<
  TReward = Reward,
  TProgress = MissionProgress
> = Omit<Tables<"user_tasks">, "progress"> & {
  progress: JsonOf<TProgress> | null;
  task_templates: (Pick<
    Tables<"task_templates">,
    "name" | "description" | "reward"
  > & {
    reward: JsonOf<TReward>;
  }) | null;
};

// --- 패칭 함수 ---
async function fetchUserMissions(userId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from("user_tasks")
    .select(
      `
      id,
      template_id,
      completed,
      completed_at,
      progress,
      task_templates (
        name,
        description,
        reward
      )
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  if (!data) return [];

  return (data as UserTaskRow<Reward, MissionProgress>[]).map((item) => {
    const template = item.task_templates;

    return {
      id: item.id,
      template_id: item.template_id,
      name: template?.name ?? "",
      description: template?.description ?? "",
      reward: template?.reward ?? { type: "coin", amount: 0 },
      completed: item.completed ?? false,
      completed_at: item.completed_at,
      progress: item.progress,
    };
  });
}

// --- 레벨 계산 유틸 ---
function calculateLevel(totalScore: number) {
  const level = Math.floor(totalScore / 100);
  const progressPercent = totalScore % 100;
  return { level, progressPercent };
}

// --- 커스텀 훅 ---
export function useUserMissions(userId: string) {
  return useQuery({
    queryKey: ["missions", userId],
    queryFn: () => fetchUserMissions(userId),
    enabled: !!userId,
    select: (missions) => {
      const totalScore = missions
        .filter((m) => m.completed)
        .reduce((sum, m) => sum + m.reward.amount, 0);

      const { level, progressPercent } = calculateLevel(totalScore);

      return {
        missions,
        totalScore,
        level,
        progressPercent,
      };
    },
  });
}
