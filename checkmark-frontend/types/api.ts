// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// Workspace Member types
export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
  user: User;
}

// Workspace types
export interface WorkspaceBase {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner: User;
}

export type WorkspaceList = WorkspaceBase

export interface Workspace extends WorkspaceBase {
  members: WorkspaceMember[];
  charts?: Chart[];
}

export interface CreateWorkspaceInput {
  name: string;
  description: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}

// Chart types
export type ChartType = 'scatter3D' | 'bar3D' | 'surface' | 'line' | 'bar';

export interface Chart {
  id: string;
  name: string;
  type: ChartType;
  workspace_id: string;
  config: Record<string, unknown> | null;
  data: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChartInput {
  name: string;
  type: ChartType;
  workspace_id: string;
  config?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface UpdateChartInput {
  name?: string;
  type?: ChartType;
  config?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

// API Response types
export interface ApiError {
  detail: string;
}

export interface WorkspaceActionResult {
  success: boolean;
  workspace?: Workspace;
  error?: string;
}

export interface ChartActionResult {
  success: boolean;
  chart?: Chart;
  error?: string;
}

export interface DeleteActionResult {
  success: boolean;
  error?: string;
}