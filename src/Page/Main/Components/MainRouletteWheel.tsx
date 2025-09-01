import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
gsap.registerPlugin(useGSAP);

type Book = {
  src: string;
  alt: string;
};

interface Props {
  books: Book[];
}

function MainRouletteWheel({ books }: Props) {
  const pinRef = useRef<HTMLImageElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const bookRefs = useRef<HTMLDivElement[]>([]);

  // === 룰렛 배치 ===
  useGSAP(
    () => {
      if (!wheelRef.current) return;

      const radius = wheelRef.current.offsetWidth / 2;
      const centerX = radius;
      const centerY = wheelRef.current.offsetHeight / 2;
      const total = bookRefs.current.length;
      const slice = (2 * Math.PI) / total;

      bookRefs.current.forEach((book, index) => {
        const rad = index * slice;
        const x = radius * Math.sin(rad) + centerX;
        const y = -radius * Math.cos(rad) + centerY;
        gsap.set(book, {
          rotation: `${rad}rad`,
          xPercent: -50,
          yPercent: -50,
          x,
          y,
        });
      });

      // 자동 회전 시작
      startAutoRotation();
    },
    { scope: wheelRef, dependencies: [books.length], revertOnUpdate: true }
  );

  const startAutoRotation = () => {
    const wheel = wheelRef.current;
    const pin = pinRef.current;
    if (!wheel || !pin) return;

    const total = bookRefs.current.length;
    const sliceDeg = 360 / total;

    gsap.set(pin, { transformOrigin: "50% 0%" });

    let prevIdx = -1;

    const kickPin = () => {
      const kick = gsap.utils.random(3, 8);
      gsap.fromTo(
        pin,
        { rotation: -kick },
        {
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1,0.4)",
          overwrite: "auto",
        }
      );
    };

    gsap.to(wheel, {
      rotation: 360,
      duration: 20,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        const curAngle = Number(gsap.getProperty(wheel, "rotation")) || 0;
        const normalizedAngle = ((curAngle % 360) + 360) % 360;

        let closestIdx = -1;
        let minDistance = Infinity;

        for (let i = 0; i < total; i++) {
          const bookAngle = (i * sliceDeg) % 360;
          const distance = Math.min(
            Math.abs(normalizedAngle - bookAngle),
            Math.abs(normalizedAngle - bookAngle + 360),
            Math.abs(normalizedAngle - bookAngle - 360)
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestIdx = i;
          }
        }

        const threshold = sliceDeg / 4;
        if (minDistance <= threshold && closestIdx !== prevIdx) {
          kickPin();
          prevIdx = closestIdx;
        }
      },
    });
  };

  return (
    <>
      <img
        ref={pinRef}
        className="absolute bottom-125 z-[9]"
        src="/pin.svg"
        alt="룰렛 핀"
      />

      <div className="wrapper absolute bottom-0 w-full h-[550px] overflow-hidden flex flex-row items-center justify-center">
        <div
          ref={wheelRef}
          className="wheel absolute top-30 w-[1000px] h-[1000px] origin-[50%_50%]"
        >
          {books.map((book, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) bookRefs.current[index] = el;
              }}
              data-index={index}
              className="img absolute top-0 left-0 h-50 w-33 rounded-2xl shadow-book transition-all"
            >
              <img
                src={book.src}
                alt={book.alt}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const placeholder = document.createElement("div");
                  placeholder.className =
                    "w-[100%] h-[100%] rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 text-base";
                  placeholder.innerHTML = "책표지";
                  e.currentTarget.parentElement?.appendChild(placeholder);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainRouletteWheel;
