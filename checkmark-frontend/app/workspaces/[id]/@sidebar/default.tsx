import { getWorkspaceById } from '@/lib/api/mock-data';
import Image from 'next/image';

interface SidebarProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceSidebar({ params }: SidebarProps) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id);

  if (!workspace) return null;

  return (
    <div className="p-6">
      {/* Members Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Members</h2>
        <div className="space-y-3">
          {/* Owner */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
            <Image
              src={workspace.owner.avatar || '/default-avatar.png'}
              alt={workspace.owner.name}
              width={40}
              height={40}
              unoptimized
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {workspace.owner.name}
              </p>
              <p className="text-xs text-gray-500">{workspace.owner.email}</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Owner
            </span>
          </div>

          {/* Other Members */}
          {workspace.members.length > 0 ? (
            workspace.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <Image
                  src={member.avatar || '/default-avatar.png'}
                  alt={member.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No other members yet</p>
          )}
        </div>
      </div>

      {/* Workspace Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Workspace Info
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Created</p>
            <p className="text-gray-900 font-medium">
              {new Date(workspace.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Last Updated</p>
            <p className="text-gray-900 font-medium">
              {new Date(workspace.updatedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Workspace ID</p>
            <p className="text-gray-900 font-mono text-xs">{workspace.id}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Invite Members
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Workspace Settings
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}