import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { useState } from "react";
import type { SwiperClass } from "swiper/react";
import type { BookItemType } from "@/@types/global";
import type { CategoryKey } from "../bookCategories";
import { getBookImageURLs } from "@/utils/bookImageUtils";
import { NavLink } from "react-router-dom";
import tw from "@/utils/tw";

interface BookSwiperProps {
  books: BookItemType[];
  activeCategory: CategoryKey;
  onSwiper: (swiper: SwiperClass) => void;
}

const BookSwiper = ({ books, activeCategory, onSwiper }: BookSwiperProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const getBookId = (book: BookItemType, bookIndex: number) => {
    return book.isbn13 || `${activeCategory}-${bookIndex}`;
  };

  const getCurrentImageURL = (
    book: BookItemType,
    bookIndex: number
  ): string => {
    const bookId = getBookId(book, bookIndex);
    const imageURLs = getBookImageURLs(book.isbn13, book.bookImageURL);
    const currentIndex = currentImageIndex[bookId] || 0;

    return imageURLs[currentIndex] || "";
  };

  const handleImageError = (book: BookItemType, bookIndex: number) => {
    const bookId = getBookId(book, bookIndex);
    const imageURLs = getBookImageURLs(book.isbn13, book.bookImageURL);
    const currentIndex = currentImageIndex[bookId] || 0;

    if (currentIndex < imageURLs.length - 1) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [bookId]: currentIndex + 1,
      }));
    }
  };

  const hasValidImage = (book: BookItemType, bookIndex: number): boolean => {
    const bookId = getBookId(book, bookIndex);
    const imageURLs = getBookImageURLs(book.isbn13, book.bookImageURL);
    const currentIndex = currentImageIndex[bookId] || 0;

    return currentIndex < imageURLs.length && Boolean(imageURLs[currentIndex]);
  };

  const handleSwiperInit = (swiper: SwiperClass) => {
    onSwiper(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="book-slider-container relative">
      <Swiper
        onSwiper={handleSwiperInit}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={6}
        navigation={{
          prevEl: ".book-swiper-button-prev",
          nextEl: ".book-swiper-button-next",
        }}
        breakpoints={{
          0: {
            slidesPerView: 2.5,
            spaceBetween: 18,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
          },
          640: {
            slidesPerView: 3.5,
            spaceBetween: 18,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 28,
          },
          1200: {
            slidesPerView: 6,
            spaceBetween: 28,
          },
        }}
        className="book-swiper"
      >
        {books.map((book, bookIndex) => (
          <SwiperSlide key={book.isbn13 || `${activeCategory}-${bookIndex}`}>
            <div className="group border border-gray-200 bg-gray-50 cursor-pointer overflow-hidden">
              <NavLink to={`/book_detail/?isbn13=${book.isbn13}`}>
                <div className="aspect-[3/4] transition-all duration-300 group-hover:scale-105">
                  {hasValidImage(book, bookIndex) ? (
                    <img
                      src={getCurrentImageURL(book, bookIndex)}
                      alt={`${book.bookname} 표지`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(book, bookIndex)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <div className="text-lg text-gray-400">표지 준비중</div>
                    </div>
                  )}
                </div>
              </NavLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 네비게이션 버튼 */}
      <button
        className={tw(
          "book-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 transition-all duration-200 z-10 hidden md:block",
          isBeginning
            ? "opacity-20 cursor-not-allowed"
            : "opacity-100 hover:scale-110 cursor-pointer"
        )}
        disabled={isBeginning}
      >
        <CiCircleChevLeft size={40} className="text-primary-black" />
      </button>
      <button
        className={tw(
          "book-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 transition-all duration-200 z-10 hidden md:block",
          isEnd
            ? "opacity-20 cursor-not-allowed"
            : "opacity-100 hover:scale-110 cursor-pointer"
        )}
        disabled={isEnd}
      >
        <CiCircleChevRight size={40} className="text-primary-black" />
      </button>
    </div>
  );
};

export default BookSwiper;
