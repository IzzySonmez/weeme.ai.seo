export default function Loading() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-lg text-gray-600">Analyzing website...</span>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        This may take a few moments while we gather performance data and insights.
      </div>
    </div>
  )
}