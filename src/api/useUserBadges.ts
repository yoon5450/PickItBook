// src/api/useUserBadges.ts
import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";
import type { Tables } from "@/@types/database.types";

export type Badge = {
  code: string;
  name: string;
  image: string;
  completed: boolean;
};

const BADGE_IMAGES: Record<string, string> = {
  reviewer_1: "/medal/medal-1.svg",
  reviewer_10: "/medal/medal-2.svg",
  reviewer_50: "/medal/medal-3.svg",
  summarizer_10: "/medal/medal-4.svg",
  summarizer_30: "/medal/medal-5.svg",
  hunter_10: "/medal/medal-6.svg",
  hunter_100: "/medal/medal-7.svg",
  collector_50: "/medal/medal-8.svg",
};

type BadgeReward = {
  code: string;
  type: "badge";
};

async function fetchUserBadges(userId: string): Promise<Badge[]> {
  const { data, error } = await supabase
    .from("user_tasks")
    .select("*, task_templates(*)")
    .eq("user_id", userId);

  if (error) throw error;
  if (!data) return [];

  return (data as (Tables<"user_tasks"> & { task_templates: Tables<"task_templates"> | null })[])
    .filter((item) => {
      const r = item.task_templates?.reward;
      return (
        r &&
        typeof r === "object" &&
        "type" in r &&
        (r as { type?: string }).type === "badge"
      );
    })
    .map((item) => {
      const reward = item.task_templates?.reward as BadgeReward;
      const code = reward.code ?? "default";

      return {
        code,
        name: item.task_templates?.name ?? "",
        image: BADGE_IMAGES[code] ?? "/medal/default.svg",
        completed: item.completed ?? false,
      };
    });
}

export function useUserBadges(userId: string) {
  return useQuery({
    queryKey: ["badges", userId],
    queryFn: () => fetchUserBadges(userId),
    enabled: !!userId,
  });
}
