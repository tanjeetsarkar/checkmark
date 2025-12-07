// app/workspaces/[id]/not-found.tsx
import Link from 'next/link';

export default function WorkspaceNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Workspace Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The workspace you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link
            href="/workspaces"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}