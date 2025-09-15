// src/Page/Library/MyReviewSection.tsx
import { useAuthStore } from "@/store/useAuthStore";
import supabase from "@/utils/supabase";
import type { MyReviewCardData } from "./MyReviewCard";
import MyReviewCard from "./MyReviewCard";
import { useGetMyReviewsWithCount } from "./useGetMyReviewsWithCount";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import type { Tables } from "@/@types/database.types";

const PAGE_SIZE = 3;
const CARD_H = 196;            
const GAP = 16;                   
const LIST_MIN_H = PAGE_SIZE * CARD_H + (PAGE_SIZE - 1) * GAP;

const BUCKET = "review_image";

function toPublicUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(raw);
  return data?.publicUrl;
}

export default function MyReviewSection() {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetMyReviewsWithCount(
    user?.id ?? "",
    PAGE_SIZE,
    (currentPage - 1) * PAGE_SIZE,
     { enabled: !!user?.id } 
  )

  const rows = data?.data ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const mapped: MyReviewCardData[] =
    (rows as Tables<"review">[] | undefined)?.map((r) => ({
      id: r.id,
      create_at: r.created_at,
      content: r.content,
      score: r.score,
      imageUrl: toPublicUrl(r.image_url),
      like_count: r.like_count,
      comment_count: 0,
      uid: r.user_id,
      isbn13: r.isbn13,
    })) ?? [];

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <section className="w-full max-w-[540px] mx-auto">
      <header className="flex items-center justify-between mb-3">
        <div className="text-base font-bold mb-10">My Review List</div>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-4" style={{ minHeight: LIST_MIN_H }}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-[196px] bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : mapped.length === 0 ? (
        <div
          className="flex flex-col gap-4 items-center justify-center text-gray-600"
          style={{ minHeight: LIST_MIN_H }}
        >
          <p>작성한 리뷰가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4" style={{ minHeight: LIST_MIN_H }}>
            {mapped.map((item) => (
              <MyReviewCard key={item.id} data={item} />
            ))}

            {/* 유령 카드: 3개 미만일 때 빈 공간을 차지해 높이 고정 */}
            {Array.from({ length: Math.max(0, PAGE_SIZE - mapped.length) }).map((_, i) => (
              <div
                key={`ghost-${i}`}
                className="h-[196px] rounded-2xl opacity-0 pointer-events-none"
                aria-hidden
              />
            ))}
          </div>

          <div className="-mt-19">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              maxVisible={5}
            />
          </div>
        </>
      )}
    </section>
  );
}
