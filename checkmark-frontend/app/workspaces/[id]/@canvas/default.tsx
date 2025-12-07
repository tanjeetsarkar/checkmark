// app/workspaces/[id]/@canvas/default.tsx
'use client';

import React from 'react';
import { usePresence } from '@/lib/websocket/use-presence';
import PresenceAvatars from '@/components/workspace/PresenceAvatars';

interface WorkspaceCanvasProps {
    params: Promise<{ id: string }>;
}

export default function WorkspaceCanvas({ params }: WorkspaceCanvasProps) {
    const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);

    React.useEffect(() => {
        params.then(({ id }) => setWorkspaceId(id));
    }, [params]);

    // Mock current user (in production, this comes from auth)
    const currentUser = {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    };

    const { users, isConnected, isReady, connectionError } = usePresence({
        workspaceId: workspaceId!,
        currentUser,
    });

    // Don't connect until we have a workspace ID
    if (!workspaceId) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Presence Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <PresenceAvatars users={users} isConnected={isConnected} />
                {connectionError && (
                    <div className="mt-2 text-xs text-red-600">
                        ⚠️ {connectionError}
                    </div>
                )}
            </div>

            {/* Canvas Content */}
            <div className="flex-1 flex items-center justify-center p-8">
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
                        ECharts integration in Phase 3!
                    </p>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-indigo-900">
                            💡 <strong>Real-time Status:</strong>{' '}
                            {isConnected
                                ? '✅ Connected and ready for collaboration!'
                                : '🔄 Connecting to WebSocket server...'}
                        </p>
                    </div>

                    {/* Debug Info */}
                    <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-xs font-mono text-gray-700 mb-2">
                            <strong>Connection Info:</strong>
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>Workspace ID: {workspaceId}</li>
                            <li>User ID: {currentUser.id}</li>
                            <li>Connected: {isConnected ? '✅' : '❌'}</li>
                            <li>Ready: {isReady ? '✅' : '❌'}</li>
                            <li>Users Online: {users.size}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}