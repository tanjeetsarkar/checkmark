// app/workspaces/page.tsx
import Image from "next/image";
import { getWorkspaces } from "@/lib/api/mock-data";
import NewWorkspaceButton from "@/components/workspace/NewWorkspaceButton";
import Link from "next/link";

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Workspaces
            </h1>
            <p className="text-gray-600">
              Collaborate on data visualizations in real-time
            </p>
          </div>
          <NewWorkspaceButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {workspace.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {workspace.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={workspace.owner.avatar || '/default-avatar.png'}
                    alt={workspace.owner.name}
                    width={32}
                    height={32}
                    unoptimized
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-700">
                    {workspace.owner.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {workspace.members.length} members
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
// ```

// ---

// ## ✅ Test It!

// 1. Click the "New Workspace" button
// 2. You should see a modal open
// 3. Click "Close" to dismiss it

// ---

// ## 🎓 Understanding the Pattern
// ```
// Server Component (WorkspacesPage)
// ├─ Fetches data (async/await)
// ├─ Renders static content
// └─ Embeds Client Component (NewWorkspaceButton)
//     └─ Handles interactivity (useState, onClick)
// ```

// **This is called the Composition Pattern:**
// - Server Component as the "shell"
// - Client Components for interactive "islands"
// - Best of both worlds!

// ---

// ## 🧠 Key Rules to Remember

// ### Server Components CAN:
// - ✅ Fetch data with async/await
// - ✅ Access backend directly
// - ✅ Import and render Client Components
// - ✅ Be async functions

// ### Server Components CANNOT:
// - ❌ Use hooks (useState, useEffect, etc.)
// - ❌ Use browser APIs (window, localStorage, etc.)
// - ❌ Have event handlers (onClick, onChange, etc.)

// ### Client Components CAN:
// - ✅ Use hooks
// - ✅ Have event handlers
// - ✅ Access browser APIs
// - ✅ Import and render other Client Components

// ### Client Components CANNOT:
// - ❌ Be async functions
// - ❌ Import Server Components directly (but can receive them as props/children)

// ---

// ## 📊 JavaScript Bundle Impact
// ```
// Without 'use client':
// └─ Code stays on server, HTML sent to browser

// With 'use client':
// └─ Code sent to browser as JavaScript bundle