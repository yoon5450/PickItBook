import { useAuthStore } from "@/store/useAuthStore"
import supabase from "@/utils/supabase"
import tw from "@/utils/tw";
import type { Provider } from "@supabase/supabase-js"
type Social = Extract<Provider, "github" | "google">

interface Props {
  social: Social;
  className: string;
}

function SocialButton({ social, className }: Props) {

  const lastProvider = useAuthStore((s) => s.lastProvider)
  const isLastProvider = lastProvider === social ? true : false
  const redirectURL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://fes-5-project-team-6.vercel.app'

  const handleSignInWithOAuth = async () => {
    localStorage.setItem('pending_provider', social);
    await supabase.auth.signInWithOAuth({
      provider: social,
      options: { redirectTo: redirectURL },
    })
  }

  return (
    <>
      {
        isLastProvider &&
        <div className={
          tw("absolute z-10 bg-[#E0AB0F] px-4 py-2 rounded-full left-6/10 sm:left-7/11 md:left-11/15 lg:left-12/15 text-white text-xs",
            className)
        }>최근 접속!</div>
      }
      <button
        type="button"
        onClick={handleSignInWithOAuth}
        className="flex flex-row gap-2 items-center justify-center border rounded-lg mb-6 w-full py-3 text-primary-black border-primary-black">
        <img className="w-7 h-7" src={`/${social}.svg`} alt={social} />
        {social === 'github' ? <p>Continue with GitHub</p> : <p>Continue with Google</p>}
      </button>
    </>
  )
}
export default SocialButton

