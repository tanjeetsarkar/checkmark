// lib/websocket/use-presence.ts
'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { PresenceUser, WebSocketMessage } from '@/types/websocket';
import { useWebSocket } from './use-websocket';

interface UsePresenceOptions {
  workspaceId: string;
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
}

// Generate color based on user ID (deterministic)
function getUserColor(userId: string): string {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
  ];
  
  // Simple hash function to get consistent color for user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function usePresence({ workspaceId, currentUser }: UsePresenceOptions) {
  const [users, setUsers] = useState<Map<string, PresenceUser>>(new Map());
  const [isReady, setIsReady] = useState(false);
  const announcedConnectionIdRef = useRef<number>(0);
  const currentConnectionIdRef = useRef<number>(0);

  // Generate user color deterministically based on ID
  const userColor = useMemo(() => getUserColor(currentUser.id), [currentUser.id]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'presence_join':
        setUsers((prev) => {
          const next = new Map(prev);
          next.set(message.payload.userId, message.payload.user);
          return next;
        });
        break;

      case 'presence_leave':
        setUsers((prev) => {
          const next = new Map(prev);
          next.delete(message.payload.userId);
          return next;
        });
        break;

      case 'cursor_move':
        setUsers((prev) => {
          const next = new Map(prev);
          const user = next.get(message.payload.userId);
          if (user) {
            next.set(message.payload.userId, {
              ...user,
              cursor: message.payload.cursor,
            });
          }
          return next;
        });
        break;
    }
  }, []);

  const handleConnect = useCallback(() => {
    console.log('Presence: Connected to workspace');
    // Increment connection ID on each connection
    currentConnectionIdRef.current += 1;
    setIsReady(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log('Presence: Disconnected from workspace');
    setIsReady(false);
  }, []);

  const { isConnected, connectionError, sendMessage } = useWebSocket({
    workspaceId,
    userId: currentUser.id,
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
  });

  // Announce presence when connected (only once per connection)
  useEffect(() => {
    if (isReady && announcedConnectionIdRef.current !== currentConnectionIdRef.current) {
      announcedConnectionIdRef.current = currentConnectionIdRef.current;
      
      sendMessage({
        type: 'presence_join',
        payload: {
          userId: currentUser.id,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            color: userColor,
          },
        },
        userId: currentUser.id,
        workspaceId,
      });
    }
  }, [isReady, currentUser, workspaceId, sendMessage, userColor]);

  const updateCursor = useCallback((x: number, y: number) => {
    if (isConnected) {
      sendMessage({
        type: 'cursor_move',
        payload: {
          userId: currentUser.id,
          cursor: { x, y },
        },
        userId: currentUser.id,
        workspaceId,
      });
    }
  }, [isConnected, currentUser.id, workspaceId, sendMessage]);

  return {
    users,
    isConnected,
    isReady,
    connectionError,
    updateCursor,
  };
}