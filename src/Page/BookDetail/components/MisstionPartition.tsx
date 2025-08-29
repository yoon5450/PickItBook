import type { MissionItemType } from "@/@types/global";
import MissionList from "./MissionList";

interface Props{
  data:MissionItemType[]
}

function MisstionPartition({data}:Props) {
  return (
    <div className="">
      <MissionList items={data}  />
    </div>
  );
}
export default MisstionPartition;
