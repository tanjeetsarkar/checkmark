// lib/actions/workspace-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { workspaceAPI } from '@/lib/api/python-client';
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceActionResult,
  DeleteActionResult,
} from '@/types/api';

export async function createWorkspace(
  input: CreateWorkspaceInput
): Promise<WorkspaceActionResult> {
  try {
    // Validate input
    if (!input.name.trim()) {
      return { success: false, error: 'Name is required' };
    }

    if (input.name.length < 3) {
      return { success: false, error: 'Name must be at least 3 characters' };
    }

    // Call Python API
    const newWorkspace = await workspaceAPI.create({
      name: input.name,
      description: input.description,
    });

    // Revalidate the workspaces page cache
    revalidatePath('/workspaces');

    return { success: true, workspace: newWorkspace };
  } catch (error) {
    console.error('Failed to create workspace:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create workspace';
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<WorkspaceActionResult> {
  try {
    const updatedWorkspace = await workspaceAPI.update(workspaceId, input);
    
    revalidatePath('/workspaces');
    revalidatePath(`/workspaces/${workspaceId}`);

    return { success: true, workspace: updatedWorkspace };
  } catch (error) {
    console.error('Failed to update workspace:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update workspace';
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export async function deleteWorkspace(
  workspaceId: string
): Promise<DeleteActionResult> {
  try {
    await workspaceAPI.delete(workspaceId);
    
    revalidatePath('/workspaces');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete workspace:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete workspace';
    return { 
      success: false, 
      error: errorMessage
    };
  }
}