import tw from "@/utils/tw";
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";

interface Props {
  className?:string;
  disabled:boolean;
  onClick:() => void
  isBookmarked?:boolean;
}


function BookmarkButton({className, disabled, onClick, isBookmarked}: Props) {
  return (
    <button
      type="button"
      className={tw("absolute right-10 top-0", className)}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="relative f">
        <FaBookmark
          size={32}
          className={tw(
            "text-primary transition absolute",
            isBookmarked ? "opacity-100" : "opacity-0"
          )}
        />
        <FaRegBookmark
          size={32}
          className={tw(
            "text-primary transition absolute",
            isBookmarked ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
    </button>
  );
}
export default BookmarkButton;
