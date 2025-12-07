// lib/api/python-client.ts
import type {
  Workspace,
  WorkspaceList,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Chart,
  CreateChartInput,
  UpdateChartInput,
  ApiError,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ 
        detail: 'Unknown error' 
      }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Workspace API calls
export const workspaceAPI = {
  // Get all workspaces for a user
  list: async (userId: string = 'user-1'): Promise<WorkspaceList[]> => {
    return fetchAPI<WorkspaceList[]>(`/api/workspaces?user_id=${userId}`);
  },

  // Get single workspace with details
  get: async (workspaceId: string): Promise<Workspace> => {
    return fetchAPI<Workspace>(`/api/workspaces/${workspaceId}`);
  },

  // Create new workspace
  create: async (
    data: CreateWorkspaceInput, 
    userId: string = 'user-1'
  ): Promise<Workspace> => {
    return fetchAPI<Workspace>(`/api/workspaces?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update workspace
  update: async (
    workspaceId: string, 
    data: UpdateWorkspaceInput
  ): Promise<Workspace> => {
    return fetchAPI<Workspace>(`/api/workspaces/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete workspace
  delete: async (workspaceId: string): Promise<null> => {
    return fetchAPI<null>(`/api/workspaces/${workspaceId}`, {
      method: 'DELETE',
    });
  },
};

// Chart API calls
export const chartAPI = {
  // Get all charts in a workspace
  list: async (workspaceId: string): Promise<Chart[]> => {
    return fetchAPI<Chart[]>(`/api/workspaces/${workspaceId}/charts`);
  },

  // Get single chart
  get: async (chartId: string): Promise<Chart> => {
    return fetchAPI<Chart>(`/api/charts/${chartId}`);
  },

  // Create new chart
  create: async (
    workspaceId: string, 
    data: CreateChartInput, 
    userId: string = 'user-1'
  ): Promise<Chart> => {
    return fetchAPI<Chart>(
      `/api/workspaces/${workspaceId}/charts?user_id=${userId}`, 
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Update chart
  update: async (chartId: string, data: UpdateChartInput): Promise<Chart> => {
    return fetchAPI<Chart>(`/api/charts/${chartId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete chart
  delete: async (chartId: string): Promise<null> => {
    return fetchAPI<null>(`/api/charts/${chartId}`, {
      method: 'DELETE',
    });
  },
};