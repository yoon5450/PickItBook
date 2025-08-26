
interface Props {
  children?: React.ReactNode
}

function Hr({ children }: Props) {
  return (
    <div className="flex flex-row items-center gap-2 w-full pt-4 mb-5">
      <hr className="sm:w-0 md:w-1/4 lg:w-1/3 border-[#A1A1A1]" />
      {children}
      <hr className="sm:w-0 md:w-1/4 lg:w-1/3 border-[#A1A1A1]" />
    </div>
  )
}
export default Hr