import tw from "@/utils/tw";
import { MdKeyboardArrowUp } from "react-icons/md";
import type React from "react";

interface Props {
  target?: HTMLElement;
  isVisible?: boolean;
}

type ExtendProps = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollTopButton({
  target,
  isVisible = true,
  className,
  ...rest
}: ExtendProps) {
  const handleClick = () => {
    if (target) target.scroll({ top: 0, behavior: "smooth" });
    else window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={tw(
        "fixed bottom-10 right-10 flex border-2 border-white bg-gray-800 w-16 h-16 rounded-full items-center justify-center",
        isVisible ? "" : "hidden",
        className
      )}
      onClick={handleClick}
      {...rest}
    >
      <div className="flex flex-col items-center leading-none -space-y-6">
        <MdKeyboardArrowUp className="text-white text-4xl animate-arrow-rise [animation-delay:0ms]" />
        <MdKeyboardArrowUp className="text-white text-4xl animate-arrow-rise [animation-delay:200ms]" />
        <MdKeyboardArrowUp className="text-white text-4xl animate-arrow-rise [animation-delay:400ms]" />
      </div>
    </button>
  );
}
export default ScrollTopButton;
