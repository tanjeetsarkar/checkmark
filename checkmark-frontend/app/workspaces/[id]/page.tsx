// import { getWorkspaceById } from "@/lib/api/mock-data"
// import Image from "next/image"
// import { notFound } from "next/navigation"


// interface WorkspacePageProps {
//     params: Promise<{
//         id: string
//     }>
// }

// export default async function WorkspacePage({ params }: WorkspacePageProps) {
export default async function WorkspacePage() {

    return null;

//     const { id } = await params

// //     if (id === 'error-test') {
// //     throw new Error('Testing error boundary!');
// //   }

//     const workspace = await getWorkspaceById(id)

//     if (!workspace) {
//         notFound()
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-8 py-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900">
//                                 {workspace.name}
//                             </h1>
//                             <p className="text-gray-600 mt-1">{workspace.description}</p>
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <div className="flex items-center gap-2">
//                                 <Image
//                                     src={workspace.owner.avatar || '/default-avatar.png'}
//                                     alt={workspace.owner.name}
//                                     width={40}
//                                     height={40}
//                                     unoptimized
//                                     className="rounded-full"
//                                 />
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-900">
//                                         {workspace.owner.name}
//                                     </p>
//                                     <p className="text-xs text-gray-500">Owner</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-8 py-8">
//                 <div className="bg-white rounded-lg border border-gray-200 p-8">
//                     <h2 className="text-xl font-semibold mb-4">Workspace Details</h2>
//                     <div className="space-y-3 text-gray-600">
//                         <p>
//                             <span className="font-medium text-gray-900">ID:</span>{' '}
//                             {workspace.id}
//                         </p>
//                         <p>
//                             <span className="font-medium text-gray-900">Created:</span>{' '}
//                             {new Date(workspace.createdAt).toLocaleDateString()}
//                         </p>
//                         <p>
//                             <span className="font-medium text-gray-900">Members:</span>{' '}
//                             {workspace.members.length}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
}