export default function WorkspaceCanvas() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Canvas Area
        </h2>
        <p className="text-gray-600 mb-6">
          This is where your 3D charts and visualizations will appear. We&apos;ll add
          ECharts integration in the next phase!
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-900">
            💡 <strong>Coming Soon:</strong> Interactive 3D charts, real-time
            collaboration cursors, and data visualization tools.
          </p>
        </div>
      </div>
    </div>
  );
}