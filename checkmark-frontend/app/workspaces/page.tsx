import Image from "next/image";
import Link from "next/link";
import { workspaceAPI } from "@/lib/api/python-client";
import NewWorkspaceButton from "@/components/workspace/NewWorkspaceButton";
import type { WorkspaceList } from "@/types/api";

export const dynamic = 'force-dynamic';

export default async function WorkspacesPage() {
  const workspaces: WorkspaceList[] = await workspaceAPI.list();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Workspaces
            </h1>
            <p className="text-gray-600">
              Collaborate on data visualizations in real-time
            </p>
          </div>
          <NewWorkspaceButton />
        </div>

        {workspaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No workspaces yet</p>
            <p className="text-sm text-gray-400">
              Create your first workspace to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace: WorkspaceList) => (
              <Link
                key={workspace.id}
                href={`/workspaces/${workspace.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {workspace.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {workspace.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={workspace.owner.avatar_url || '/default-avatar.png'}
                      alt={workspace.owner.name}
                      width={32}
                      height={32}
                      unoptimized
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-700">
                      {workspace.owner.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(workspace.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}