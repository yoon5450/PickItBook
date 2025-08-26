import { FaGithub } from "react-icons/fa";
import slido from "/icons/slido_logo.svg";

function Footer() {
  return (
    <div className="bg-pattern flex items-center justify-between border-t h-[80px] border-primary-black px-5 md:px-[50px] bg-">
      <p className="text-base text-primary-black">
        Copyright © 2025 PickItBook. All rights Reserved
      </p>
      <div className="flex gap-4">
        <a href="" target="_blank" className="pointer-events-none">
          <img src={slido} alt="slido" />
        </a>
        <a
          href="https://github.com/prgrms-fe-devcourse/FES-5-Project-TEAM-6"
          target="_blank"
        >
          <FaGithub size={32} />
        </a>
      </div>
    </div>
  );
}
export default Footer;
