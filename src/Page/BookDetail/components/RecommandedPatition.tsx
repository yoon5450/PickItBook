import type { BookDetailData } from "@/api/useBookDetail";
import loaderIcon from "@/assets/loading.svg";

interface Props {
  data: BookDetailData[] | undefined;
  isFetching: boolean;
}

// 나중에 Swiper로 대체
function RecommandedPatition({ data, isFetching }: Props) {
  console.log(data, isFetching);
  return (
    <>
      {isFetching && data?.[0] ? (
        <img
          className="h-25 text-center p-1 inline"
          src={loaderIcon}
          alt="로딩중"
        />
      ) : (
        <div className="flex gap-3 w-full justify-center p-5 max-w-full">
          {data?.map(() => (
            <img src={loaderIcon} className="h-40"/>
          ))}
        </div>
      )}
    </>
  );
}
export default RecommandedPatition;
