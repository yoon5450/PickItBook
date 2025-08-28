import RatingStars from "@/Components/RatingStar";
import RatingBars from "./RatingBars";

function UserScore() {
  return (
    <div className="grid grid-cols-2 w-full p-5">
      <div className="flex items-center gap-4 justify-center">
        <RatingStars value={4.5} max={5} size={48} />
        <span className="text-4xl font-semibold">4.5</span>
      </div>
      <div className="flex flex-col gap-3">
        <RatingBars
          items={[
            { label: "5점", count: 100 },
            { label: "4점", count: 60 },
            { label: "3점", count: 60 },
            { label: "2점", count: 60 },
            { label: "1점", count: 60 },
          ]}
        />
      </div>
    </div>
  );
}
export default UserScore;
