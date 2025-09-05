import type { MissionItemType } from "@/@types/global";
import MissionList from "./MissionList";
import loaderIcon from '@/assets/loading.svg';

interface Props {
  data?: MissionItemType[];
}

function MisstionPartition({ data }: Props) {

  console.log(data);
  if (!data) {
    return (
      <img
        className="h-25 text-center p-1 inline object-cover"
        src={loaderIcon}
        alt="로딩중"
      />
    );
  }

  return (
    <div className="">
      <MissionList items={data} />
    </div>
  );
}
export default MisstionPartition;
