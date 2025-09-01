import supabase from "@/utils/supabase";
import type { SetReviewType } from "./useReviewFetching";

// 메서드로 callback 관리
export const reviewRepo = {
  setReviewWithFile: async ({
    isbn13,
    title,
    content,
    score,
    uid,
    image_file,
  }: SetReviewType) => {
    const pathArr = [];
    const now = Date.now();
    const path = `${uid}.review-${now}`;
    let image_url = undefined;

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
        image_url,
        title,
        content,
        score,
      })
      .select("*");

    // 에러가 있다면 취소
    // 왜 이렇게 짰는지 기억이 안 나는데. 배열별로 삭제해야되서 그런가
    if (dbError) {
      pathArr.forEach((path) => {
        supabase.storage.from("review_image").remove([path]);
      });
    }

    return data?.[0] ?? null;
  },
  getReview: async (p_isbn13: string, p_limit:number, p_offset:number) => {
    const { data, error } = await supabase.rpc('get_reviews_by_isbn', {
      p_isbn13,
      p_limit,
      p_offset,
    });

    if (error) throw new Error(`review Fetching err: ${error}`);

    return data ?? [];
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
