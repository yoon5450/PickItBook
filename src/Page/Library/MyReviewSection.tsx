import { useAuthStore } from "@/store/useAuthStore";
import supabase from "@/utils/supabase";
import type { MyReviewCardData } from "./MyReviewCard";
import MyReviewCard from "./MyReviewCard";
import { useGetMyReviewsWithCount } from "./useGetMyReviewsWithCount"; 
import Pagination from "./Pagination";
import { useState } from "react";
import type { Tables } from "@/@types/database.types";

const PAGE_SIZE = 3;
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
    (currentPage - 1) * PAGE_SIZE
  );

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

  return (
    <section className="w-full max-w-[540px] mx-auto">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-[20px] font-bold">My Review</h2>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-[196px] bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-[196px] bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      ) : mapped.length === 0 ? (
        <p className="text-gray-600">작성한 리뷰가 없습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {mapped.map((item) => (
              <MyReviewCard key={item.id} data={item} />
            ))}
          </div>

          <div className="mt-4">
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
