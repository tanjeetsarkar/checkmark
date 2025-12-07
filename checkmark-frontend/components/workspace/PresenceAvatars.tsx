'use client';

import Image from 'next/image';
import { PresenceUser } from '@/types/websocket';

interface PresenceAvatarsProps {
  users: Map<string, PresenceUser>;
  isConnected: boolean;
}

export default function PresenceAvatars({ users, isConnected }: PresenceAvatarsProps) {
  const userArray = Array.from(users.values());

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
        <span className="text-xs text-gray-600">
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      {/* User Avatars */}
      {userArray.length > 0 && (
        <div className="flex items-center">
          <span className="text-xs text-gray-600 mr-2">
            {userArray.length} online:
          </span>
          <div className="flex -space-x-2">
            {userArray.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="relative"
                title={user.name}
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  unoptimized
                  className="rounded-full border-2 border-white"
                  style={{ borderColor: user.color }}
                />
              </div>
            ))}
            {userArray.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{userArray.length - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}