// lib/actions/workspace-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { CreateWorkspaceInput, Workspace } from '@/types/workspace';
import { addWorkspace } from '../api/mock-data';

// This simulates calling your Python backend
// Later we'll replace this with actual fetch to http://localhost:8000
export async function createWorkspace(
    input: CreateWorkspaceInput
): Promise<{ success: boolean; workspace?: Workspace; error?: string }> {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validate input
        if (!input.name.trim()) {
            return { success: false, error: 'Name is required' };
        }

        if (input.name.length < 3) {
            return { success: false, error: 'Name must be at least 3 characters' };
        }

        // Simulate creating workspace
        const newWorkspace: Workspace = {
            id: `ws-${Date.now()}`,
            name: input.name,
            description: input.description,
            owner: {
                id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            },
            members: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        console.log("new workspace ", newWorkspace)

        await addWorkspace(newWorkspace);

        // This would be a POST to your Python API:
        // const response = await fetch('http://localhost:8000/api/workspaces', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(input),
        // });

        // Revalidate the workspaces page cache
        revalidatePath('/workspaces');

        return { success: true, workspace: newWorkspace };
    } catch (error) {
        console.error('Failed to create workspace:', error);
        return { success: false, error: 'Failed to create workspace' };
    }
}