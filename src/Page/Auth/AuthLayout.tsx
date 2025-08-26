import { Outlet, useLocation } from "react-router"

function AuthLayout() {
  const location = useLocation(); // path 바뀔때마다 애니메이션 실행되도록
  return (
    // out container
    <div className="w-full max-w-[1920px] mx-auto justify-items-center ">
      {/* inner container */}
      <div className="w-full max-w-[1200px] mx-auto justify-items-center ">
        <h1 hidden>AuthLayout</h1>


        <section className="flex mx-64 my-48 ">

          <div className="lg:w-[520px] md:w-sm w-2xs flex-1 border rounded-xl flex items-center justify-center z-3 bg-white">
            <img className="w-80 px-10" src="/pickitbook.svg" alt="pick it book" />
          </div>

          <div key={location.pathname} className="
            lg:w-[520px] md:w-sm w-2xs 
            flex-1 border rounded-xl 
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