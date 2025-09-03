import RatingStars from "@/Components/RatingStar";
import RatingBars from "./RatingBars";
import type { ReviewItemType } from "@/@types/global";
import { useMemo } from "react";

interface Props {
  data?: ReviewItemType[];
  ratingAvg: number;
}

function UserScorePatition({ data, ratingAvg }: Props) {
  const ratingItem = useMemo(() => {
    const items = [
      { label: "5점", count: 0 },
      { label: "4점", count: 0 },
      { label: "3점", count: 0 },
      { label: "2점", count: 0 },
      { label: "1점", count: 0 },
    ];

    if(!data?.length) return items;

  const clampIdx = (score: number) => {
    const s = Number.isFinite(score) ? score : 0;
    const idx = Math.floor(Math.abs(s - 5));
    return Math.min(4, Math.max(0, idx));
  };

  data.forEach((item) => {
    const i = clampIdx(item.score);
    items[i].count++;
  });

    return items;
  }, [data]);



  return (
    <>
      {data && (
        <div className="grid grid-cols-2 w-full p-5">
          <div className="flex items-center gap-4 justify-center">
            <RatingStars value={ratingAvg} size={48} />
            <span className="text-4xl font-semibold">{ratingAvg}</span>
          </div>
          <div className="flex flex-col gap-3">
            <RatingBars items={ratingItem} />
          </div>
        </div>
      )}
    </>
  );
}
export default UserScorePatition;
