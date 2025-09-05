import type { BookItemType } from "@/@types/global";
import BookSwiper from "@/Page/Main/Components/BookSwiper";
import LoadingSkeleton from "@/Page/Main/Components/LoadingSkeleton";
import { useMobileDetection } from "@/Page/Main/hooks/useMobileDetection";
import { useSwiperRefs } from "@/Page/Main/hooks/useSwiperRefs";

interface Props {
  data: BookItemType[] | undefined;
  isFetching: boolean;
}

// 나중에 Swiper로 대체
function RecommandedPatition({ data, isFetching }: Props) {
  const isMobile = useMobileDetection();
  const { bookSwiperRef } = useSwiperRefs(isMobile);
  const EMPTY_BOOKS: BookItemType[] = [];
  const hasBooks = (data?.length ?? 0) > 0;

  if (!hasBooks && isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {hasBooks ? (
        <div className="relative pt-6 px-12">
          <BookSwiper
            books={data?.[0] ? data : EMPTY_BOOKS}
            activeCategory="all"
            onSwiper={(swiper) => (bookSwiperRef.current = swiper)}
          />
        </div>
      ): null}
    </>
  );
}
export default RecommandedPatition;
