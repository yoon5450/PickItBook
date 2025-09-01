import React from "react";

type Book3DProps = {
  title: string;
  imageUrl: string;
  style?: React.CSSProperties;
};

const Book3D: React.FC<Book3DProps> = ({ title, imageUrl, style }) => {
  return (
    <div
      className="relative w-[150px] h-[200px]"
      style={style}
    >
      {/* 표지 */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover rounded shadow-md"
      />

      {/* 책 두께 (옆면 + 아래) */}
      <div className="absolute top-0 right-0 w-[6px] h-full bg-gray-200 shadow-inner"></div>
      <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gray-100 shadow-inner"></div>
    </div>
  );
};

export default Book3D;
