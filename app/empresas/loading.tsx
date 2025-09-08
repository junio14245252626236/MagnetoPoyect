export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Dashboard Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div>
                  <div className="w-12 h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Opinions Skeleton */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
