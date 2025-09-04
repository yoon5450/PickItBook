import SocialButton from "./Components/SocialButton"
import { memo } from "react";

function Login() {
  return (
    <div className="w-full max-w-[1200px] mx-auto min-h-[760px] h-[calc(100vh-80px)] justify-items-center pt-50 px-48">
      <h1 hidden>AuthLayout</h1>
      <section className="flex">
        {/* 바인더 */}
        <div className="lg:w-[520px] md:w-sm w-2xs flex-1 border border-primary-black rounded-xl flex items-center justify-center z-20 bg-pattern">
          <img className="w-80 px-10" src="/pickitbook_logo.svg" alt="pick it book" />
        </div>
        <div className="
            relative
            lg:w-[520px] md:w-sm w-2xs 
            flex-1 border rounded-xl border-primary-black
            flex items-center justify-center 
            lg:animate-form-right-lg
            md:animate-form-right-md
            animate-form-right-sm
          ">
          {/* 바인더에 들어갈 페이지 : 로그인 폼 */}
          <div className="w-full flex flex-col items-center px-10 py-25">
            <h2 className="font-semibold text-[32px] text-primary-black mb-9 text-center">Login</h2>
            <SocialButton social='github' className={'top-39'} />
            <SocialButton social='google' className={'top-59'} />
          </div>
        </div>
      </section>
    </div>

  )
}
export default memo(Login)