import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

export function usePageEnterAnimation(
  bannerRef: RefObject<HTMLDivElement | null>,
  hrRef: RefObject<HTMLHRElement | null>,
  avatarRef: RefObject<HTMLLabelElement | null>,
  formRef: RefObject<HTMLFormElement | null>
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. HR: 가운데에서 좌우로 펼쳐지기
      tl.from(hrRef.current, {
        scaleX: 0,
        transformOrigin: "50% 50%",
        duration: 1.4,
        ease: "power3.out",
      });

      // 2. 아바타: 밑에서 위로 떠오르기
      tl.from(
        avatarRef.current,
        {
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.6" // 라인 펼칠 때와 거의 동시에 시작
      );

      

      // 3. 폼 전체 내려오기
      tl.from(
        formRef.current,
        { y: -24, opacity: 0, duration: 1.0, ease: "power3.out" },
        "-=0.2"
      );

      // 4. 폼 내부 행 stagger
      const rows = formRef.current?.querySelectorAll(":scope > div") ?? [];
      tl.from(
        rows,
        {
          y: -12,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
        "<"
      );
    });

    return () => ctx.revert();
  }, [bannerRef, hrRef, avatarRef, formRef]);
}
