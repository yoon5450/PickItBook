import SocialButton from "./Components/SocialButton"
import { memo } from "react";

function Login() {

  return (
    <div className="w-full flex flex-col items-center px-10 py-25">
      <h2 className="font-semibold text-[32px] text-primary-black mb-9 text-center">Login</h2>
      <SocialButton social='github' className={'top-39'} />
      <SocialButton social='google' className={'top-59'} />

    </div>
  )
}
export default memo(Login)