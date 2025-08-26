import { useAuthStore } from "@/store/useAuthStore"
import supabase from "@/utils/supabase"
import type { Provider } from "@supabase/supabase-js"
import { useState } from "react"
type Social = Extract<Provider, "github" | "google">

interface Props {
  social: Social
}

function SocialButton({ social }: Props) {

  const lastProvider = useAuthStore((s) => s.lastProvider)
  const [redirecting, setRedirecting] = useState(false);
  const isLastProvider = lastProvider === social ? true : false
  const redirectURL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://fes-5-project-team-6.vercel.app'

  const handleSignInWithOAuth = async () => {
    localStorage.setItem('pending_provider', social);
    setRedirecting(true);
    await supabase.auth.signInWithOAuth({
      provider: social,
      options: { redirectTo: redirectURL },
    })
  }

  return (
    <>
      {isLastProvider && !redirecting &&
        <div className="relative z-2 top-3 bg-[#E0AB0F] px-4 py-2 rounded-full sm:left-20 md:left-32 lg:left-50 text-white">최근 접속!</div>
      }
      <button
        type="button"
        onClick={handleSignInWithOAuth}
        className="flex flex-row gap-2 items-center justify-center border rounded-lg mb-7 w-full py-3 ">
        <img className="w-7 h-7" src={`/${social}.svg`} alt={social} />
        {social === 'github' ? <p>Continue with GitHub</p> : <p>Continue with Google</p>}
      </button>
    </>
  )
}
export default SocialButton

