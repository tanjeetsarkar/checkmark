// app/workspaces/[id]/layout.tsx
import { notFound } from 'next/navigation';
import { workspaceAPI } from '@/lib/api/python-client';
import Image from 'next/image';
import type { Workspace } from '@/types/api';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  canvas: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function WorkspaceLayout({
  children,
  sidebar,
  canvas,
  params,
}: WorkspaceLayoutProps) {
  const { id } = await params;
  
  let workspace: Workspace;
  try {
    workspace = await workspaceAPI.get(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {workspace.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {workspace.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={workspace.owner.avatar_url || '/default-avatar.png'}
                alt={workspace.owner.name}
                width={32}
                height={32}
                unoptimized
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {workspace.owner.name}
                </p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Parallel Routes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Slot */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {sidebar}
        </div>

        {/* Canvas Slot */}
        <div className="flex-1 overflow-y-auto">
          {canvas}
        </div>
      </div>

      {/* Children (the page.tsx content) */}
      {children}
    </div>
  );
}