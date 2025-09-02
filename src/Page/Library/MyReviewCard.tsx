import { useDeleteReview, useUpdateReview } from "@/api/useReviewFetching";
import RatingStars from "@/Components/RatingStar";
import { useState, type FC } from "react";
import { BiImageAdd } from "react-icons/bi";


export type MyReviewCardData = {
  id: number;
  create_at: string;
  content: string;
  score: number;
  imageUrl?: string;
  like_count?: number;
  comment_count?: number;
  uid?: string; 
  isbn13?: string;
};

const MyReviewCard: FC<{ data: MyReviewCardData }> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content);
  const [score, setScore] = useState(data.score);
  const [preview, setPreview] = useState<string | undefined>(data.imageUrl);
  const [file, setFile] = useState<File | undefined>();


  const updateReview = useUpdateReview({
    invalidate: { byUser: data.uid, byIsbn: data.isbn13 },
  });


  const deleteReview = useDeleteReview({
    invalidate: { byUser: data.uid, byIsbn: data.isbn13 },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = () => {
    updateReview.mutate({
      id: data.id,
      content,
      score,
      new_image_file: file,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      deleteReview.mutate(data.id);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-md border border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex gap-3">
        {preview && (
          <img
            src={preview}
            alt=""
            className="w-[78px] h-[116px] object-cover rounded-md flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* 날짜/액션 */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-gray-500">
              {new Date(data.create_at).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {!isEditing && (
                <button
                  type="button"
                  className="hover:text-red-600"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              )}
              <button
                type="button"
                className="hover:text-black"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "취소" : "편집"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={handleSave}
                >
                  저장
                </button>
              )}
            </div>
          </div>

          {/* 본문 */}
          {isEditing ? (
            <textarea
              className="mt-1 w-full border rounded-md p-2 text-sm "
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="리뷰 내용을 입력하세요..."
            />
          ) : (
            <div className="mt-1 h-[70px] flex items-center">
            <p
              className="
                 text-[14px] leading-relaxed text-black whitespace-pre-wrap break-words line-clamp-3
              "
            >
              {data.content}
            </p>
           </div> 
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-3 h-px w-full bg-gray-200" />

      {/* 하단: 별점/점수 + 메타 */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RatingStars
            value={score}
            max={5}
            size={20}
            inputMode={isEditing}
            setter={setScore}
          />
          <span className="text-sm text-gray-900">{score.toFixed(1)}</span>
          {isEditing && (
            <label className="ml-2 cursor-pointer">
              <BiImageAdd size={20} />
              <input type="file" className="hidden" onChange={handleFile} placeholder="내용을 입력하세요..." />
            </label>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <button type="button" className="hover:underline">
              유용해요 <span className="ml-1">{data.like_count ?? 0}</span>
            </button>
            <button type="button" className="hover:underline">
              댓글 <span className="ml-1">{data.comment_count ?? 0}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default MyReviewCard;