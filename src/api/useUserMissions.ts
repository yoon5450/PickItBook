import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";
import type { Tables } from "@/@types/supabase";


export type Reward = {
  type: "coin" | "badge" | "xp";
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


async function fetchUserMissions(userId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from("user_tasks")
    .select("*, task_templates(*)")
    .eq("user_id", userId);

  if (error) throw error;
  if (!data) return [];

  return (data as (Tables<"user_tasks"> & { task_templates: Tables<"task_templates"> | null })[]).map(
    (item) => {
      const template = item.task_templates;

      return {
        id: item.id,
        template_id: item.template_id,
        name: template?.name ?? "",
        description: template?.description ?? "",
        reward: (template?.reward as Reward) ?? { type: "coin", amount: 0 },
        completed: item.completed ?? false,
        completed_at: item.completed_at,
        progress: (item.progress as MissionProgress) ?? null,
      };
    }
  );
}


function calculateLevel(totalScore: number) {
  const level = Math.floor(totalScore / 100);
  const progressPercent = totalScore % 100;
  return { level, progressPercent };
}



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
