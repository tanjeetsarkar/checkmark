import { Workspace, User } from "@/types/workspace";

const mockUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
};

const initialWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Sales Analytics Q4",
    description: "Real-time sales data visualization and team collaboration",
    owner: mockUser,
    members: [mockUser],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ws-2",
    name: "Marketing Dashboard",
    description: "Campaign performance metrics with 3D charts",
    owner: mockUser,
    members: [mockUser],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ws-3",
    name: "Engineering Metrics",
    description: "Code quality and deployment visualization",
    owner: mockUser,
    members: [mockUser],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


// Extend the global type to include our store
declare global {
  var workspacesStore: Workspace[] | undefined;
}

// Initialize global store if it doesn't exist
if (!global.workspacesStore) {
  global.workspacesStore = [...initialWorkspaces];
}

// Simulate API delay
export async function getWorkspaces(): Promise<Workspace[]> {
  // Later this will call your Python backend
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...global.workspacesStore!];
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('getWorkspaceById - Looking for:', id);
  console.log('Available IDs:', global.workspacesStore!.map(ws => ws.id));
  const workspace = global.workspacesStore!.find((ws) => ws.id === id);
  console.log('Found workspace:', workspace ? workspace.name : 'NOT FOUND');
  return workspace || null;
}

export async function addWorkspace(workspace: Workspace): Promise<Workspace> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  global.workspacesStore!.push(workspace);
  console.log('addWorkspace - Added:', workspace.id, workspace.name);
  console.log('New total:', global.workspacesStore!.length);
  return workspace;
}

export { mockUser };