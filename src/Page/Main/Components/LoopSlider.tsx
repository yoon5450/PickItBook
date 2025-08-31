import { useEffect, useRef } from "react";
import BarcodeImage from "/main/barcode_img.svg";
import { gsap } from "gsap";

const LoopSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // 슬라이더 데이터
  const sliderData = [
    { text: "PickItBook", image: BarcodeImage },
    { text: "PickItBook", image: BarcodeImage },
    { text: "PickItBook", image: BarcodeImage },
    { text: "PickItBook", image: BarcodeImage },
    { text: "PickItBook", image: BarcodeImage },
    { text: "PickItBook", image: BarcodeImage },
  ];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const items = slider.querySelector(".slider-items") as HTMLElement;
    if (!items) return;

    const setupSmoothInfiniteScroll = () => {
      const itemWidth = 265;
      const totalItems = sliderData.length;
      const totalWidth = itemWidth * totalItems;

      gsap.set(items, {
        force3D: true,
        willChange: "transform",
      });

      // 무한 루프 애니메이션
      gsap.fromTo(
        items,
        { x: 0 },
        {
          x: -totalWidth,
          duration: totalItems * 2.5,
          ease: "none",
          repeat: -1,
          force3D: true,
          modifiers: {
            x: gsap.utils.unitize((x) => {
              return Math.round(parseFloat(x) % totalWidth);
            }),
          },
        }
      );
    };

    setupSmoothInfiniteScroll();

    return () => {
      gsap.killTweensOf([items, slider]);
    };
  }, [sliderData.length]);

  return (
    <div
      ref={sliderRef}
      className="bg-white relative w-full h-10 md:h-15 overflow-hidden py-[5px] md:py-[14px] border-t border-b border-primary-black -z-[1]"
    >
      <div
        className="slider-items flex gap-[50px] w-max transform-gpu"
        style={{
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        {/* 원본 세트 */}
        {sliderData.map((item, index) => (
          <div
            key={`original-${index}`}
            className="flex items-center justify-center gap-[50px]"
          >
            <span className="font-accent text-xl md:text-2xl whitespace-nowrap">
              {item.text}
            </span>
            <img className="w-[40px] md:w-full" src={item.image} alt="바코드" />
          </div>
        ))}

        {/* 복제본 세트 (무한 루프용) */}
        {sliderData.map((item, index) => (
          <div
            key={`duplicate-${index}`}
            className="flex items-center justify-center gap-[50px]"
          >
            <span className="font-accent text-xl md:text-2xl whitespace-nowrap">
              {item.text}
            </span>
            <img className="w-[40px] md:w-full" src={item.image} alt="바코드" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default LoopSlider;
