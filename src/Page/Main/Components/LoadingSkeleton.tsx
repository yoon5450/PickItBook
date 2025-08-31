export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
};
