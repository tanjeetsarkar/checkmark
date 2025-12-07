// components/workspace/NewWorkspaceButton.tsx
'use client';

import { useState } from 'react';
import { createWorkspace } from '@/lib/actions/workspace-actions';

export default function NewWorkspaceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    // Call the Server Action
    const result = await createWorkspace({ name, description });

    if (result.success) {
      // Close modal and reset form
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || 'Failed to create workspace');
    }

    setIsLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        + New Workspace
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create New Workspace</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Sales Analytics Q4"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What is this workspace for?"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
// ```

// **🔑 Key Changes:**
// - Form with actual inputs
// - `handleSubmit` calls the Server Action
// - Loading and error states
// - Type-safe throughout!

// ---

// ## ✅ Test It!

// 1. Click "New Workspace"
// 2. Fill in the form:
//    - Name: "Test Workspace"
//    - Description: "Testing server actions"
// 3. Click "Create"
// 4. Watch it:
//    - Show "Creating..." while loading
//    - Close the modal
//    - **The page should refresh and show your new workspace!**

// ---

// ## 🎓 Understanding What Just Happened
// ```
// User clicks "Create"
//          ↓
// Client Component calls createWorkspace()
//          ↓
// Next.js sends request to server
//          ↓
// Server Action runs (creates workspace)
//          ↓
// revalidatePath('/workspaces') invalidates cache
//          ↓
// Server re-fetches data in WorkspacesPage
//          ↓
// New HTML sent to browser
//          ↓
// Page updates with new workspace!