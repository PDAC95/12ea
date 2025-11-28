/**
 * TipCardSkeleton - Skeleton loader para TipCard
 *
 * Features:
 * - Animación de pulse
 * - Mismo layout que TipCard
 *
 * @returns {JSX.Element}
 */
const TipCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Header con Badge */}
      <div className="p-6 pb-4">
        <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
      </div>

      {/* Contenido */}
      <div className="px-6 pb-4">
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCardSkeleton;
