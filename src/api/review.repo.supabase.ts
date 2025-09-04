import supabase from "@/utils/supabase";
import type { SetReviewType, UpdateReviewVars } from "./useReviewFetching";

export const reviewRepo = {
  /* ---------- 생성(Create) ---------- */
  setReviewWithFile: async ({
    isbn13,
    title,
    content,
    score,
    uid,
    image_file,
  }: SetReviewType) => {
    const pathArr: string[] = [];
    const now = Date.now();
    const path = `${uid}.review-${now}`;
    let image_url: string | undefined;

    if (image_file) {
      const ext = image_file.name.split(".").pop();
      const image_path = `${path}.${ext}`;
      pathArr.push(image_path);
      image_url = await uploadAndGetUrl(image_path, image_file, "review_image");
    }

    const { data, error: dbError } = await supabase
      .from("review")
      .insert({
        isbn13,
        user_id: uid,
        image_url,
        title,
        content,
        score,
      })
      .select("*");

    if (dbError) {
      // 실패하면 업로드한 이미지 제거
      pathArr.forEach((p) => {
        supabase.storage.from("review_image").remove([p]);
      });
      throw dbError;
    }

    return data?.[0] ?? null;
  },

  /* ---------- 조회(Read) ---------- */
  getReview: async (p_isbn13: string, p_limit: number, p_offset: number) => {
    const { data, error } = await supabase.rpc("get_reviews_by_isbn", {
      p_isbn13,
      p_limit,
      p_offset,
    });
    if (error) throw new Error(`review Fetching err: ${error.message}`);
    return data ?? [];
  },

  getReviewByUser: async (uid: string, limit: number, offset: number) => {
    const { data, error } = await supabase
      .from("review")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`review Fetching byUser err: ${error.message}`);
    return data ?? [];
  },

  /* ---------- 수정(Update) ---------- */
  updateReview: async ({
    id,
    content,
    score,
    new_image_file,
  }: UpdateReviewVars) => {
    let image_url: string | undefined;

    if (new_image_file) {
      // 기존 리뷰 가져오기 (image_url 확인용)
      const { data: oldData } = await supabase
        .from("review")
        .select("image_url, user_id")
        .eq("id", id)
        .single();

      // 기존 이미지 삭제
      if (oldData?.image_url) {
        const oldPath = extractPathFromUrl(oldData.image_url);
        if (oldPath)
          await supabase.storage.from("review_image").remove([oldPath]);
      }

      // 새 이미지 업로드
      const now = Date.now();
      const path = `${oldData?.user_id}.review-${now}`;
      const ext = new_image_file.name.split(".").pop();
      const image_path = `${path}.${ext}`;
      image_url = await uploadAndGetUrl(
        image_path,
        new_image_file,
        "review_image"
      );
    }

    const { data, error } = await supabase
      .from("review")
      .update({
        ...(content !== undefined ? { content } : {}),
        ...(score !== undefined ? { score } : {}),
        ...(image_url !== undefined ? { image_url } : {}),
      })
      .eq("id", id)
      .select("*");

    if (error) throw new Error(`review Update err: ${error.message}`);
    return data?.[0] ?? null;
  },

  /* ---------- 삭제(Delete) ---------- */
  deleteReview: async (id: number) => {
    const { data: oldData } = await supabase
      .from("review")
      .select("image_url")
      .eq("id", id)
      .single();

    // DB 삭제
    const { error } = await supabase.from("review").delete().eq("id", id);
    if (error) throw new Error(`review Delete err: ${error.message}`);

    // 이미지 삭제
    if (oldData?.image_url) {
      const oldPath = extractPathFromUrl(oldData.image_url);
      if (oldPath)
        await supabase.storage.from("review_image").remove([oldPath]);
    }

    return true;
  },

  getReviewsScore: async (isbns: string[]) => {
    const { data, error } = await supabase
      .from("v_review_stats")
      .select("*")
      .in("isbn13", isbns);

    if (error) throw new Error("getReviewsScore", error);

    return data;
  },
};

const uploadAndGetUrl = async (path: string, file: File, target: string) => {
  const [uploadResult, urlResult] = await Promise.all([
    supabase.storage.from(target).upload(path, file),
    supabase.storage.from(target).getPublicUrl(path),
  ]);
  if (uploadResult.error) throw uploadResult.error;
  return urlResult.data?.publicUrl;
};

const extractPathFromUrl = (url: string): string | null => {
  try {
    const parts = url.split("/review_image/");
    return parts[1] ?? null;
  } catch {
    return null;
  }
};
