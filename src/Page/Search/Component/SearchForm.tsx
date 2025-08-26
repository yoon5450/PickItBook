import React, {
  useId,
  useRef,
  useState,
} from "react";
import Swal from "sweetalert2";
import { BiSearch, BiFilterAlt } from "react-icons/bi";

interface Props {
  onSearch: (v: string) => void;
  initialValue: string;
  disabled?: boolean;
}

function SearchForm({ onSearch, initialValue, disabled }: Props) {
  const [value, setValue] = useState(initialValue)
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

    onSearch(v);
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

