import { useEffect } from "react"

interface Props {
  pickBook: HTMLDivElement | null
}

function PickBook({ pickBook }: Props) {
  useEffect(() => {
    if (pickBook) console.log(pickBook)
    // 책 애니메이션
  }, [pickBook])
  return (
    <div>PickBook</div>
  )
}
export default PickBook