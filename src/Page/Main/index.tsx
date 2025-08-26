function Main() {
  return (
    <main className="w-full bg-pattern">
      <section className="h-screen relative">
        <h2 className="font-accent absolute left-[50%] top-[50%] -translate-[50%] text-white text-[100px]">
          PickItBook
        </h2>
        <div className="flex h-full">
          <div className="w-1/2 h-full bg-[url(/hero_bg.png)] bg-no-repeat bg-[center_right_-28rem] bg-cover"></div>
          <div className="w-1/2 h-full bg-[url(/hero_bg.png)] bg-no-repeat bg-[center_left_-46rem] bg-cover"></div>
        </div>
      </section>
      <section className="py-[80px]">
        <div className="w-[1200px] m-auto">
          <h2 className="text-3xl text-center text-primary-black font-semibold">
            따끈따끈 새로 들어온 책
          </h2>
        </div>
      </section>
      <section className="py-[80px]">
        <div className="w-[1200px] m-auto">
          <h2 className="text-3xl text-center text-primary-black font-semibold">
            <span className="font-accent">PickItBook</span>만의 매력
          </h2>
        </div>
      </section>
      <section className="py-[80px]">
        <h2 className="text-4xl text-center text-primary-black font-semibold">
          고민 끝, <span className="font-accent">PickItBook</span> 시작!
        </h2>
      </section>
    </main>
  );
}
export default Main;
