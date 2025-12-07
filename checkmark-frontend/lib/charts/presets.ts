import type { EChartsOption } from 'echarts';

// Generate sample 3D scatter data
function generateScatter3DData(count: number = 100) {
  const data: number[][] = [];
  for (let i = 0; i < count; i++) {
    data.push([
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
    ]);
  }
  return data;
}

// Generate sample 3D bar data
function generateBar3DData() {
  const data: Array<[number, number, number]> = [];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const value = Math.random() * 100;
      data.push([x, y, value]);
    }
  }
  return data;
}

// Generate sample surface data
function generateSurfaceData() {
  const data: number[][] = [];
  for (let x = -30; x < 30; x++) {
    const row: number[] = [];
    for (let y = -30; y < 30; y++) {
      const value = Math.sin(x / 10) * Math.cos(y / 10) * 50 + 50;
      row.push(value);
    }
    data.push(row);
  }
  return data;
}

export const chartPresets = {
  scatter3D: (): EChartsOption => ({
    title: {
      text: '3D Scatter Plot',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
      },
    },
    tooltip: {
      formatter: (params: any) => {
        const data = params.data;
        return `X: ${data[0].toFixed(2)}<br/>Y: ${data[1].toFixed(2)}<br/>Z: ${data[2].toFixed(2)}`;
      },
    },
    grid3D: {
      viewControl: {
        autoRotate: true,
        distance: 200,
        rotateSensitivity: 1,
        zoomSensitivity: 1,
      },
      boxWidth: 100,
      boxDepth: 100,
      boxHeight: 100,
    },
    xAxis3D: {
      name: 'X Axis',
      type: 'value',
    },
    yAxis3D: {
      name: 'Y Axis',
      type: 'value',
    },
    zAxis3D: {
      name: 'Z Axis',
      type: 'value',
    },
    series: [
      {
        type: 'scatter3D',
        data: generateScatter3DData(),
        symbolSize: 5,
        itemStyle: {
          color: '#4F46E5',
          opacity: 0.8,
        },
        emphasis: {
          itemStyle: {
            color: '#818CF8',
          },
        },
      },
    ],
  }),

  bar3D: (): EChartsOption => ({
    title: {
      text: '3D Bar Chart',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
      },
    },
    tooltip: {
      formatter: (params: any) => {
        const data = params.data;
        return `Position: (${data[0]}, ${data[1]})<br/>Value: ${data[2].toFixed(2)}`;
      },
    },
    grid3D: {
      viewControl: {
        autoRotate: false,
        distance: 150,
      },
      boxWidth: 100,
      boxDepth: 100,
      boxHeight: 100,
    },
    xAxis3D: {
      name: 'X',
      type: 'value',
    },
    yAxis3D: {
      name: 'Y',
      type: 'value',
    },
    zAxis3D: {
      name: 'Value',
      type: 'value',
    },
    series: [
      {
        type: 'bar3D',
        data: generateBar3DData(),
        // shading: 'lambert',
        itemStyle: {
          color: (params: any) => {
            const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];
            return colors[params.dataIndex % colors.length];
          },
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            color: '#818CF8',
          },
        },
      },
    ],
  }),

  surface: (): EChartsOption => ({
    title: {
      text: '3D Surface Plot',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
      },
    },
    tooltip: {
      formatter: (params: any) => {
        return `Value: ${params.data[2]?.toFixed(2) || 'N/A'}`;
      },
    },
    visualMap: {
      show: true,
      dimension: 2,
      min: 0,
      max: 100,
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
    },
    grid3D: {
      viewControl: {
        autoRotate: true,
        distance: 150,
      },
      boxWidth: 100,
      boxDepth: 100,
      boxHeight: 50,
    },
    xAxis3D: {
      name: 'X',
      type: 'value',
    },
    yAxis3D: {
      name: 'Y',
      type: 'value',
    },
    zAxis3D: {
      name: 'Height',
      type: 'value',
    },
    series: [
      {
        type: 'surface',
        data: generateSurfaceData(),
        shading: 'realistic',
        itemStyle: {
          opacity: 0.9,
        },
      },
    ],
  }),

  line: (): EChartsOption => ({
    title: {
      text: 'Line Chart',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Sales',
        type: 'line',
        data: [150, 230, 224, 218, 135, 147, 260],
        smooth: true,
        itemStyle: {
          color: '#4F46E5',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 70, 229, 0.3)' },
              { offset: 1, color: 'rgba(79, 70, 229, 0.05)' },
            ],
          },
        },
      },
    ],
  }),

  bar: (): EChartsOption => ({
    title: {
      text: 'Bar Chart',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [320, 280, 350, 410, 290],
        itemStyle: {
          color: '#4F46E5',
        },
        emphasis: {
          itemStyle: {
            color: '#818CF8',
          },
        },
      },
    ],
  }),
};

export type ChartPresetType = keyof typeof chartPresets;