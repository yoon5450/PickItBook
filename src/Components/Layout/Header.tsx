import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import tw from "@/utils/tw";
import logo from "/pickitbook_logo.svg";
import { useMenuStore } from "@/store/useMenuStore";
import { Link, NavLink, useNavigate } from "react-router";
import { LuUserRound } from "react-icons/lu";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import supabase from "@/utils/supabase";

const Header = () => {
  const { isOpen, isAnimating, setIsOpen, setIsAnimating } = useMenuStore();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const profileImage = useProfileStore((s) => s.profile_image);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const navInnerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Random Roulette", path: "/roulette" },
    { label: "Book Search", path: "/search" },
    { label: "Bookshelf", path: "/bookshelf" },
    { label: "Mypage", path: "/mypage" },
  ];

  useEffect(() => {
    gsap.set(".nav", { display: "none" });
    gsap.set(".nav-transition-slide", { scaleX: 0 });
    gsap.set(".nav-item-line", { scaleX: 0 });
    gsap.set(".nav-link", { translateY: "100%", opacity: 0 });
    gsap.set(".nav-items", { y: 100, opacity: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const show = () => {
    setIsAnimating(true);
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    timelineRef.current = tl;

    gsap.set(".nav", { display: "block" });
    gsap.set(".nav-inner, .menu-btn", { pointerEvents: "none" });

    tl.fromTo(
      ".nav-transition-slide",
      { scaleX: 0, transformOrigin: "left center" },
      { duration: 0.4, scaleX: 1, ease: "expo.inOut" }
    )
      .fromTo(
        ".nav-items",
        { y: 100, opacity: 0 },
        { duration: 0.5, y: 0, opacity: 1, ease: "expo.out" },
        "-=0.4"
      )
      .set(".nav-inner, .menu-btn", { pointerEvents: "all" })
      .fromTo(
        ".nav-item-line",
        { scaleX: 0, transformOrigin: "left center" },
        { duration: 0.65, scaleX: 1, ease: "expo.inOut", stagger: 0.15 }
      )
      .fromTo(
        ".nav-link",
        { translateY: "100%", opacity: 0 },
        {
          duration: 1.5,
          translateY: 0,
          opacity: 1,
          ease: "elastic.inOut",
          stagger: 0.15,
        },
        "-=1.65"
      );
  };

  const hide = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    setIsAnimating(true);
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setIsOpen(false);
      },
    });

    timelineRef.current = tl;

    gsap.set(".nav-inner, .menu-btn", { pointerEvents: "none" });

    tl.to(".nav-item-line", {
      duration: 0.4,
      scaleX: 0,
      transformOrigin: "right center",
      ease: "expo.inOut",
      stagger: -0.15,
    })
      .to(
        ".nav-link",
        {
          duration: 0.35,
          translateY: "100%",
          opacity: 0,
          ease: "expo.inOut",
          stagger: -0.15,
        },
        0
      )
      .to(
        ".nav-items",
        { duration: 0.4, y: 100, opacity: 0, ease: "expo.in" },
        "-=0.3"
      )
      .to(".nav-transition-slide", {
        duration: 0.4,
        transformOrigin: "right center",
        scaleX: 0,
        ease: "expo.inOut",
      })
      .set(".menu-btn", { pointerEvents: "all" })
      .set(".nav", { display: "none" });
  };

  const toggleMenu = () => {
    if (isAnimating && timelineRef.current) {
      timelineRef.current.kill();
      setIsAnimating(false);
    }

    if (isOpen) {
      hide();
    } else {
      setOpenLoginModal(false);
      setIsOpen(true);
      show();
    }
  };

  const handleMenuClick = () => {
    // 애니메이션 중이라도 즉시 메뉴 닫기
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    hide();
  };

  const handleLoginModal = () => {
    setOpenLoginModal((prev) => !prev);
  };

  const handleLogout = async () => {
    // alert창 띄워주기?
    setOpenLoginModal(false);
    await supabase.auth.signOut();
  };

  const handleLogin = () => {
    setOpenLoginModal(false);
    navigate("/auth/login");
  };

  return (
    <>
      {/* Header */}
      <header
        className={tw(
          "backdrop-blur-lg bg-[hsla(0,0%,100%,0)] fixed top-0 left-0 w-full z-40 px-5 md:px-[50px] h-[60px] flex items-center justify-center border-b transition-all duration-700",
          isOpen ? "border-transparent bg-transparent" : "border-primary-black"
        )}
      >
        {/* Logo */}
        <h1
          className={tw(
            "transition-opacity duration-700",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <Link to="/">
            <img className="h-[32px]" src={logo} alt="pickitbook" />
          </Link>
        </h1>
        {openLoginModal ? (
          <>
            {user ? (
              <button
                type="button"
                className="z-100 absolute top-12 right-1/28 bg-pattern w-fit px-8 py-3 border rounded-xl shadow-modal"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                className="z-100 absolute top-12 right-1/28 bg-pattern w-fit px-8 py-3 border rounded-xl shadow-modal"
                onClick={handleLogin}
              >
                로그인
              </button>
            )}
          </>
        ) : (
          ""
        )}

        {/* Hamburger Menu Button */}
        <div className="flex gap-3 fixed right-5 md:right-[50px]">
          <button
            type="button"
            className={tw(
              "transition-opacity duration-700",
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            onClick={handleLoginModal}
          >
            {user ? (
              <img
                className="w-7 h-7 rounded-full"
                src={profileImage ? profileImage : "/profile_default.png"}
                alt="프로필"
              />
            ) : (
              <LuUserRound
                className="text-primary-black"
                size={24}
                aria-label="로그인/마이페이지"
              />
            )}
          </button>

          <button
            type="button"
            ref={menuBtnRef}
            onClick={toggleMenu}
            className={tw(
              "menu-btn relative w-6 h-[22px] flex flex-col justify-between items-end z-40"
            )}
            aria-label="Toggle menu"
          >
            <span
              className={tw(
                "w-full h-[3px] transition-all duration-300 ease-in-out origin-center rounded-full",
                isOpen
                  ? "bg-white rotate-45 translate-y-[9.5px]"
                  : "bg-primary-black"
              )}
            />
            <span
              className={tw(
                "w-2/3 h-[3px] transition-all duration-300 ease-in-out rounded-full",
                isOpen ? "bg-white opacity-0" : "bg-primary-black"
              )}
            />
            <span
              className={tw(
                "w-full h-[3px] transition-all duration-300 ease-in-out origin-center rounded-full",
                isOpen
                  ? "bg-white -rotate-45 -translate-y-[9.5px]"
                  : "bg-primary-black"
              )}
            />
          </button>
        </div>
      </header>

      {/* Navigation Overlay */}
      <nav className="nav fixed left-0 top-0 w-full h-screen z-30 hidden">
        <div
          ref={navInnerRef}
          className="nav-inner w-full h-full pointer-events-none"
        >
          {/* Background Slide */}
          <div className="nav-transition-slide absolute left-0 top-0 w-full h-full bg-primary-black origin-left scale-x-0" />

          {/* Menu Items */}
          <ul className="nav-items max-w-3xl m-auto h-full flex flex-col items-center justify-center text-center px-5">
            {menuItems.map((item, index) => (
              <li
                key={item.label ?? index}
                className="nav-item relative w-full mb-8 pb-[2px] overflow-hidden"
              >
                <div className="nav-item-link">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link block no-underline items-center translate-y-full nav-link-hover ${
                        isActive ? "" : ""
                      }`
                    }
                    onClick={handleMenuClick}
                  >
                    <span
                      className="nav-link-text font-accent relative h-full text-5xl text-transparent md:text-[80px]"
                      data-text={item.label}
                    >
                      {item.label}
                      <span className="absolute left-0 top-0 text-gray-100 font-accent">
                        {item.label}
                      </span>
                    </span>
                  </NavLink>
                </div>

                {/* Bottom Line */}
                <div className="nav-item-line absolute bottom-0 left-0 h-[1px] w-full bg-white origin-left scale-x-0" />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
