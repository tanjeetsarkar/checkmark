export default function WorkspaceLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-9 w-96 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-full max-w-2xl bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-56 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}