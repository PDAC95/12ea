/**
 * DirectoryCardSkeleton - Skeleton loader genérico para DirectoryCard
 *
 * Features:
 * - Simula estructura de DirectoryCard
 * - Animación de pulso
 * - Mismo tamaño que DirectoryCard real
 * - Responsive design
 * - Reutilizable para Business y Service
 *
 * Sprint 2 - Task 5.4 (Moved to shared in Task 6.5)
 *
 * @returns {JSX.Element} Skeleton de tarjeta
 */
const DirectoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Logo Skeleton */}
      <div className="h-48 bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Description Lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Contact Icons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="flex-1"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryCardSkeleton;
