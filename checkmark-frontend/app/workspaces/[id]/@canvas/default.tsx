// app/workspaces/[id]/@canvas/default.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePresence } from '@/lib/websocket/use-presence';
import PresenceAvatars from '@/components/workspace/PresenceAvatars';
import ChartRenderer from '@/components/charts/ChartRenderer';
import ChartGallery from '@/components/charts/ChartGallery';
import { chartAPI } from '@/lib/api/python-client';
import type { Chart } from '@/types/api';

interface WorkspaceCanvasProps {
  params: Promise<{ id: string }>;
}

interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
}

export default function WorkspaceCanvas({ params }: WorkspaceCanvasProps) {
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  React.useEffect(() => {
    params.then(({ id }) => setWorkspaceId(id));
  }, [params]);

  const currentUser: CurrentUser = {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  };

  const { users, isConnected, connectionError } = usePresence({
    workspaceId: workspaceId!,
    currentUser,
  });

  // Load charts
  useEffect(() => {
    if (!workspaceId) return;

    const loadCharts = async () => {
      try {
        setIsLoading(true);
        const data = await chartAPI.list(workspaceId);
        setCharts(data);
      } catch (error) {
        console.error('Failed to load charts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharts();
  }, [workspaceId]);

  const handleChartCreated = async () => {
    if (!workspaceId) return;
    
    setShowGallery(false);
    const data = await chartAPI.list(workspaceId);
    setCharts(data);
  };

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
        <div className="flex items-center justify-between">
          <PresenceAvatars users={users} isConnected={isConnected} />
          <button
            onClick={() => setShowGallery(!showGallery)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showGallery ? 'Hide Gallery' : '+ New Chart'}
          </button>
        </div>
        {connectionError && (
          <div className="mt-2 text-xs text-red-600">
            ⚠️ {connectionError}
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chart Gallery Sidebar */}
        {showGallery && (
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <ChartGallery 
              workspaceId={workspaceId} 
              onChartCreated={handleChartCreated}
            />
          </div>
        )}

        {/* Charts Display */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading charts...</p>
              </div>
            </div>
          ) : charts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Charts Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first chart to start visualizing your data in 3D!
                </p>
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Your First Chart
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {chart.name}
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {chart.type}
                    </span>
                  </div>
                  {chart.config && (
                    <ChartRenderer config={chart.config} height="500px" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}