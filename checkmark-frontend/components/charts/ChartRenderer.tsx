'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import type { EChartsOption } from 'echarts';

interface ChartRendererProps {
  config: EChartsOption;
  height?: string;
  className?: string;
}

export default function ChartRenderer({ 
  config, 
  height = '500px',
  className = '' 
}: ChartRendererProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    // Set options
    chartInstanceRef.current.setOption(config, true);

    // Handle resize
    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      style={{ height }} 
      className={`w-full ${className}`}
    />
  );
}