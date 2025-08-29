import { useEffect } from "react";

interface Props {
  setIsStart: React.Dispatch<React.SetStateAction<boolean>>;
  isWorking: boolean;
}

function RouletteButton({ setIsStart, isWorking }: Props) {

  useEffect(() => {
    if (!isWorking) setIsStart(false);
  }, [isWorking])

  return (
    <button
      type="button"
      onClick={() => setIsStart(true)}
      disabled={isWorking}
      className="absolute z-20 bottom-20 left-[calc(50%-80px)] w-40 h-12 rounded-2xl text-2xl text-center bg-primary-black text-white shadow-md"
      aria-label="룰렛 돌리기"
    >Pick</button>
  )
}
export default RouletteButton