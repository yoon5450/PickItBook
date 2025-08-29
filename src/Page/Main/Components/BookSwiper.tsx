import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import type { SwiperClass } from "swiper/react";
import type { BookItemType } from "@/@types/global";
import type { CategoryKey } from "../bookCategories";

interface BookSwiperProps {
  books: BookItemType[];
  activeCategory: CategoryKey;
  onSwiper: (swiper: SwiperClass) => void;
}

export const BookSwiper = ({
  books,
  activeCategory,
  onSwiper,
}:BookSwiperProps) => {
  return (
    <div className="book-slider-container relative">
      <Swiper
        onSwiper={onSwiper}
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={6}
        navigation={{
          prevEl: ".book-swiper-button-prev",
          nextEl: ".book-swiper-button-next",
        }}
        breakpoints={{
          0: {
            slidesPerView: 4,
            spaceBetween: 18,
          },
          768: {
            slidesPerView: 6,
            spaceBetween: 28,
          },
        }}
        className="book-swiper"
      >
        {books.map((book, bookIndex) => (
          <SwiperSlide
            key={book.isbn13 || `${activeCategory}-${bookIndex}`}
          >
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-hidden border border-gray-200 bg-gray-50">
                {book.bookImageURL ? (
                  <img
                    src={book.bookImageURL}
                    alt={`${book.bookname} 표지`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".fallback")) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "fallback w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100";
                        fallback.innerHTML = `
                          <div class="text-center p-4">
                            <div class="text-xs text-gray-600 font-medium">${book.class_nm}</div>
                            <div class="text-xs text-gray-400 mt-1">표지 준비중</div>
                          </div>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-center p-4">
                      <div className="text-xs text-gray-600 font-medium">
                        {book.class_nm}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        표지 준비중
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 네비게이션 버튼 */}
      <button className="book-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 transition-all duration-200 opacity-100 hover:scale-110 z-10 hidden md:block">
        <CiCircleChevLeft size={40} className="text-gray-700" />
      </button>
      <button className="book-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 transition-all duration-200 opacity-100 hover:scale-110 z-10 hidden md:block">
        <CiCircleChevRight size={40} className="text-gray-700" />
      </button>
    </div>
  );
};