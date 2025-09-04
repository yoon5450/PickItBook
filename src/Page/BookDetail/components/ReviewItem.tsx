import type { ReviewItemType } from "@/@types/global";
import { useToggleLike } from "@/api/useLikeFetching";
import { useGetReplyByParentId } from "@/api/useReviewReplyFetching";
import RatingStars from "@/Components/RatingStar";
import { timeFormatter } from "@/utils/timeFormatter";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";

type ReplyVars = { content: string; parent_id: number };

interface Props {
  item: ReviewItemType;
  isAnonymous?: boolean;
  uid?: string;
  setReplyCallback: (vars: ReplyVars) => void;
}

function ReviewItem({ item, isAnonymous, uid, setReplyCallback }: Props) {
  const { mutate, isPending } = useToggleLike(item.id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [reply, setReply] = useState<string>("");

  // 여기서 불러올 수밖에 없군?
  const { data: replyData } = useGetReplyByParentId(item.id, {
    enabled: isOpen,
  });

  // 엔터 눌렀을 때 검색 동작하도록
  const handleTextKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // submit 동작을 form에 위임시킴
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  // 입력시 줄바꿈 동작 ( 검색어 추천 또는 추가 처리 )
  function handleInputText() {
    const cur = textareaRef.current;

    if (cur) {
      setReply(cur.value);
      cur.style.height = "auto";
      cur.style.height = `${cur.scrollHeight}px`;
    }
  }

  const kst = timeFormatter(item.created_at);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReplyCallback({ parent_id: item.id, content: reply });
  };

  return (
    <li className="flex flex-col p-4 bg-white rounded-md gap-2">
      {/* 헤더 영역 */}
      <header className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img className="h-8 rounded-full" src={item.profile_image} alt="" />
          <span>{item.nickname}</span>
        </div>
        <div className="flex gap-4 text-gray-400">
          <span>{kst!.slice(0, 10) + " " + kst!.slice(11, 16)}</span>
          {item.user_id === uid && (
            <>
              <button type="button" className="cursor-pointer">
                삭제
              </button>
              <button type="button" className="cursor-pointer">
                편집
              </button>
            </>
          )}
        </div>
      </header>

      {/* 컨텐츠 영역 */}
      <section className="flex">
        {item.image_url && (
          <img
            src={item.image_url}
            alt="리뷰 이미지"
            className="max-w-40 object-cover"
          />
        )}
        <div>
          <p className="font-bold">{item.title}</p>
          <p>{item.content}</p>
        </div>
      </section>

      {/* 푸터 영역 */}
      <footer className="flex justify-between items-center">
        <RatingStars value={item.score} showValue />
        <div className="flex gap-4">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              // 없으면 undefined, 있으면 isAnonymous=false네 ㅋㅋ;
              if (isAnonymous === undefined)
                Swal.fire(
                  "로그인 필요",
                  "<div>로그인 이후에 이용할 수 있습니다.</div>"
                );
              else mutate();
            }}
          >
            <span className={item.liked_by_me ? "text-amber-400" : "bg-white"}>
              유용해요 {item.like_count}
            </span>
          </button>
          <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
            댓글 {item.comment_count}
          </button>
        </div>
      </footer>

      <div>
        {isOpen && (
          <div className="flex flex-col">
            <form
              action=""
              className="flex w-full gap-2"
              onSubmit={handleSubmit}
            >
              <textarea
                className="resize-none bg-white w-[90%] focus:outline-0 border border-background-gray rounded-md p-2 flex-1"
                rows={1}
                ref={textareaRef}
                onChange={handleInputText}
                onKeyDown={handleTextKeydown}
                placeholder="보낼 메세지를 입력하세요"
                value={reply}
              />
              <button
                className="bg-primary-black text-white hover:text-primary-black font-light
            box-border border border-primary-black px-2 py-1 rounded-md hover:bg-inherit transition "
                type="submit"
              >
                댓글 남기기
              </button>
            </form>
            <ul className="flex flex-col">
              {replyData?.map(({ id, content }) => (
                <li key={id}>{content}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
export default ReviewItem;
