import type { MissionItemType } from "@/@types/global";
import tw from "@/utils/tw";

interface Props {
  items: MissionItemType[];
  type?: "default" | "sm";
}

function MissionList({ items, type = "default" }: Props) {
  return (
    <ul className="flex flex-col w-full gap-2 pt-4">
      {type !== "sm" && (
        <li className="relative flex justify-between items-center text-[20px] px-8">
          <span>미션명</span>
          <div className="flex text-[20px] w-34 justify-between">
            <span>점수</span>
            <span>달성률</span>
          </div>
        </li>
      )}

      {items.map(
        ({ missionType, missionTitle, score, userArchiveRate, isComplete }) => (
          <li
            className={tw(
              "relative flex justify-between items-center py-4 px-8 bg-white rounded-md",
              type === "sm" && "py-3 px-4"
            )}
          >
            <div className="flex flex-col gap-1">
              {type !== "sm" && <p className="text-gray-300">{missionType}</p>}
              <p className={tw("text-[20px]", type === "sm" && "text-[16px]")}>
                {missionTitle}
              </p>
            </div>
            <div
              className={tw(
                "flex gap-14 text-[20px]",
                type === "sm" && "text-[16px]"
              )}
            >
              <span>{score}점</span>
              <span>{userArchiveRate}%</span>
            </div>
            {isComplete && (
              <div
                className={tw(
                  "absolute left-0 top-0 flex justify-center items-center",
                  "backdrop-blur-xs bg-black/50 w-full h-full rounded-md",
                  "text-[24px] text-primary font-semibold",
                  type === "sm" && "text-[16px]"
                )}
              >
                달성 완료
              </div>
            )}
          </li>
        )
      )}
    </ul>
  );
}
export default MissionList;
