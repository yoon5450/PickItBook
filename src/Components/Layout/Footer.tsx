import { FaGithub } from "react-icons/fa";
import slido from "/icons/slido_logo.svg";

function Footer() {
  return (
    <div className="flex items-center justify-between border-t h-[80px] border-primary-black px-5 md:px-[50px]">
      <p className="text-base">
        Copyright © 2025 PickItBook. All rights Reserved
      </p>
      <div className="flex gap-4">
        <span>
          <img src={slido} alt="slido" />
        </span>
        <span>
          <FaGithub size={32} />
        </span>
      </div>
    </div>
  );
}
export default Footer;
