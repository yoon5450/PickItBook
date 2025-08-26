import React, { useId, useRef, useState } from "react";
import Swal from "sweetalert2";
import { BiSearch, BiFilterAlt } from "react-icons/bi";
import type { SearchKey } from "@/@types/global";

interface Props {
  onSearch: ({ key, value }: { key: SearchKey; value: string }) => void;
  initialValue: string;
  disabled?: boolean;
}

function SearchForm({ onSearch, initialValue, disabled }: Props) {
  const [value, setValue] = useState(initialValue);
  const [searchKey, setSearchKey] = useState<SearchKey>("keyword");

  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setValue(cur.value);
      cur.style.height = "auto";
      cur.style.height = `${cur.scrollHeight}px`;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = value.trim();

    if (!v) {
      Swal.fire("검색어를 입력해주세요.");
      return;
    }

    onSearch({ key: searchKey, value: v });
  }

  return (
    <div className="w-full py-4">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center bg-white h-14 px-4 rounded-2xl gap-2"
      >
        <select
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value as SearchKey)}
        >
          <option value="keyword">키워드</option>
          <option value="title">도서명</option>
          <option value="author">저자</option>
        </select>
        <label className="a11y" id={textareaId}>
          검색창
        </label>
        <textarea
          className="resize-none bg-white w-[90%] focus:outline-0"
          rows={1}
          name={textareaId}
          id={textareaId}
          ref={textareaRef}
          onChange={handleInputText}
          onKeyDown={handleTextKeydown}
          placeholder="검색어를 입력하세요"
          value={value}
        />
        <button type="submit" className="cursor-pointer">
          <BiSearch size={32} />
        </button>
        <button type="button" disabled={disabled}>
          <BiFilterAlt size={32} />
        </button>
      </form>
    </div>
  );
}
export default SearchForm;
