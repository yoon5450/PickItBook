import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[1200px] max-[1250px]:w-full text-center">
        <div className="mx-5 pb-15 mb-10 border-b border-primary-black">
          <div className="flex items-center justify-center">
            <img src="/notfound_img.png" />
          </div>
        </div>
        <p className="text-lg text-primary-black mb-10 px-5 break-keep">
          페이지를 찾을 수 없습니다. <br />
          존재하지 않는 주소를 입력하셨거나, <br />
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
        <Link to="/">
          <button
            type="button"
            className="text-xl text-white font-medium h-15 px-8 bg-primary rounded-xl"
          >
            홈으로 이동
          </button>
        </Link>
      </div>
    </div>
  );
}
export default NotFound;
