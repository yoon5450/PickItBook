
import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";
import type { Tables } from "@/@types/database.types";


export type Reward = { type: "coin" | "badge" | "xp"; amount: number };

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
  book?: { book_name: string; isbn13: string } | null;
};

async function fetchUserMissions(userId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from("user_tasks")
    .select("*, task_templates(*)")
    .eq("user_id", userId);

  if (error) throw error;
  if (!data) return [];

  // 1) 책 미션인 항목들의 isbn13 모으기 (scope_id가 isbn13로 저장됨)
  // const bookIsbns = Array.from(
  //   new Set(
  //     (data as Tables<"user_tasks">[] )
  //       .filter((row) => row.scope_type === "book" && !!row.scope_id)
  //       .map((row) => row.scope_id as string)
  //   )
  // );

  // 2) books 테이블에서 책 이름 매핑 가져오기
//   let bookMap = new Map<string, { book_name: string; isbn13: string }>();
//   if (bookIsbns.length > 0) {
//     const { data: books, error: bookErr } = await supabase
//       .from("books")
//       .select("isbn13, book_name")
//       .in("isbn13", bookIsbns);

//     if (bookErr) throw bookErr;
//     if (books) {
//       bookMap = new Map(
//         books.map((b) => [b.isbn13, { isbn13: b.isbn13, book_name: b.book_name }])
//       );
//       console.log("bookIsbns from user_tasks:", bookIsbns);
//     if (books) {
//       console.log("books fetched from table:", books);
//     }
//   }
// }

  // 3) 최종 매핑
  return (data as (Tables<"user_tasks"> & { task_templates: Tables<"task_templates"> | null })[])
    .map((item) => {
      const template = item.task_templates;

      // reward 정규화
      let reward: Reward = { type: "coin", amount: 0 };
      if (template?.reward) {
        try {
          reward =
            typeof template.reward === "string"
              ? (JSON.parse(template.reward) as Reward)
              : (template.reward as Reward);
        } catch {/* noop */}
      }

      

      // scope_type이 book이면 책 정보 붙이기
      // const book =
      //   item.scope_type === "book" && item.scope_id
      //     ? bookMap.get(item.scope_id)
      //     : null;
const book =
  item.scope_type === "book" && item.scope_id
    ? { isbn13: item.scope_id as string, book_name: "" } // 책 이름은 "" 처리
    : null;
          

      return {
        id: item.id,
        template_id: item.template_id,
        name: template?.name ?? "",
        description: template?.description ?? "",
        reward,
        completed: item.completed ?? false,
        completed_at: item.completed_at,
        progress: (item.progress as MissionProgress) ?? null,
        book,
      };
    });
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
        .reduce((sum, m) => sum + Number(m.reward?.amount ?? 0), 0);

      const { level, progressPercent } = calculateLevel(totalScore);

      return { missions, totalScore, level, progressPercent };
    },
  });
}
