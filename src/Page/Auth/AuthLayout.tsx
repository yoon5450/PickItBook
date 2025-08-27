import { Outlet, useLocation } from "react-router"

function AuthLayout() {
  const location = useLocation(); // path 바뀔때마다 애니메이션 실행되도록
  return (
    <div className="w-full min-h-screen justify-items-center bg-pattern">
      <div className="w-full max-w-[1200px] mx-auto justify-items-center px-64 py-48">
        <h1 hidden>AuthLayout</h1>
        <section className="flex">
          <div className="lg:w-[520px] md:w-sm w-2xs flex-1 border border-primary-black rounded-xl flex items-center justify-center z-20 bg-pattern">
            <img className="w-80 px-10" src="/pickitbook_logo.svg" alt="pick it book" />
          </div>
          <div key={location.pathname} className="
            relative
            lg:w-[520px] md:w-sm w-2xs 
            flex-1 border rounded-xl border-primary-black
            flex items-center justify-center 
            lg:animate-form-right-lg
            md:animate-form-right-md
            animate-form-right-sm
          ">
            <Outlet></Outlet>
          </div>
        </section>
      </div>
    </div>


  )
}
export default AuthLayout