'use client';

import React, { useState } from 'react';
import { chartPresets, type ChartPresetType } from '@/lib/charts/presets';
import { chartAPI } from '@/lib/api/python-client';
import type { ChartType } from '@/types/api';

interface ChartGalleryProps {
  workspaceId: string;
  onChartCreated?: () => void;
}

const chartTypes: Array<{
  id: ChartPresetType;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'scatter3D',
    name: '3D Scatter Plot',
    description: 'Visualize data points in 3D space',
    icon: '📊',
  },
  {
    id: 'bar3D',
    name: '3D Bar Chart',
    description: 'Compare values with 3D bars',
    icon: '📈',
  },
  {
    id: 'surface',
    name: '3D Surface',
    description: 'Show continuous data as a surface',
    icon: '🌊',
  },
  {
    id: 'line',
    name: 'Line Chart',
    description: 'Track trends over time',
    icon: '📉',
  },
  {
    id: 'bar',
    name: 'Bar Chart',
    description: 'Compare categorical data',
    icon: '📊',
  },
];

export default function ChartGallery({ workspaceId, onChartCreated }: ChartGalleryProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateChart = async (presetId: ChartPresetType) => {
    setIsCreating(true);
    setError(null);

    try {
      const config = chartPresets[presetId]();
      const chartType = presetId as ChartType;

      await chartAPI.create(
        workspaceId,
        {
          name: `${chartTypes.find(t => t.id === presetId)?.name} - ${new Date().toLocaleDateString()}`,
          type: chartType,
          workspace_id: workspaceId,
          config: config,
          data: {},
        }
      );

      onChartCreated?.();
    } catch (err) {
      console.error('Failed to create chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to create chart');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Create New Chart
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {chartTypes.map((chart) => (
          <button
            key={chart.id}
            onClick={() => handleCreateChart(chart.id)}
            disabled={isCreating}
            className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">{chart.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{chart.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{chart.description}</p>
            </div>
          </button>
        ))}
      </div>

      {isCreating && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Creating chart...
        </div>
      )}
    </div>
  );
}