interface Props{
  title?:string;
  subtitle?:string;
  children:React.ReactNode
}


function PartitionBase({title, subtitle, children}:Props) {
  return (
    <div className="py-8 border-b border-background-gray w-full">
      <h1 className="text-black text-[28px] font-semibold">{title}</h1>
      <h2 className="text-[#787878] font-light">{subtitle}</h2>
      {children}
    </div>
  );
}
export default PartitionBase;
