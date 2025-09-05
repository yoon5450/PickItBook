import type { Badge } from "@/api/useUserBadges";


type BadgeModalProps = {
  badges: Badge[];
  onClose: () => void;
};

function BadgeModal({ badges, onClose }: BadgeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">모든 Badge</h3>
          <button onClick={onClose} className="text-gray-500">닫기</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div key={b.code} className="flex flex-col items-center text-center">
              <img
                src={b.image}
                alt={b.name}
                className={`w-16 h-16 ${b.completed ? "" : "grayscale opacity-40"}`}
              />
              <span className="mt-1 text-sm">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BadgeModal;
