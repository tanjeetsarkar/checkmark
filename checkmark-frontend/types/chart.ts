import type { EChartsOption } from 'echarts';

export interface ChartData {
  labels?: string[];
  datasets?: Array<{
    label: string;
    data: number[] | number[][];
    color?: string;
  }>;
  series?: Array<{
    name: string;
    type: string;
    data: number[][] | number[];
  }>;
}

export interface Chart3DConfig {
  type: '3d_scatter' | '3d_bar' | '3d_surface';
  title?: string;
  xAxis?: {
    name?: string;
    type?: string;
  };
  yAxis?: {
    name?: string;
    type?: string;
  };
  zAxis?: {
    name?: string;
    type?: string;
  };
  grid3D?: {
    viewControl?: {
      autoRotate?: boolean;
      distance?: number;
    };
  };
}

export interface ChartConfig extends EChartsOption {
  custom?: Chart3DConfig;
}