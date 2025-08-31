import RatingStars from "@/Components/RatingStar";
import RatingBars from "./RatingBars";
import type { ReviewItemType } from "@/@types/global";
import { useMemo } from "react";

interface Props {
  data?: ReviewItemType[];
}

function UserScorePatition({ data }: Props) {
  const ratingItem = useMemo(() => {
    const items = [
      { label: "5점", count: 0 },
      { label: "4점", count: 0 },
      { label: "3점", count: 0 },
      { label: "2점", count: 0 },
      { label: "1점", count: 0 },
    ];

    if (data)
      data.map((item) => items[Math.floor(Math.abs(item.score - 5))].count++);

    return items;
  }, [data]);

  const ratingAvg = useMemo(() => {
    let summary = 0;

    if (!data) return 0;

    data.map((item) => (summary += item.score));

    return summary === 0 ? summary : Math.ceil(summary / data?.length * 10)/10;
  }, [data]);

  return (
    <div className="grid grid-cols-2 w-full p-5">
      <div className="flex items-center gap-4 justify-center">
        <RatingStars value={ratingAvg} size={48}/>
        <span className="text-4xl font-semibold">{ratingAvg}</span>
      </div>
      <div className="flex flex-col gap-3">
        <RatingBars items={ratingItem} />
      </div>
    </div>
  );
}
export default UserScorePatition;
