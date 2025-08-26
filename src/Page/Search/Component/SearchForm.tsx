import { fetcher } from "@/api/fetcher";
import { makeSearchURL } from "@/constant/constant";
import React, { useId, useRef } from "react";
import Swal from "sweetalert2";
import { useSearchStore } from "../Store/useSearchStore";
import type { BookItemType } from "@/@types/global";
import { BiSearch } from 'react-icons/bi';

function SearchForm() {
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setBookList = useSearchStore((s) => s.setSearchData);

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
      cur.style.height = "auto";
      cur.style.height = `${cur.scrollHeight}px`;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const textarea = textareaRef.current;
    const keyword = textarea ? textarea.value : "";

    if (!keyword) {
      Swal.fire("검색어를 입력해주세요.");
      return;
    }

    const bookRawData = await fetcher(makeSearchURL(keyword, 1).href);
    setBookList(
      bookRawData.response.docs.map((item: { doc: BookItemType }) => item.doc)
    );
  }

  return (
    <div className="w-full px-22 py-4">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center bg-white h-14 px-4 rounded-2xl"
      >
        <label className="a11y" id={textareaId}>
          검색창
        </label>
        <textarea
          className="resize-none text-xl bg-white w-[90%] focus:outline-0"
          rows={1}
          name={textareaId}
          id={textareaId}
          ref={textareaRef}
          onInput={handleInputText}
          onKeyDown={handleTextKeydown}
          placeholder="검색어를 입력하세요"
        />
        <button type="submit" className="cursor-pointer w-fit"><BiSearch height='80px'/></button>
      </form>
    </div>
  );
}
export default SearchForm;
