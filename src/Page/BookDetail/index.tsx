import { useBookDetail } from "@/api/bookDetail";
import { useSearchParams } from "react-router-dom";
import loaderIcon from "@/assets/loading.svg";


function BookDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isbn13 = searchParams.get("isbn13") ?? "";

  const { data, isFetching, isError, error } = useBookDetail(isbn13);
  console.log(data);
  return (
    <div>
      {/* 로딩중 아이콘 */}
      {isFetching ? (
        <img
          className="h-25 text-center p-1 inline"
          src={loaderIcon}
          alt="로딩중"
        />
      ) : null}
      <h2>책이름</h2>
      <div>{data?.book?.description}</div>
      BookDetail
    </div>
  );
}
export default BookDetail;
