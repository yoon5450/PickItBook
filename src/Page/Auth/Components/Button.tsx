interface Props {
  children?: React.ReactNode,
  onClick: () => void
}

function Button({ children, onClick }: Props) {
  return (
    <button onClick={onClick} type="button" className="flex flex-row gap-2 items-center justify-center border rounded-lg w-full h-14 py-2 bg-[#303030]">
      {children}
    </button>
  )
}
export default Button