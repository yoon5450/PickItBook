// BookStack.tsx
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
      className="relative w-full flex justify-center mt-16"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        maxHeight: "500px",
      }}
    >
      {books.map((book, idx) => (
        <Book3D
          key={book.book_id}
          title={book.book_name}
          imageUrl={book.image_url}
          style={{
            transform: `
              rotateX(${8 + Math.random() * 5}deg)   
              rotateZ(${(Math.random() - 0.5) * 20}deg)
              translateX(${(Math.random() - 0.5) * 20}px)
              translateY(${idx * -15}px)
              translateZ(${idx * 10}px)
            `,
            zIndex: books.length - idx,
            position: "absolute",
          }}
        />
      ))}
    </div>
  );
};

export default BookStack;


// type Book = {
//   book_id: number;
//   book_name: string;
//   image_url: string;
// };

// type BookStackProps = {
//   books: Book[];
// };

// /** ─ 설정값 (필요하면 숫자만 바꿔서 튜닝) ─ */
// const MAX_VISIBLE_COUNT = 15;    // 이 개수까진 위로 쌓임
// const STACK_SPACING_Y = 15;      // 위로 쌓일 때 간격(px)
// const DOWN_SPACING_Y  = 22;      // 초과분이 아래로 빠질 때 간격(px)

// const DEPTH_PER_BOOK  = 8;       // Z축 두께감(px)
// const MAX_DEPTH       = 120;     // Z축 최대치(넘치면 고정)

// const ROTATE_X_BASE   = 10;      // 기본 X축 기울기(도)
// const ROTATE_X_VAR    = 4;       // X축 랜덤 가감(±도)
// const ROTATE_Z_VAR    = 16;      // Z축 랜덤 회전(±도)
// const TRANS_X_VAR     = 16;      // X축 랜덤 이동(±px)

// const CONTAINER_MAX_H = 520;     // 스택 영역의 최대 높이(px). footer 위에서 잘리게.

// function seeded01(n: number) {
//   // 0..1 사이 고정 난수 (렌더마다 흔들리지 않도록 시드 기반)
//   const t = Math.sin(n * 12.9898) * 43758.5453;
//   return t - Math.floor(t);
// }
// function jitter(seed: number, range: number) {
//   // -range..+range
//   return (seeded01(seed) * 2 - 1) * range;
// }

// const BookStack: React.FC<BookStackProps> = ({ books }) => {
//   return (
//     <div
//       className="relative w-full flex justify-center mt-16 overflow-hidden"
//       style={{
//         // 3D 공간
//         perspective: "1000px",
//         transformStyle: "preserve-3d",
//         // 아래로 빠지는 연출을 위해 영역을 제한
//         maxHeight: `${CONTAINER_MAX_H}px`,
//       }}
//     >
//       {books.map((book, idx) => {
//         // 위로 쌓일 때 Y, 초과분은 아래로 빠짐
//         const y =
//           idx < MAX_VISIBLE_COUNT
//             ? -idx * STACK_SPACING_Y
//             : (idx - MAX_VISIBLE_COUNT + 1) * DOWN_SPACING_Y;

//         // 화면 앞으로 튀어나오는 건 제한
//         const z = Math.min(idx * DEPTH_PER_BOOK, MAX_DEPTH);

//         // 시드 고정 랜덤(렌더/리렌더에도 모양 유지)
//         const rz = jitter(book.book_id * 3 + 1, ROTATE_Z_VAR);
//         const tx = jitter(book.book_id * 5 + 2, TRANS_X_VAR);
//         const rx = ROTATE_X_BASE + jitter(book.book_id * 7 + 3, ROTATE_X_VAR);

//         return (
//           <Book3D
//             key={book.book_id}
//             title={book.book_name}
//             imageUrl={book.image_url}
//             style={{
//               position: "absolute",
//               zIndex: books.length - idx,
//               transform: `
//                 rotateX(${rx}deg)
//                 rotateZ(${rz}deg)
//                 translateX(${tx}px)
//                 translateY(${y}px)
//                 translateZ(${z}px)
//               `,
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default BookStack;