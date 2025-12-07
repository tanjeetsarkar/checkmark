// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Collab<span className="text-indigo-600">Viz</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real-time collaboration meets 3D data visualization
        </p>
        <Link
          href="/workspaces"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          View Workspaces
        </Link>
      </div>
    </div>
  );
}