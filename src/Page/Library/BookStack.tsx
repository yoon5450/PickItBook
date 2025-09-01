import React from "react";
import Book3D from "./ Book3D";
// import Book3D from "./Book3D";

type Book = {
  book_id: number;
  book_name: string;
  image_url: string;
};

type BookStackProps = {
  books: Book[];
};

const BookStack: React.FC<BookStackProps> = ({ books }) => {
  return (
    <div
      className="relative flex flex-col items-center mt-12"
      style={{  perspective: "1200px", perspectiveOrigin: "center top" }}
    >
      {books.map((book, idx) => (
        <Book3D
          key={book.book_id}
          title={book.book_name}
          imageUrl={book.image_url}
style={{
  transform: `
    rotateX(75deg)                /* 책을 눕히는 기본 각도 */
    rotateZ(${(Math.random() - 0.5) * 15}deg)  /* 지그재그 효과 */
    translateY(${idx * -20}px)    /* 책이 겹쳐 보이도록 Y축 밀기 */
    translateZ(${idx * 40}px)     /* 책 두께/쌓임 효과 */
  `,
  zIndex: books.length - idx,
}}
        />
      ))}
    </div>
  );
};

export default BookStack;
