import { Suspense, useMemo, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAuthStore } from "@/store/useAuthStore";
import { getBookmarks, type BookmarkBook } from "@/utils/getBookmarks";
import { getBookImageURLs } from "@/utils/bookImageUtils";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

type BookProps = {
  cover: string;
  position: [number, number, number];
  width: number;
  height: number;
  thickness: number;
  rotation?: [number, number, number];
};

// 북마크 데이터 가져오기
const useBookmarkData = (userId: string | undefined) => {
  const [bookmarks, setBookmarks] = useState<BookmarkBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetUserId = userId;
    if (!targetUserId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const bookmarkData = await getBookmarks(targetUserId);

        setBookmarks(bookmarkData);

        if (!bookmarkData || bookmarkData.length === 0) {
          setBookmarks([]);
          return;
        }
      } catch (error) {
        console.error("북마크 데이터 가져오기 실패:", error);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  return { bookmarks, loading };
};

const Book = ({
  cover,
  position,
  width,
  height,
  thickness,
  rotation = [0, 0, 0],
}: BookProps) => {
  const fallbackImage =
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
      <rect width="200" height="300" fill="#e5e7eb"/>
      <text x="100" y="150" text-anchor="middle" font-size="16" fill="#6b7280">book cover</text>
    </svg>
  `);

  const coverTexture = useTexture(cover || fallbackImage);

  const stripes =
    "data:image/svg+xml;base64," +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4">
        <rect width="4" height="4" fill="white"/>
        <path d="M0 0h4v2H0z" fill="#e5e7eb"/>
      </svg>
    `);
  const pageTexture = useTexture(stripes);
  pageTexture.wrapS = pageTexture.wrapT = THREE.RepeatWrapping;
  pageTexture.repeat.set(10, 1);

  return (
    <mesh rotation={rotation} position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, thickness]} />
      {/* 책등 */}
      <meshStandardMaterial attach="material-0" map={coverTexture} />
      {/* 앞면 */}
      <meshStandardMaterial
        attach="material-5"
        map={coverTexture}
        roughness={0.7}
        metalness={0.0}
      />
      {/* 옆면 */}
      <meshStandardMaterial attach="material-1" map={pageTexture} />
      <meshStandardMaterial attach="material-2" map={pageTexture} />
      <meshStandardMaterial attach="material-3" map={pageTexture} />
      {/* 뒷면 */}
      <meshStandardMaterial attach="material-4" color="#555" />
    </mesh>
  );
};

// 바닥 평면
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

const BookPileUp = () => {
  const { user } = useAuthStore();
  const { bookmarks, loading } = useBookmarkData(user?.id);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const stackedBooks = useMemo(() => {
    if (!bookmarks.length) return [];
    let y = 0;
    return bookmarks.map((bookmark, index) => {
      const width = 1 + (index % 3) * 0.1;
      const height = 1.4 + (index % 4) * 0.1;
      const thickness = 0.15 + (index % 5) * 0.05;
      const posY = y + thickness / 2;
      y += thickness;
      const isbn13 = bookmark.isbn13 || "";
      const imageUrls = getBookImageURLs(isbn13);
      return {
        id: isbn13,
        title: bookmark.book_name || "제목 없음",
        cover: imageUrls[0] || "",
        width,
        height,
        thickness,
        position: [0, posY, 0] as [number, number, number],
      };
    });
  }, [bookmarks]);

  // 카메라 제어
  const zoomOut = () => {
    controlsRef.current?.dollyIn(1.2);
    controlsRef.current?.update();
  };
  const zoomIn = () => {
    controlsRef.current?.dollyOut(1.2);
    controlsRef.current?.update();
  };

  if (loading) {
    return (
      <div className="relative w-full h-[calc(100vh-140px)] overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full border-b-2 border-gray-400 h-8 w-8 mb-4"></div>
          <p>북마크한 책들을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-140px)] overflow-hidden">
      <div className="absolute top-5 md:top-[50px] left-5 md:left-[50px] z-10 bg-primary p-3 rounded-lg">
        <p className="text-base text-white">
          총 {stackedBooks.length}권의 북마크 도서
        </p>
      </div>

      {/* 북마크가 없는 경우 */}
      {stackedBooks.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary-black mb-4">
              아직 북마크한 책이 없습니다
            </h2>
            <p className="text-gray-600">
              마음에 드는 책을 북마크해서 나만의 책 더미를 만들어보세요!
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 shadow-lg flex space-x-2">
              <button onClick={zoomOut} className="p-2 hover:text-primary">
                <CiCircleMinus size={32} />
              </button>
              <button onClick={zoomIn} className="p-2 hover:text-primary">
                <CiCirclePlus size={32} />
              </button>
            </div>
          </div>

          <Canvas
            shadows
            camera={{ position: [5, 8, 5], fov: 50 }}
            gl={{ antialias: true }}
          >
            <ambientLight intensity={1} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              color="#fff8e7"
              castShadow
            />
            <Suspense fallback={null}>
              <Floor />
              {stackedBooks.map((book) => (
                <Book key={book.id} {...book} rotation={[Math.PI / 2, 0, 0]} />
              ))}
            </Suspense>
            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              target={[0, stackedBooks.length * 0.1, 0]}
            />
          </Canvas>
        </>
      )}
      <div className="hidden md:block absolute bottom-[30px] left-5 md:left-[50px] text-sm text-gray-500 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        마우스로 드래그하여 회전, 버튼으로 확대/축소
      </div>
    </div>
  );
};

export default BookPileUp;
