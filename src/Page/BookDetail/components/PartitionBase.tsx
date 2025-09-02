import tw from "@/utils/tw";

interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

function PartitionBase({ title, subtitle, children, className}: Props) {
  return (
    <div className={tw("py-8 border-b border-background-gray w-full", className)}>
      <h1 className="text-black text-[28px] font-semibold">{title}</h1>
      <h2 className="text-[#787878] font-light">{subtitle}</h2>
      {children}
    </div>
  );
}
export default PartitionBase;
